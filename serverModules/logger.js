
const _log = [];
module.exports = {
    log: function (...args) {
        console.log(...args);
        _log.push(args);
    },
    getLog: () => _log,
}