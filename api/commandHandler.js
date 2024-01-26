const fs = require("fs");
const path = require("path");
const terminal = require("./terminal");
const {lastCommand} = require("./lastCommand");

const save = (req, res) => {
    const { name, description } = req.body;

    // Append to commands.txt
    fs.appendFileSync(path.join(__dirname, "commands.txt"), `${name} - ${description} - (${lastCommand.type})\n`);

    // Write JSON to a new file in commands folder
    fs.writeFileSync(path.join(__dirname, "commands", `${name}.json`), JSON.stringify(lastCommand.body, null, 2));

    res.send({ message: "Command saved successfully." });
};

const list = (req, res) => {
    try {
        const commandsContent = fs.readFileSync(path.join(__dirname, "commands.txt"), "utf-8");
        res.send(commandsContent);
    } catch (error) {
        res.status(500).send({ message: "Error reading commands.txt", error: error.message });
    }
};

const run = (req, res) => {
    const { name } = req.body;
    try {
        req.body = JSON.parse(fs.readFileSync(path.join(__dirname, "commands", `${name}.json`), "utf-8"));
        const commandsContent = fs.readFileSync(path.join(__dirname, "commands.txt"), "utf-8");
        const commandLines = commandsContent.split("\n");
        const commandDescription = commandLines.find(line => line.startsWith(name));
        const type = commandDescription.split('- (')[1].split(')')[0];
        if (type === 'terminal') {
            terminal(req, res);
        }
    } catch (error) {
        res.status(500).send({ message: "Error processing the request.", error: error.message });
    }
};
const update = (req, res) => {
    //TODO
};
const remove = (req, res) => {
    //TODO
};
const print = (req, res) => {
    const commandId = req.params.id;
    try {
        const commandsContent = fs.readFileSync(path.join(__dirname, "commands.txt"), "utf-8");
        const commandLines = commandsContent.split("\n");
        const commandDescription = commandLines.find(line => line.startsWith(commandId));
        if (!commandDescription) {
            res.status(404).send("Command not found.");
            return;
        }
        const commandFileContent = fs.readFileSync(path.join(__dirname, "commands", `${commandId}.json`), "utf-8");
        res.send(`${commandDescription}
${commandFileContent}`);
    } catch (error) {
        res.status(500).send({ message: "Error processing the request.", error: error.message });
    }
};


module.exports = {
    print,
    save,
    run,
    list,
    update,
    remove,
};