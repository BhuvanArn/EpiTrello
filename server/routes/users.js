const { db } = require('../config/db');
const { logger } = require("../config/logger");

const check_token = require('../lib/checkToken');

async function get_user(req, res) {

    // middleware part
    if (check_token(req, res) !== 200) {
        return res.status(401).send({ message: 'Unauthorized' });
    }

    try {
        const id = req.params.id;
        const client = db.getDB();

        const result = await client.query('SELECT * FROM "user" WHERE id = $1', [id]);
        if (result.rows.length > 0) {
            res.status(200).send(result.rows[0]);
        } else {
            res.status(404).send({ message: 'User not found' });
        }
    } catch (err) {
        logger.write(`Error during user search: ${err.message}`);
        logger.log();
        res.status(500).send({ message: 'Internal server error' });
    }
}

module.exports = {
    routes: [
        {
            method: 'get',
            path: '/users/:id',
            query: { "id": "text" },
            protected: true,
            callback: get_user,
        }
    ]
}
