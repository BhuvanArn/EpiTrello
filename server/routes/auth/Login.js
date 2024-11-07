const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { db } = require('../../config/db');
const { logger } = require("../../config/logger");

async function login(req, res) {
    const { email, password } = req.body;

    try {
        const client = db.getDB();
        const result = await client.query('SELECT * FROM "user" WHERE email = $1', [email]);

        if (result.rows.length > 0) {
            const user = result.rows[0];

            // compare to hashed password
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (isPasswordValid) {
                const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
                res.status(200).send({ token });
            } else {
                res.status(401).send({ message: 'Invalid password' });
            }

        } else {
            res.status(401).send({ message: 'User not found' });
        }
    } catch (err) {
        logger.write(`Error during login: ${err.message}`);
        logger.log();
        res.status(500).send({ message: 'Internal server error' });
    }
}



module.exports = {
    routes: [
        {
            method: 'post',
            path: '/login',
            protected: false,
            body: { "email": "email", "password": "text" },
            callback: login
        }
    ]
}
