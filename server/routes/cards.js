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
    const listId = req.query.listId;


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

async function getCardsOfBoard(req, res) {
    const boardId = req.params.boardId;

    if (check_token(req, res) !== 200) {
        return res.status(401).send({ message: 'Unauthorized' });
    }

    try {
        const client = db.getDB();
        const result = await client.query('SELECT * FROM "card" WHERE board_id = $1', [boardId]);
        res.status(200).send(result.rows);
    } catch (err) {
        logger.write(`Error fetching cards: ${err.message}`);
        logger.log();
        res.status(500).send({ message: 'Internal server error' });
    }
}

async function updateCardPositions(req, res) {
    const { cards } = req.body;

    if (check_token(req, res) !== 200) {
        return res.status(401).send({ message: 'Unauthorized' });
    }

    try {
        const client = db.getDB();
        const queries = cards.map(card => {
            return client.query('UPDATE "card" SET position = $1, list_id = $2 WHERE id = $3', [card.position, card.list_id, card.id]);
        });

        await Promise.all(queries);
        res.status(200).send({ message: 'Card positions updated successfully' });
    } catch (err) {
        logger.write(`Error updating card positions: ${err.message}`);
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

        // if title is in body, we update else we do nothing.
        if (req.body.title) {
            const result = await client.query('UPDATE "card" SET title = $1 WHERE id = $2', [req.body.title, cardId]);
        }
        if (req.body.description) {
            const result = await client.query('UPDATE "card" SET description = $1 WHERE id = $2', [req.body.description, cardId]);
        }
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
            path: '/cards',
            protected: true,
            callback: getCards
        },
        {
            method: 'put',
            path: '/cards',
            protected: true,
            body: { "title": "text", "cardId": "text", "description": "text" },
            callback: editCard
        }
    ]
}
