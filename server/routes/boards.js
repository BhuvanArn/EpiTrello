const { db } = require('../config/db');
const { logger } = require("../config/logger");

const check_token = require('../lib/checkToken');
const generateRandomId = require('../lib/generateId');

async function createBoard(req, res) {
    const { title, visibility, workspaceId } = req.body;

    if (check_token(req, res) !== 200) {
        return res.status(401).send({ message: 'Unauthorized' });
    }

    try {
        const client = db.getDB();
        const id = await generateRandomId(client, 'board');
        const result = await client.query('INSERT INTO "board" (id, title, visibility, workspace_id) VALUES ($1, $2, $3, $4) RETURNING *', [id, title, visibility, workspaceId]);
        res.status(201).send(result.rows[0]);
    } catch (err) {
        logger.write(`Error creating board: ${err.message}`);
        logger.log();
        res.status(500).send({ message: 'Internal server error' });
    }
}

async function getBoards(req, res) {
    if (check_token(req, res) !== 200) {
        return res.status(401).send({ message: 'Unauthorized' });
    }

    try {
        const workspaceId = req.query.workspaceId;

        if (!workspaceId || workspaceId.length !== 6) {
            return res.status(400).send({ message: 'Bad request' });
        }

        const client = db.getDB();
        const result = await client.query('SELECT * FROM "board" WHERE workspace_id = $1', [workspaceId]);
        res.status(200).send(result.rows);
    } catch (err) {
        logger.write(`Error fetching boards: ${err.message}`);
        logger.log();
        res.status(500).send({ message: 'Internal server error' });
    }
}

async function getBoard(req, res) {

    if (check_token(req, res) !== 200) {
        return res.status(401).send({ message: 'Unauthorized' });
    }

    try {
        const boardId = req.query.boardId;

        if (!boardId || boardId.length !== 6) {
            return res.status(400).send({ message: 'Bad request' });
        }

        const client = db.getDB();
        const result = await client.query('SELECT * FROM "board" WHERE id = $1', [boardId]);
        res.status(200).send(result.rows[0]);
    } catch (err) {
        logger.write(`Error fetching board: ${err.message}`);
        logger.log();
        res.status(500).send({ message: 'Internal server error' });
    }
}

async function updateBoardTitle(req, res) {
    const { title, boardId } = req.body;

    if (check_token(req, res) !== 200) {
        return res.status(401).send({ message: 'Unauthorized' });
    }

    try {
        if (!title || !boardId || boardId.length !== 6) {
            return res.status(400).send({ message: 'Bad request' });
        }

        const client = db.getDB();
        const result = await client.query('UPDATE "board" SET title = $1 WHERE id = $2 RETURNING *', [title, boardId]);

        if (result.rows.length > 0) {
            res.status(200).send(result.rows[0]);
        } else {
            res.status(404).send({ message: 'Board not found' });
        }
    } catch (err) {
        logger.write(`Error updating board title: ${err.message}`);
        logger.log();
        res.status(500).send({ message: 'Internal server error' });
    }
}

/**
 * Redirects to the correct function based on query parameters
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 * @async
 */
async function redirectGetBoards(req, res) {
    if (req.query.workspaceId) {
        return getBoards(req, res);
    }
    if (req.query.boardId) {
        return getBoard(req, res);
    }
    return res.status(400).send({ message: 'Bad request' });
}

module.exports = {
    routes: [
        {
            method: 'post',
            path: '/boards',
            protected: true,
            body: { "title": "text", "visibility": "text", "workspaceId": "text" },
            callback: createBoard
        },
        {
            method: 'get',
            path: '/boards',
            protected: true,
            callback: redirectGetBoards
        },
        {
            method: 'put',
            path: '/boards',
            protected: true,
            body: { "title": "text", "boardId": "text" },
            callback: updateBoardTitle
        }
    ]
}
