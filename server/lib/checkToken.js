const jwt = require('jsonwebtoken');
const { logger } = require("../config/logger");

function check_token(req, res) {
    const token = req.headers['authorization'];
    var status = 401;

    if (!token) {
        logger.write('No token provided');
        logger.log();
        return status;
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            logger.write(`Error during token verification: ${err.message}`);
            logger.log();
            return status;
        }
        status = 200;
    });
    return status;
}

module.exports = check_token;
