const { db } = require('../config/db');
const { logger } = require("../config/logger");

const generateRandomId = require('../lib/generateId');
const check_token = require('../lib/checkToken');

async function createList(req, res) {
    const { title, boardId } = req.body;

    if (check_token(req, res) !== 200) {
        return res.status(401).send({ message: 'Unauthorized' });
    }

    try {
        const client = db.getDB();

        const id = await generateRandomId(client, 'list');

        const result = await client.query('INSERT INTO "list" (id, title, board_id) VALUES ($1, $2, $3) RETURNING *', [id, title, boardId]);
        res.status(201).send(result.rows[0]);
    } catch (err) {
        logger.write(`Error creating list: ${err.message}`);
        logger.log();
        res.status(500).send({ message: 'Internal server error' });
    }
}

async function getLists(req, res) {
    const boardId = req.query.boardId;

    if (!boardId || boardId.length !== 6) {
        return res.status(400).send({ message: 'Bad request' });
    }

    if (check_token(req, res) !== 200) {
        return res.status(401).send({ message: 'Unauthorized' });
    }

    try {
        const client = db.getDB();
        const result = await client.query('SELECT * FROM "list" WHERE board_id = $1', [boardId]);
        res.status(200).send(result.rows);
    } catch (err) {
        logger.write(`Error fetching lists: ${err.message}`);
        logger.log();
        res.status(500).send({ message: 'Internal server error' });
    }
}

async function updateListTitle(req, res) {
    const { title, listId } = req.body;

    if (check_token(req, res) !== 200) {
        return res.status(401).send({ message: 'Unauthorized' });
    }

    try {
        const client = db.getDB();
        const result = await client.query('UPDATE "list" SET title = $1 WHERE id = $2 RETURNING *', [title, listId]);
        res.status(200).send(result.rows[0]);
    } catch (err) {
        logger.write(`Error updating list: ${err.message}`);
        logger.log();
        res.status(500).send({ message: 'Internal server error' });
    }
}

module.exports = {
    routes: [
        {
            method: 'post',
            path: '/lists',
            protected: true,
            body: { "title": "text", "boardId": "text" },
            callback: createList
        },
        {
            method: 'get',
            path: '/lists',
            protected: true,
            callback: getLists
        },
        {
            method: 'put',
            path: '/lists',
            protected: true,
            body: { "title": "text", "listId": "text" },
            callback: updateListTitle
        }
    ]
}
