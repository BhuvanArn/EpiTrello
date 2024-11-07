const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
require('dotenv').config();

const { Loader } = require('./lib/loader.js');
let { logger } = require("./config/logger.js");
let { loadedRoutes } = require("./config/router.js");
let { db } = require("./config/db.js");

const middlewares = [
    "./middleware/cors.js",
];

const routes = [
    "./routes/auth/Login.js",
    "./routes/auth/Signup.js",
    "./routes/auth/CompleteSetup.js",
    "./routes/auth/VerifyEmail.js",
];

function loadMiddleware(app)
{
    const loader = new Loader(middlewares);

    app.use(bodyParser.json());
    app.use(methodOverride('X-HTTP-Method-Override'));

    loader.load((loaded) => {
        if (!loaded.middlewares) {
            logger.write(`no middleware loaded.`)
            logger.log();
            return
        }
        for (var middleware of loaded.middlewares) {
            var temp = middleware;

            app.use("*", temp.callback);

            logger.write(`loaded middleware ${temp.callback.name}.`);
            logger.log();
        }
    });
}

function loadRoute(app)
{
    const loader = new Loader(routes);

    loader.load((loaded) => {
        if (!loaded.routes) {
            logger.write(`no route loaded.`)
            logger.log();
            return
        }
        for (var route of loaded.routes) {
            var temp = route;
            var method = temp.method.toUpperCase();
            var path = temp.path;
            var callback = temp.callback;

            loadedRoutes[path + ' ' + method] = route;

            if (method === "GET")
                app.get(path, callback);
            if (method === "POST")
                app.post(path, callback);
            if (method === "PUT")
                app.put(path, callback);
            if (method === "DELETE")
                app.delete(path, callback);
            if (method === "ALL")
                app.all(path, callback);

            logger.write(`loaded route (${method} ${path}) ${callback.name}.`);
            logger.log();
        }
    });
}

(() =>
{
    const expressApp = express();
    const port = process.env.SERVER_PORT;

    loadMiddleware(expressApp);
    loadRoute(expressApp);

    process.on('SIGINT', function() {
        process.stdout.write('\b\b  \b\b');

        db.close().catch(err => {
            process.exit(1);
        });

        logger.write("server stopped.");
        logger.log();

        logger.close();
        process.exit(0);
    });

    expressApp.listen(port, () => {
        logger.write("Server started.");
        logger.log();
    });
})();
