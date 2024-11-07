const bcrypt = require('bcrypt');

const { db } = require('../../config/db');
const { logger } = require("../../config/logger");

async function completeSetup(req, res) {
    const { fullName, password } = req.body;

    try {
        const client = db.getDB();
        const hashedPassword = await bcrypt.hash(password, 10);

        // Assuming the email is stored in the session or passed in the request
        const email = req.session.email || req.body.email;

        const result = await client.query('UPDATE "user" SET full_name = $1, password = $2 WHERE email = $3 RETURNING *', [fullName, hashedPassword, email]);

        if (result.rows.length > 0) {
            res.status(200).send({ message: 'Account setup complete' });
        } else {
            res.status(400).send({ message: 'Failed to complete setup' });
        }
    } catch (err) {
        logger.write(`Error during complete setup: ${err.message}`);
        logger.log();
        res.status(500).send({ message: 'Internal server error' });
    }
}


module.exports = {
    routes: [
        {
            method: 'post',
            path: '/complete-setup',
            protected: false,
            body: { "fullName": "text", "password": "text" },
            callback: completeSetup
        }
    ]
}
