class Loader {
    constructor(files = []) {
        this.files = files;
    }

    load(callback) {
        for (var file of this.files) {
            var temp = require.main.require(file);

            callback(temp);
        }
    }
}

module.exports = {
    Loader: Loader
};
