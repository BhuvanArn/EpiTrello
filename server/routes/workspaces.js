const { db } = require('../config/db');
const { logger } = require("../config/logger");

const generateRandomId = require('../lib/generateId');
const check_token = require('../lib/checkToken');

async function createWorkspace(req, res) {
    const { name, description, ownerId } = req.body;

    // middleware part
    if (check_token(req, res) !== 200) {
        return res.status(401).send({ message: 'Unauthorized' });
    }

    try {
        const client = db.getDB();
        const id = await generateRandomId(client, 'workspace');
        console.log(ownerId);

        const result = await client.query('INSERT INTO "workspace" (id, name, description, owner_id) VALUES ($1, $2, $3, $4) RETURNING *', [id, name, description, ownerId]);
        res.status(201).send(result.rows[0]);
    } catch (err) {
        logger.write(`Error creating workspace: ${err.message}`);
        logger.log();
        res.status(500).send({ message: 'Internal server error' });
    }
}

async function getWorkspaceByUserId(req, res) {
    const userId = req.params.id;

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

async function getMyWorkspaces(req, res) {
    const userId = req.params.id;

    if (check_token(req, res) !== 200) {
        return res.status(401).send({ message: 'Unauthorized' });
    }

    try {
        const client = db.getDB();
        console.log(userId);
        const result = await client.query('SELECT * FROM "workspace" WHERE owner_id = $1 OR $1 = ANY (users)', [userId]);

        console.log(result.rows);
        res.status(200).send(result.rows);
    } catch (err) {
        logger.write(`Error fetching workspaces: ${err.message}`);
        logger.log();
        res.status(500).send({ message: 'Internal server error' });
    }
}

async function getWorkspaceById(req, res) {
    const id = req.params.id;

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

module.exports = {
    routes: [
        {
            method: 'post',
            path: '/create-workspace',
            protected: true,
            body: { "name": "text", "description": "text", "ownerId": "text" },
            callback: createWorkspace
        },
        {
            method: 'get',
            path: '/workspace/user/:id',
            protected: true,
            callback: getWorkspaceByUserId
        },
        {
            method: 'get',
            path: '/my-workspaces/:id',
            protected: true,
            callback: getMyWorkspaces
        },
        {
            method: 'get',
            path: '/workspace/:id',
            protected: true,
            callback: getWorkspaceById
        }
    ]
}
