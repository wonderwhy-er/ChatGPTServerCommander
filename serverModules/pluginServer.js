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
            initTunnel(config).then(({url, tunnel,}) => {
                    activeTunnel = tunnel;
                    serverUrl = url;
                    log('set url to', url);
                }
            );
        }
    });
    return server;
};
