const { db } = require('../config/db');
const { logger } = require("../config/logger");

const check_token = require('../lib/checkToken');

/**
 * Get user by id
 * Entry point for fetching user by id
 * @param {*} req - Request must contain an id in the query
 * @param {*} res
 * @returns
 *
*/
async function getUserById(req, res) {

    // middleware part
    if (check_token(req, res) !== 200) {
        return res.status(401).send({ message: 'Unauthorized' });
    }

    try {
        const id = req.query.id;

        if (!id) {
            return res.status(400).send({ message: 'Bad request' });
        }

        const client = db.getDB();

        const result = await client.query('SELECT * FROM "user" WHERE id = $1', [id]);
        if (result.rows.length > 0) {
            res.status(200).send(result.rows[0]);
        } else {
            res.status(404).send({ message: 'Not found' });
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
            path: '/users',
            protected: true,
            callback: getUserById
        }
    ]
}
