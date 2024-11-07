const { DB } = require('../lib/db.js');

const username = process.env.POSTGRES_USER;
const password = process.env.POSTGRES_PASSWORD;
const host = process.env.POSTGRES_HOST;
const database = process.env.POSTGRES_DB;
const port = process.env.DB_PORT;

module.exports = {
    db: new DB(
        username, password, host, database, port
    )
};
