function handleOptionsRequests(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-HTTP-Method-Override, Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Credentials", "true");
    if (req.method == "OPTIONS") {
        res.status(204).end();
        return;
    }
    next();
}

module.exports = {
    middlewares: [
        {
            callback: handleOptionsRequests
        }
    ]
};
