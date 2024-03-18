// Configuration Handler
const fs = require('fs');
const inquirer = require('inquirer');
const crypto = require('crypto');

const configFilePath = './config/config.json';
let configPromise;

// Check if config file exists
if (fs.existsSync(configFilePath)) {
    console.log('Configuration already exists.');
    try {
        const configFile = fs.readFileSync(configFilePath);
        configPromise = Promise.resolve(JSON.parse(configFile));
        console.log('Configuration loaded');
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
        console.log('Configuration saved to config.json');
        return config;
    }).catch(error => {
        console.error('Error during setup:', error);
    });
}

module.exports = { configPromise };
