const { spawn } = require('child_process');

// Create a persistent shell
let shell = spawn('zsh', [], { stdio: ['pipe', 'pipe', 'pipe'] });
shell.stdin.write('source ~/.zshrc\n');
const delimiter = 'COMMAND_FINISHED_DELIMITER';
let output = "";

/**
 * @openapi
 * /api/runTerminalScript:
 *   post:
 *     summary: Execute a shell command - from git commands to running code, listing files, or anything else that's possible to do through a shell command.
 *     description: This endpoint allows users to execute arbitrary shell commands, use it only after checking listCommands to check if appropriate command was created before.
 *     operationId: runTerminalScript
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               command:
 *                 type: string
 *                 description: The shell command to execute.
 *             required:
 *               - command
 *     responses:
 *       '200':
 *         description: Command executed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating the success of the command execution.
 *                 output:
 *                   type: string
 *                   description: The output of the executed command.
 *       '400':
 *         description: Bad request (e.g., missing command parameter).
 *       '500':
 *         description: Internal server error (e.g., error executing command).
 */
function terminalHandler(req, res) {
    console.log('execute command');
    res.setHeader('Access-Control-Allow-Origin', 'https://chat.openai.com');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, openai-conversation-id, openai-ephemeral-user-id');
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Handle preflight request (OPTIONS method)
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    if (req.method === 'POST') {
        const { command } = req.body;
        if (!command) {
            return res.status(400).json({ message: 'Command parameter is required.' });
        }

        const getOutput = (data) => {
            let timeoutId = setTimeout(() => {
                console.log("Command timed out.");
                shell.stdin.write("\x03"); // Send Ctrl+C to interrupt
                processOutput(output + "\n[INFO] Command timed out.");
                output = "";
            }, 10000); // 10-second timeout
            output += data.toString();
            console.log('data', data.toString())
            clearTimeout(timeoutId);
            if (output.includes(delimiter)) {
                console.log('delimeter found');
                // Remove the delimiter from the output
                output = output.replace(delimiter, '');
                processOutput(output);
                output = '';
            }
        };
        shell.stdout.on('data', getOutput);
        const getError  = (data) => {
            output += data;
        };
        shell.stderr.on('data', getError);

        function processOutput(output) {
            console.log(`Command executed successfully. Output: ${output}`);
            shell.stdout.removeListener('data', getOutput);
            shell.stderr.removeListener('data', getError);
            if (output.length < 4097) {
                return res.status(200).json({ message: 'Command executed successfully.', output });
            } else {
                return res.status(200).json({ message: 'Command executed successfully. But size is too big, returning 3900 first symbols', output: output.substr(0, 3900) });
            }
        }

        // Append the delimiter to the command
        console.log(command);
        shell.stdin.write(`${command}; echo ${delimiter}\n`);
    } else {
        res.status(405).json({ message: 'Method not allowed. Please use POST.' });
    }
}

/**
 * @openapi
 * /api/interrupt:
 *   post:
 *     summary: Interrupts a running terminal command.
 *     description: This endpoint allows users to send a SIGINT signal to interrupt any currently running terminal command.
 *     operationId: interruptCommand
 *     responses:
 *       200:
 *         description: Command interrupted successfully.
 *       405:
 *         description: Method not allowed. Please use POST.
 */
function interruptHandler(req, res) {
    if (req.method === "POST") {
        // Send SIGKILL to terminate the shell
        shell.kill("SIGKILL");
        console.log("Sent SIGKILL to terminate the command.");
        
        // Create a new shell instance
        shell = spawn('sh', [], { stdio: ['pipe', 'pipe', 'pipe'] });
        
        // Return the latest output and then reset it
        res.status(200).json({ message: "Command interrupted.", output });
        output = "";
    } else {
        res.status(405).json({ message: "Method not allowed. Please use POST." });
    }
}

function getCurrentDirectory() {
    return new Promise((resolve, reject) => {
        shell.stdin.write("pwd\n");
        shell.stdout.once('data', (data) => {
            resolve(data.toString().trim());
        });
        shell.stderr.once('data', (data) => {
            reject(new Error(data.toString().trim()));
        });
    });
}

module.exports = {getCurrentDirectory, interruptHandler, terminalHandler};