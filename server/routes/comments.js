const { db } = require('../config/db');
const { logger } = require("../config/logger");

const generateRandomId = require('../lib/generateId');
const check_token = require('../lib/checkToken');

async function createComment(req, res) {
    const { content, cardId, creatorId } = req.body;

    if (check_token(req, res) !== 200) {
        return res.status(401).send({ message: 'Unauthorized' });
    }

    try {
        const client = db.getDB();

        const id = await generateRandomId(client, 'comment');

        const result = await client.query('INSERT INTO "comment" (id, content, card_id, creator_id) VALUES ($1, $2, $3, $4) RETURNING *', [id, content, cardId, creatorId]);
        res.status(201).send(result.rows[0]);
    } catch (err) {
        logger.write(`Error creating comment: ${err.message}`);
        logger.log();
        res.status(500).send({ message: 'Internal server error' });
    }
}

async function getComments(req, res) {
    const cardId = req.params.cardId;

    if (check_token(req, res) !== 200) {
        return res.status(401).send({ message: 'Unauthorized' });
    }

    try {
        const client = db.getDB();
        const result = await client.query('SELECT * FROM "comment" WHERE card_id = $1', [cardId]);
        res.status(200).send(result.rows);
    } catch (err) {
        logger.write(`Error fetching comments: ${err.message}`);
        logger.log();
        res.status(500).send({ message: 'Internal server error' });
    }
}

module.exports = {
    routes: [
        {
            method: 'post',
            path: '/comments',
            protected: true,
            body: { "content": "text", "cardId": "text", "creatorId": "text" },
            callback: createComment
        },
        {
            method: 'get',
            path: '/cards/:cardId/comments',
            protected: true,
            callback: getComments
        }
    ]
}