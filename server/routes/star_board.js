const { db } = require('../config/db');
const { logger } = require("../config/logger");
const check_token = require('../lib/checkToken');

// This function is called when a user stars or unstars a board
// It adds or removes a row from the 'starred_boards' table
// The row contains the user_id and board_id
// If the row already exists, it is removed
// If the row does not exist, it is added
// The function returns a 200 status code upon success
async function starBoard(req, res) {
    const { boardId, userId } = req.body;

    if (check_token(req, res) !== 200) {
        return res.status(401).send({ message: 'Unauthorized' });
    }

    try {
        const client = db.getDB();
        const result = await client.query('SELECT * FROM "starred_boards" WHERE user_id = $1 AND board_id = $2', [userId, boardId]);

        if (result.rows.length > 0) {
            await client.query('DELETE FROM "starred_boards" WHERE user_id = $1 AND board_id = $2', [userId, boardId]);
        } else {
            await client.query('INSERT INTO "starred_boards" (user_id, board_id) VALUES ($1, $2)', [userId, boardId]);
        }

        res.status(200).send({ message: 'OK' });
    } catch (err) {
        logger.write(`Error starring board: ${err.message}`);
        logger.log();
        res.status(500).send({ message: 'Internal server error' });
    }
}

// This function is called when a user wants to view their starred boards
// It returns an array of board objects that the user has starred
// The function returns a 200 status code upon success
async function getStarredBoards(req, res) {

    if (check_token(req, res) !== 200) {
        return res.status(401).send({ message: 'Unauthorized' });
    }

    try {
        const userId = req.query.userId;

        if (!userId) {
            return res.status(400).send({ message: 'Bad request' });
        }

        const client = db.getDB();
        const result = await client.query('SELECT * FROM "starred_boards" WHERE user_id = $1 ', [userId]);
        res.status(200).send(result.rows);
    } catch (err) {
        logger.write(`Error fetching starred boards: ${err.message}`);
        logger.log();
        res.status(500).send({ message: 'Internal server error' });
    }
}

module.exports = {
    routes: [
        {
            method: 'post',
            path: '/starboard',
            protected: true,
            body: {
                "boardId": "text",
                "userId": "text"
            },
            callback: starBoard
        },
        {
            method: 'get',
            path: '/starboard',
            protected: true,
            callback: getStarredBoards
        }
    ]
}