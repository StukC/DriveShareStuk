// middlewares/verifyToken.js

const sessionManager = require('../utils/sessionManager');

function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send('Access denied. No token provided.');
    }

    const token = authHeader.split(' ')[1]; // Bearer TOKEN
    const decoded = sessionManager.verifyToken(token);
    if (!decoded) {
        return res.status(401).send('Access denied. Invalid token.');
    }

    req.user = decoded; // Add user info to request
    next(); // Pass control to the next handler
}

module.exports = verifyToken;
