const { logger } = require("../config/logger");

function login(req, res) {
    logger.write(`login route called.`);
    logger.log();

    res.status(200).send({ message: "login route called." });
}

module.exports = {
    routes: [
        {
            method: 'post',
            path: '/login',
            protected: false,
            body: {"email": "email", "password": "text"},
            callback: login
        }
    ]
}
