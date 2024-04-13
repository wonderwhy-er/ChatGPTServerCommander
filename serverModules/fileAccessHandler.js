const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const {log} = require("../serverModules/logger");

const tokenStorePath = path.join(__dirname, "../tokenStore.json");

// Function to read the token store
const readTokenStore = () => {
    if (fs.existsSync(tokenStorePath)) {
        return JSON.parse(fs.readFileSync(tokenStorePath, "utf8"));
    }
    return {};
};

// Function to write to the token store
const writeToTokenStore = (tokenStore) => {
    fs.writeFileSync(tokenStorePath, JSON.stringify(tokenStore, null, 2), "utf8");
};


module.exports.createToken = (getURL, filePath) => {
    const tokenStore = readTokenStore();
    let token = '';
    let existingTokenFound = false;

    // Check for an existing token for the filePath
    Object.keys(tokenStore).forEach(existingToken => {
        const tokenInfo = tokenStore[existingToken];
        if (tokenInfo.filePath === filePath && new Date(tokenInfo.expiryDate) > new Date()) {
            // Extend the existing token's expiry date
            tokenInfo.expiryDate = new Date(new Date().getTime() + 600000);
            token = existingToken;
            existingTokenFound = true;
        }
    });

    if (!existingTokenFound) {
        // Create a new token if none exists for the filePath
        token = crypto.randomBytes(20).toString('hex');
        tokenStore[token] = { filePath, expiryDate: new Date(new Date().getTime() + 60000) };
    }

    // Filter out expired tokens
    Object.keys(tokenStore).forEach(token => {
        if (new Date(tokenStore[token].expiryDate) < new Date()) {
            delete tokenStore[token];
        }
    });

    writeToTokenStore(tokenStore);

    const serverUrl = getURL(); // Gets the base server URL
    const accessUrl = `${serverUrl}/access/${token}`; // Constructs the file access URL
    log('created url', serverUrl);
    return  accessUrl;
};

module.exports.retrieveFile = (req, res) => {
    const { token } = req.params; // Assume the token is passed as a URL parameter
    const tokenStore = readTokenStore();

    if (!tokenStore[token]) {
        return res.status(404).send('Token not found or has expired.');
    }

    const tokenInfo = tokenStore[token];
    if (new Date(tokenInfo.expiryDate) < new Date()) {
        return res.status(410).send('Token has expired.');
    }

    fs.readFile(tokenInfo.filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Failed to read the file.');
        }
        res.setHeader('Content-Type', 'text/plain');
        res.send(data);
    });
};
