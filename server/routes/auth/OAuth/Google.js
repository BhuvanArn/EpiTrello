const { db } = require('../../../config/db');
const { logger } = require("../../../config/logger");

const { jwtDecode } = require('jwt-decode');

async function googleSignup(req, res) {
    const { credential } = req.body;

    const decoded = jwtDecode(credential);

    console.log(decoded);

    try {
        const client = db.getDB();
        const user = await client.query('SELECT * FROM "user" WHERE email = $1', [decoded.email]);

        if (user && user.rows.length > 0) {
            return res.status(400).json({ message: 'Email exists already' });
        }

        const newUser = await client.query('INSERT INTO "user" (email, name, password, verified, picture) VALUES ($1, $2, $3, $4, $5) RETURNING *', [decoded.email, decoded.name, null, true, decoded.picture]);

        if (!newUser || newUser.rows.length === 0) {
            return res.status(500).json({ message: 'Failed to create account' });
        }
        return res.status(200).json({ message: 'Account created', email: newUser.rows[0].email });
    } catch (error) {
        logger.write(`Error during Google signup: ${error.message}`);
        logger.log();
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function googleLogin(req, res) {
    const { credential } = req.body;

    const decoded = jwtDecode(credential);

    console.log(decoded);

    try {
        const client = db.getDB();
        const user = await client.query('SELECT * FROM "user" WHERE email = $1', [decoded.email]);

        if (!user || user.rows.length === 0) {
            return res.status(401).json({ message: 'User not found' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).send({ token });
    } catch (error) {
        logger.write(`Error during Google login: ${error.message}`);
        logger.log();
        return res.status(500).json({ message: 'Internal server error' });
    }
}


module.exports = {
    routes: [
        {
            method: 'post',
            path: '/google-signup',
            protected: false,
            body: { "credential": "text" },
            callback: googleSignup
        },
        {
            method: 'post',
            path: '/google-login',
            protected: false,
            body: { "credential": "text" },
            callback: googleLogin
        }
    ]
}
