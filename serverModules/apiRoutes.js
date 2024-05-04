const {terminalHandler, interruptHandler} = require('../api/terminal');

const createAppHandlerWithUrl = require('../api/firebase'); // Modify import to pass getURL function
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
        const readEditTextFileHandler = require('../api/readEditTextFileHandler')(getURL);
        app.get('/api/runTerminalScript', terminalHandler);

        app.post('/api/apps', createAppHandlerWithUrl(getURL));
        app.get('/api/server-url', require('../api/getServerUrlHandler')(getURL));
        app.get('/api/logs', require('../api/getLogsHandler'));
        app.post('/api/restart', exitApplicationHandler(close));
        app.post("/api/interrupt", interruptHandler);
        app.post('/api/read-or-edit-file', readEditTextFileHandler);
        app.get('/api/read-or-edit-file', readEditTextFileHandler);
        // Add new routes for Firebase applications
    }
};