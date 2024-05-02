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

    openapiSpecification(expressApp);
    const {viewAppHandler, editAppHandler} = require('../api/firebaseAppHandlers');
    expressApp.get('/api/apps/view/:public_id', viewAppHandler);
    expressApp.get('/api/apps/edit/:private_id', editAppHandler);
    expressApp.get('/access/:token', require('./fileAccessHandler').retrieveFile);
    expressApp.use(require('./auth.js')(log, config));

    let serverUrl = '';
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
        }
    });
    return server;
};
