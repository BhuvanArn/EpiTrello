const { db } = require('../../config/db');
const { logger } = require("../../config/logger");

async function verifyEmail(req, res) {
    const { email, code } = req.body;

    try {
        const client = db.getDB();
        const result = await client.query('SELECT * FROM "user" WHERE email = $1 AND verification_code = $2', [email, code]);

        if (result.rows.length > 0) {
            await client.query('UPDATE "user" SET verified = true WHERE email = $1', [email]);
            res.status(200).send({ message: 'Email address verified' });
        } else {
            res.status(400).send({ message: 'Invalid token' });
        }
    } catch (err) {
        logger.write(`Error during email verification: ${err.message}`);
        logger.log();
        res.status(500).send({ message: 'Internal server error' });
    }
}

module.exports = {
    routes: [
        {
            method: 'post',
            path: '/verify-email',
            protected: false,
            body: { "email": "email", "code": "text" },
            callback: verifyEmail
        }
    ]
}
