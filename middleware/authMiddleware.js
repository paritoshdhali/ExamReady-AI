const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(403).send('Token is required for authentication.');
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(401).send('Invalid token.');
        }
        req.user = user; // Save user info in request
        next(); // Proceed to the next middleware
    });
};

module.exports = authMiddleware;