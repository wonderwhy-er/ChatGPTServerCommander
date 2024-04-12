const {terminalHandler, interruptHandler} = require('../api/terminal');
const {createAppHandler} = require('../api/firebase');
const exitApplicationHandler = require('../api/exitApplicationHandler');
const {initDB} = require("./firebaseDB");

module.exports = {
    addApi: (app, config, getURL, close) => {
        // Logging middleware to log request and response details
        app.use((req, res, next) => {
            const originalSend = res.send;
            console.log(`Request to ${req.path}:`);
            console.log('Query Params:', req.query);
            console.log('Body:', req.body);

            res.send = function(data) {
                console.log(`Response from ${req.path}:`);
                console.log('Response:', data);
                originalSend.call(this, data);
            };

            next();
        });

        app.post('/api/runTerminalScript', terminalHandler);
        if(config.firebaseAccountKey) {
            initDB(config.firebaseAccountKey);
            app.post('/api/apps', createAppHandler);
        }
        app.get('/api/server-url', require('../api/getServerUrlHandler')(getURL));
        app.get('/api/logs', require('../api/getLogsHandler'));
        app.post('/api/restart', exitApplicationHandler(close));
        app.post("/api/interrupt", interruptHandler);
        //app.post('/api/edit-or-read-file', require('../api/editFileHandler'));
        app.post('/api/read-or-edit-file', require('../api/readEditTextFileHandler')(getURL));

    }
};
