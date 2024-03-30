const {terminalHandler, interruptHandler} = require('../api/terminal');
const {createAppHandler} = require('../api/firebase');
const exitApplicationHandler = require('../api/exitApplicationHandler');
const {initDB} = require("./firebaseDB");

module.exports = {
    addApi: (app, config, getURL, getLogs) => {
        app.post('/api/runTerminalScript', terminalHandler);
        if(config.firebaseAccountKey) {
            initDB(config.firebaseAccountKey);
            app.post('/api/apps', createAppHandler);
        }
        app.get('/api/server-url', require('../api/getServerUrlHandler')(getURL));
        app.get('/api/logs', require('../api/getLogsHandler')(getLogs));
        app.post('/api/restart', exitApplicationHandler);
        app.post("/api/interrupt", interruptHandler);
    }
};
