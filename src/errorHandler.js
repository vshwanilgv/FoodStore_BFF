const logger = require('../logger');

function errorHandler(err, req, res, next) {
    logger.error(`${err.message} - ${req.method} ${req.originalUrl} - ${req.ip}`);

    if (!err.status) {
        err.status = 500;
    }

    res.status(err.status).json({
        message: err.message,
        error: err.status === 500 ? 'Internal Server Error' : err.error
    });
}

module.exports = errorHandler;
