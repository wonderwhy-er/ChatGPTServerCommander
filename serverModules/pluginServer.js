// Express server setup
const express = require('express');
const http = require('http');
const path = require('path');
const {terminalHandler, interruptHandler} = require('../api/terminal');
const socketSetup = require('./socketSetup');
const localtunnel = require('localtunnel');
const { configPromise } = require('./configHandler');
const { openapiSpecification, setURL } = require('./swaggerSetup');
const {createAppHandler} = require("../api/firebase");
const {initDB} = require("./firebaseDB");
const {addApi} = require("./apiRoutes");

const _log = [];
function log(...args) {
    console.log(...args);
    _log.push(args);
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

    openapiSpecification(expressApp);
    expressApp.use(require('./auth.js')(log, config));

    let url = '';
    addApi(expressApp, config, () => url, () => _log);

    expressApp.use((err, req, res, next) => {
        console.error(err.stack); // Log error stack trace to server console
        res.status(500).send({ error: err.message, stack: err.stack });
    });

    server.listen(config.port, () => {
        log('Server running on http://localhost:' + config.port);
        if(config.useLocalTunnel) localtunnel({ port: config.port, subdomain: config.localTunnelSubdomain }).then(tunnel => {
            log('tunnel created at', tunnel.url);
            setURL(tunnel.url);
            url = `${tunnel.url}/log`;
            tunnel.on('close', () => {
                // tunnels are closed
            });
        });
        // the assigned public url for your tunnel
        // i.e. https://abcdefgjhij.localtunnel.me
    });
    return server;
};
