const localtunnel = require("localtunnel");
const {setURL} = require("./swaggerSetup");
const {log} = require("./logger");
const util = require('util');
const setTimeoutPromise = util.promisify(setTimeout);

async function setupTunnelWithRetries(config, maxRetries = 3) {
    let retries = 0;
    while (retries < maxRetries) {
        log('Try number ', retries);
        const tunnel = await localtunnel({ port: config.port, subdomain: config.localTunnelSubdomain });
        log('Tunnel created ', tunnel.url);
        if (tunnel.url.includes(config.localTunnelSubdomain)) {
            return tunnel; // Success, return the tunnel instance
        } else {
            log('Local tunnel setup wrong url', retries, tunnel.url);
            tunnel.close(); // Close the incorrect tunnel
            await setTimeoutPromise(500); // Wait for 500ms before retrying
            retries++;
        }
    }
    throw new Error('Failed to create localtunnel with the requested subdomain.');
}

module.exports = {
    initTunnel: (config) => {
        log('Starting tunnel setup');
        return setupTunnelWithRetries(config).then(tunnel => {
            log('Tunnel created at', tunnel.url);
            setURL(tunnel.url);
            return {
                url: `${tunnel.url}`,
                tunnel,
            }
        }).catch(error => {
            log('Error setting up tunnel:', error.message);
        });
    }
};