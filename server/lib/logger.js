const { writeSync, closeSync } = require("fs");

const ESCAPE = "\x1b";

class Logger {
    constructor(fd = undefined, typePalette = {"error": `${ESCAPE}[40m${ESCAPE}[31m[-]${ESCAPE}[0m`, "warning": `${ESCAPE}[40m${ESCAPE}[33m[!]${ESCAPE}[0m`, "success": `${ESCAPE}[40m${ESCAPE}[32m[+]${ESCAPE}[0m`, "default": `${ESCAPE}[40m${ESCAPE}[34m[*]${ESCAPE}[0m`}) {
        if (!fd)
            fd = process.stdout.fd;

        this._fd = fd;
        this._buffer = [];

        this.closed = false;

        this.typePalette = typePalette;
    }

    write(text) {
        this._buffer.push(text);
    }

    log(type = "default") {
        var string = `${this.typePalette[type]} - ${ESCAPE}[40m[${(new Date()).toUTCString()}]${ESCAPE}[0m: `;
        var temp = this._buffer.join("").split("\n").join(" ".repeat(string.length)) + '\n';

        string += temp;

        if (!this.closed)
            writeSync(this._fd, string);
        this._buffer = [];
    }

    close() {
        closeSync(this._fd);

        this.closed = true;
    }
}

module.exports = {
    Logger: Logger
};
