module.exports = (log, config) => ((req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    log('request auth check', fullUrl, Object.keys(req.headers));
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