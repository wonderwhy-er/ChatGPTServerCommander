const socket = io();

// Capture and send console.log messages
const originalConsoleLog = console.log;
console.log = function (...args) {
    originalConsoleLog.apply(console, args);
    socket.emit('log', { type: 'log', args: args });
};

// Capture and send console.error messages
const originalConsoleError = console.error;
console.error = function (...args) {
    originalConsoleError.apply(console, args);
    socket.emit('log', { type: 'error', args: args });
};

// Capture and send global errors
window.onerror = function (message, source, lineno, colno, error) {
    socket.emit('log', { type: 'error', message, source, lineno, colno, error: error ? error.stack : 'no stack' });
};

socket.on('bodyContent', (data) => {
    document.body.innerHTML = data.content;
});
