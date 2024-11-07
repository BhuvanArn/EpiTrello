const { Client } = require("pg");

let { logger } = require("../config/logger.js");

class DB {
    constructor(username, password, host, database, port) {
        console.log(username, password, host, database, port);
        this.loaded = false;
        this.failed = false;

        this.locked = false;

        this.db = new Client({
            host: host,
            port: port,
            database: database,
            user: username,
            password: password
        });

        this.db.connect((err) => {
            if (err) {
                logger.write(`connect failed -> ${username}:${password}@${host}:${port}/${database}.`);
                logger.log("error");

                this.failed = true;

                process.exit(1);
            }

            logger.write("db connected.")
            logger.log();

            this.loaded = true;
        });
    }

    getDB() {
        return (this.db);
    }

    close() {
        return (new Promise((resolve, reject) => {
            this.db.end().then(() => {
                logger.write("closed db.");
                logger.log();

                resolve({status: true});
            }).catch(err => {
                logger.write("failed to close db.");
                logger.log();

                reject({status: false});
            });
        }));
    }
}

module.exports = {
    DB: DB
}
