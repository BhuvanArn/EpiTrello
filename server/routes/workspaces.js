// Config imports
const { db } = require('../config/db');
const { logger } = require("../config/logger");

// Utils imports
const generateRandomId = require('../lib/generateId');
const check_token = require('../lib/checkToken');

/**
 * Create a workspace
 *
 * @param {*} req - Request must contain a body with the following fields:
 * - name: string
 * - description: string
 * - ownerId: string
 * @param {*} res
 * @returns
 */
async function createWorkspace(req, res) {
    const { name, description, ownerId } = req.body;

    // middleware part
    if (check_token(req, res) !== 200) {
        return res.status(401).send({ message: 'Unauthorized' });
    }

    try {
        const client = db.getDB();
        const id = await generateRandomId(client, 'workspace');

        const result = await client.query('INSERT INTO "workspace" (id, name, description, owner_id) VALUES ($1, $2, $3, $4) RETURNING *', [id, name, description, ownerId]);
        res.status(201).send(result.rows[0]);
    } catch (err) {
        logger.write(`Error creating workspace: ${err.message}`);
        logger.log();
        res.status(500).send({ message: 'Internal server error' });
    }
}

/**
 * Get workspaces by user id
 * @param {*} req
 * @param {*} res
 * @returns
 */
async function getWorkspaceByUserId(req, res) {
    const userId = req.query.userId;

    // middleware part
    if (check_token(req, res) !== 200) {
        return res.status(401).send({ message: 'Unauthorized' });
    }

    try {
        const client = db.getDB();
        const result = await client.query('SELECT * FROM "workspace" WHERE owner_id = $1 OR $1 = ANY (users)', [userId]);
        res.status(200).send(result.rows);
    } catch (err) {
        logger.write(`Error fetching workspaces: ${err.message}`);
        logger.log();
        res.status(500).send({ message: 'Internal server error' });
    }
}

/**
 * Get workspace by id
 * @param {*} req
 * @param {*} res
 * @returns
 */
async function getWorkspaceById(req, res) {
    const id = req.query.id;

    // middleware part
    if (check_token(req, res) !== 200) {
        return res.status(401).send({ message: 'Unauthorized' });
    }

    try {
        const client = db.getDB();
        const result = await client.query('SELECT * FROM "workspace" WHERE id = $1', [id]);
        res.status(200).send(result.rows);
    } catch (err) {
        logger.write(`Error fetching workspaces: ${err.message}`);
        logger.log();
        res.status(500).send({ message: 'Internal server error' });
    }
}

/**
 * Get workspaces
 * Entry point for fetching workspaces
 * @param {*} req - Request must contain either a userId or an id
 * @param {*} res
 * @returns
 */
async function getWorkspaces(req, res) {
    if (req.query.userId) {
        return getWorkspaceByUserId(req, res);
    } else if (req.query.id) {
        return getWorkspaceById(req, res);
    } else {
        return res.status(400).send({ message: 'Bad request' });
    }
}

module.exports = {
    routes: [
        {
            method: 'post',
            path: '/workspaces',
            protected: true,
            body: { "name": "text", "description": "text", "ownerId": "text" },
            callback: createWorkspace
        },
        {
            method: 'get',
            path: '/workspaces',
            protected: true,
            callback: getWorkspaces
        }
    ]
}
