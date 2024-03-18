// Express server setup
const express = require('express');
const http = require('http');
const path = require('path');
const {terminalHandler, interruptHandler} = require('./api/terminal');
const commandHandler = require('./api/commandHandler');
const socketSetup = require('./socketSetup');
const localtunnel = require('localtunnel');
const inquirer = require('inquirer');
const crypto = require('crypto');
const fs = require('fs');

const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.1', // OpenAPI spec version
        info: {
            title: 'Terminal for ChatGPT', // Title of your API
            version: '1.0.0', // Version of your API
        },
    },
    apis: ['./api/*.js'], // Path to your endpoint definitions
};
const openapiSpecification = swaggerJsdoc(options);
openapiSpecification.components = {
    "schemas": {}
};
console.log(openapiSpecification);

const configFilePath = './config.json';
let configPromise;

const _log = [];
function log(...args) {
    console.log(...args);
    _log.push(args);
}

//TODO https://chat.openai.com/c/f7908c84-8791-4b94-aa07-d3fae57c84ef
//add generated key to protect endpoints

// Check if config file exists
if (fs.existsSync(configFilePath)) {
    log('Configuration already exists.');
    try {
        const configFile = fs.readFileSync(configFilePath);
        configPromise = Promise.resolve(JSON.parse(configFile));
        log('Configuration loaded');
    } catch (error) {
        console.error('Error reading the config file:', error);
    }
} else {
    // Start interactive setup
    configPromise = inquirer.prompt([
        {
            name: 'port',
            type: 'input',
            message: 'Enter the port on which to start the server (default 3000):',
            default: 3000,
            validate: input => !isNaN(parseInt(input)) || 'Please enter a valid number'
        },
        {
            name: 'useLocalTunnel',
            type: 'confirm',
            message: 'Do you want to use Local Tunnel to expose your server?'
        },
        {
            name: 'localTunnelSubdomain',
            type: 'input',
            default: 'chatgpt-server-commander-' + Math.random(),
            message: 'Enter the preferred subdomain name for Local Tunnel:',
            when: answers => answers.useLocalTunnel,
            validate: input => input !== '' || 'Subdomain name cannot be empty'
        }
    ]).then(answers => {
        // Generate authorization token
        const authToken = crypto.randomBytes(16).toString('hex');

        // Create config object
        const config = {
            port: answers.port,
            useLocalTunnel: answers.useLocalTunnel,
            localTunnelSubdomain: answers.useLocalTunnel ? answers.localTunnelSubdomain : null,
            authToken: authToken
        };

        // Save config to file
        fs.writeFileSync(configFilePath, JSON.stringify(config, null, 4));
        log('Configuration saved to config.json');
        return config;
    }).catch(error => {
        console.error('Error during setup:', error);
    });
}

module.exports = async () => {
    log('start');
    const config = await configPromise;
    log('got config', config);
    const expressApp = express();
    const server = http.createServer(expressApp);
    expressApp.use(express.json());

    socketSetup(server);
    expressApp.get('/log', (req, res) => {
        res.set('Content-Type', 'text/html');
        res.send(_log.map(l => '</br>' + JSON.stringify(l)).join('\n'));
    });

    expressApp.use(express.static(path.join(__dirname, 'public')));

    expressApp.get('/openapi.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(openapiSpecification);
    });

    expressApp.use((req, res, next) => {
        const bearerHeader = req.headers['authorization'];
        log('request auth check', req.path, Object.keys(req.headers));
        if (typeof bearerHeader !== 'undefined') {
            const bearerToken = bearerHeader.split(' ')[1];
            // Verify the token here (e.g., using a library like jsonwebtoken)
            if (bearerToken === config.authToken) {
                // Token is valid, proceed to the next middleware
                next();
            } else {
                res.sendStatus(403); // Forbidden
            }
        } else {
            res.sendStatus(401); // Unauthorized
        }
    });
    //
    expressApp.post('/api/runTerminalScript', terminalHandler);
    expressApp.post("/api/saveCommand", commandHandler.save);
    expressApp.get("/api/listCommands", commandHandler.list);
    expressApp.get("/api/printCommand/:id", commandHandler.print);
    expressApp.put("/api/updateCommand/:id", commandHandler.update);
    expressApp.delete("/api/removeCommand/:id", commandHandler.remove);

    const getSentenceVectors = require("./api/sentenceVector.js");

    expressApp.post("/api/getSentenceVectors", async (req, res) => {
        const { text } = req.body;
        if (!text) {
            res.status(400).send({ error: "Text is required." });
            return;
        }

        try {
            const results = await getSentenceVectors(text);
            log(results);
            res.status(200).send(results);
        } catch (error) {
            res.status(500).send({ error: "Failed to process the request." });
        }
    });

    // Add the new route for the interrupt endpoint
    // General error handling middleware
    expressApp.use((err, req, res, next) => {
        console.error(err.stack); // Log error stack trace to server console
        res.status(500).send({ error: err.message, stack: err.stack });
    });

    expressApp.post("/api/interrupt", interruptHandler);

    server.listen(config.port, () => {
        log('Server running on http://localhost:' + config.port);
        if(config.useLocalTunnel) localtunnel({ port: config.port, subdomain: config.localTunnelSubdomain }).then(tunnel => {
            log('tunnel created at', tunnel.url);
            openapiSpecification.servers = [{
                url: tunnel.url,
            }];
            tunnel.on('close', () => {
                // tunnels are closed
            });
        });
        // the assigned public url for your tunnel
        // i.e. https://abcdefgjhij.localtunnel.me
    });
    return server;
};



