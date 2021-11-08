/**
 * utilsMiddleware.js
 * Last modified: 2021.10.29
 * Author: Lee Hong Jun (arcane22, hong3883@naver.com)
 * Description: Various middleware callbacks used in Express server are defined.
 */

/* Modules */
require('dotenv').config();
const logger = require('@src/utils/logger');

/**
 * @class UtilsMiddleware
 * @description
 */
class UtilsMiddleware {
    constructor() {}

    /**
     * @function entryMiddleware
     * @description It will be executed for all requests. (Log the all client's requests)
     * @param {object} req Client's Request object.
     * @param {object} res Server's Response object.
     * @param {function} next Next function.
     */
    entryMiddleware(req, res, next) {
        logger.info(`Request: ${JSON.stringify(req.socket.address())}, Method: ${req.method}, Url: ${req.url}`);
        res.locals.user = req.user;
        next();
    }

    /**
     * @function redirectionToRoot
     * @description Redirect to root page (/).
     * @param {object} req Client's Request object.
     * @param {object} res Server's Response object.
     */
    redirectToRoot(req, res) {
        res.redirect('/');
    }

    /**
     * @function makeError
     * @description
     * If there is no page requested by the user, it will cause 404 error. (middleware callback)
     * @param {object} req Client's Request object.
     * @param {object} res Server's Response object.
     * @param {function} next Next function.
     */
    makeError(req, res, next) {
        const error = new Error('404 Not Found');
        error.status = 404;
        next(error);
    }

    /**
     * @function showError
     * @description
     * When the middleware callback passes the error object, it is displayed on the web page. (middleware callback)
     * @param {object} err Error object that the middleware callback passed.
     * @param {object} req Client's Request object.
     * @param {object} res Server's Response object.
     * @param {function} next Next function.
     */
    showError(err, req, res, next) {
        res.locals.message = err.message;
        res.locals.error = process.env.NODE_ENV === 'development' ? err : { message: res.locals.message, stack: `The requested URL ${req.url} doesn't exist.` };
        res.status(err.status || 500);

        logger.error(`Response: '${res.locals.message}' [${res.statusCode}], There is no router: ${req.method}, ${req.url} `);
        res.render('error');
    }
}

/* Export instance as module */
module.exports = new UtilsMiddleware();
