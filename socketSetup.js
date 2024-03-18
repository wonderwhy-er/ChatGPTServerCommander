const fs = require('fs');
const path = require('path');
const socketIo = require('socket.io');

module.exports = function (server) {
    const io = socketIo(server);
    const filePath = path.join(__dirname, 'public', 'index.html');

    fs.watch(filePath, (eventType, filename) => {
        if (eventType === 'change') {
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    console.error('Error reading index.html:', err);
                    return;
                }

                const bodyContent = data.match(/<body[^>]*>([\s\S]*?)<\/body>/i)[1];
                if (bodyContent) {
                    io.emit('bodyContent', { content: bodyContent });
                }
            });
        }
    });

    io.on('connection', (socket) => {
        console.log('A user connected');

        socket.on('log', (data) => {
            if (data.type === 'log') {
                console.log('Client log:', ...data.args);
            } else if (data.type === 'error') {
                console.error('Client error:', ...data.args);
            }
        });

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });
};
