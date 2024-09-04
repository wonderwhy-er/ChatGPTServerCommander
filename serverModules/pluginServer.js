const express = require('express');
const http = require('http');
const path = require('path');
const socketSetup = require('./socketSetup');
const { configPromise } = require('./configHandler');
const { openapiSpecification, setURL } = require('./swaggerSetup');
const {addApi} = require("./apiRoutes");
const {log, getLog} = require("./logger");
const {initTunnel} = require("./setupTunnel");
const {initDB} = require("./firebaseDB");
const {viewAppHandler, editAppHandler} = require("../api/firebaseAppHandlers");
const fs = require('fs');
const marked = require('marked');

module.exports = async () => {
    log('start');
    initDB();
    const config = await configPromise;
    log('got config', config);
    const expressApp = express();
    const server = http.createServer(expressApp);
    expressApp.use(express.json());

    log('serving static from', path.join(__dirname, '..', 'public'));
    expressApp.use(express.static(path.join(__dirname, '..', 'public')));

// Render README.md at the root route ('/')


openapiSpecification(expressApp);
    const {viewAppHandler, editAppHandler} = require('../api/firebaseAppHandlers');
    expressApp.get('/api/apps/view/:public_id', viewAppHandler);
    expressApp.get('/api/apps/edit/:private_id', editAppHandler);
    expressApp.get('/access/:token', require('./fileAccessHandler').retrieveFile);

    expressApp.get('/', (req, res) => {
        const readmePath = path.join(__dirname, '..', 'README.md');
        fs.readFile(readmePath, 'utf8', (err, data) => {
            if (err) {
                res.status(500).send('Error reading README.md');
                return;
            }
const htmlContent = marked.parse(data);
            res.send(`<html><body>${htmlContent}</body></html>`);  // Send HTML response
        });
    });

    expressApp.use(require('./auth.js')(log, config));

    let serverUrl = config.productionDomain;
    let activeTunnel;
    addApi(expressApp, config, () => serverUrl, () => activeTunnel && activeTunnel.close());

    expressApp.use((err, req, res, next) => {
        console.error(err.stack); // Log error stack trace to server console
        res.status(500).send({ error: err.message, stack: err.stack });
    });

    server.listen(config.port, () => {
        log('Server running on http://localhost:' + config.port);
        if (config.useLocalTunnel) {
            initTunnel(config).then((data) => {
                    if (!data) {
                        process.exit();
                    } else {
                        activeTunnel = data.tunnel;
                        serverUrl = data.url;
                        log('set url to', data.url);
                    }
                }
            );
        } else {
            setURL(serverUrl);
        }
    });
    return server;
};
