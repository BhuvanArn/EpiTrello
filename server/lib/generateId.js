const crypto = require('crypto');

async function generateRandomId(client, table) {
    // check that in this existing id is not already in the database
    let id = crypto.randomBytes(3).toString('hex');
    let query = `SELECT * FROM "${table}" WHERE id = $1`;
    let result = await client.query(query, [id]);

    while (result.rows.length > 0) {
        id = crypto.randomBytes(3).toString('hex');
        result = await client.query(query, [id]);
    }

    return id;
}

module.exports = generateRandomId;
