const {lastCommand} = require("./lastCommand");
const { spawn } = require('child_process');

// Create a persistent shell
let shell = spawn('sh', [], { stdio: ['pipe', 'pipe', 'pipe'] });
const delimiter = 'COMMAND_FINISHED_DELIMITER';
let output = "";

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
            output += data;
            console.log('data', data)
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
            lastCommand.type = 'terminal';
            lastCommand.body = req.body;
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
        shell.stdin.write(`${command}; echo ${delimiter}\n`);
    } else {
        res.status(405).json({ message: 'Method not allowed. Please use POST.' });
    }
}

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

module.exports = {interruptHandler, terminalHandler};

