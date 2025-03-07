const { db } = require('../config/db');
const { logger } = require("../config/logger");

const generateRandomId = require('../lib/generateId');
const check_token = require('../lib/checkToken');

async function getLastCardPosition(listId) {
    try {
        const client = db.getDB();
        const result = await client.query('SELECT position FROM "card" WHERE list_id = $1 ORDER BY position DESC LIMIT 1', [listId]);
        if (result.rows.length === 0) {
            return 0;
        }
        return result.rows[0].position;
    } catch (err) {
        logger.write(`Error fetching last card position: ${err.message}`);
        logger.log();
        return 0;
    }
}

async function createCard(req, res) {
    const { title, description, listId } = req.body;

    if (check_token(req, res) !== 200) {
        return res.status(401).send({ message: 'Unauthorized' });
    }

    try {
        const client = db.getDB();

        const id = await generateRandomId(client, 'card');

        const position = await getLastCardPosition(listId);

        const result = await client.query('INSERT INTO "card" (id, title, description, list_id, position) VALUES ($1, $2, $3, $4, $5) RETURNING *', [id, title, description, listId, position]);
        res.status(201).send(result.rows[0]);
    } catch (err) {
        logger.write(`Error creating card: ${err.message}`);
        logger.log();
        res.status(500).send({ message: 'Internal server error' });
    }
}

async function getCards(req, res) {
    const listId = req.params.listId;


    if (check_token(req, res) !== 200) {
        return res.status(401).send({ message: 'Unauthorized' });
    }

    if (!listId || listId.length !== 6) {
        return res.status(400).send({ message: 'Bad request' });
    }

    try {
        const client = db.getDB();
        const result = await client.query('SELECT * FROM "card" WHERE list_id = $1', [listId]);
        res.status(200).send(result.rows);
    } catch (err) {
        logger.write(`Error fetching cards: ${err.message}`);
        logger.log();
        res.status(500).send({ message: 'Internal server error' });
    }
}

async function editCard(req, res) {
    const { cardId } = req.body;

    if (check_token(req, res) !== 200) {
        return res.status(401).send({ message: 'Unauthorized' });
    }

    try {
        const client = db.getDB();

        let modifString = "";
        let modifValues = [];

        if (req.body.newTitle) {
            modifString += 'title = $1';
            modifValues.push(req.body.newTitle);
        }
        if (req.body.newDescription) {
            if (modifString.length > 0) {
                modifString += ', ';
                modifString += 'description = $2';
            } else {
                modifString += 'description = $1';
            }
            modifValues.push(req.body.newDescription);
        }
        if (req.body.newPosition) {
            if (modifString.length > 0 && modifString.endsWith('2')) {
                modifString += ', ';
                modifString += 'position = $3';
            } else if (modifString.length > 0) {
                modifString += ', ';
                modifString += 'position = $2';
            } else {
                modifString += 'position = $1';
            }
            modifValues.push(req.body.newPosition.toString());
        }

        await client.query(`UPDATE "card" SET ${modifString} WHERE id = $${modifValues.length + 1}`, [...modifValues, cardId]);

        logger.write(`Card ${cardId} updated successfully with ${modifString}`);
        logger.log();

        res.status(200).send({ message: 'Card updated successfully' });
    } catch (err) {
        logger.write(`Error updating card: ${err.message}`);
        logger.log();
        res.status(500).send({ message: 'Internal server error' });
    }
}

module.exports = {
    routes: [
        {
            method: 'post',
            path: '/cards',
            protected: true,
            body: { "title": "text", "description": "text", "listId": "text"},
            callback: createCard
        },
        {
            method: 'get',
            path: '/lists/:listId/cards',
            protected: true,
            callback: getCards
        },
        {
            method: 'put',
            path: '/cards',
            protected: true,
            body: { "cardId": "text", "newTitle": "text", "newDescription": "text", "newPosition": "number" },
            callback: editCard
        }
    ]
}
