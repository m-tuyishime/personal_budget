const errorHandler = (err, req, res, next) => {
    if (err) {
        res.status(err.status).send(err.message);
        next(err);
    }
    next();
}

module.exports = errorHandler;