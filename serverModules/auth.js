module.exports = (log, config) => ((req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    log('request auth check', req.path, Object.keys(req.headers));
    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(' ')[1];
        // Verify the token here (e.g., using a library like jsonwebtoken)
        if (bearerToken === config.authToken) {
            // Token is valid, proceed to the next middleware
            next();
        } else {
            res.sendStatus(403); // Forbidden
        }
    } else {
        res.sendStatus(401); // Unauthorized
    }
});