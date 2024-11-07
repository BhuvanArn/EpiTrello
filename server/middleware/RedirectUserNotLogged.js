const jwt = require('jsonwebtoken');
const { logger } = require("../config/logger");

function redirect_user_if_not_logged(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).send({ message: 'Unauthorized' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            logger.write(`Error during token verification: ${err.message}`);
            logger.log();
            return res.status(401).send({ message: 'Unauthorized' });
        }

        req.user = user;
        next();
    });
}

module.exports = redirect_user_if_not_logged;
