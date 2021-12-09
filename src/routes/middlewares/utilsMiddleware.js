/**
 * utilsMiddleware.js
 * Last modified: 2021.12.10
 * Author: Lee Hong Jun (arcane22, hong3883@naver.com)
 * Description: Various middleware callbacks used in Express server are defined.
 */

/* Modules */
require('dotenv').config();
const { Request, Response, NextFunction } = require('express');
const type = require('@src/utils/type');
const logger = require('@src/utils/logger');
const utility = require('@src/utils/utility');

/**
 * @class UtilsMiddleware
 * @description
 */
class UtilsMiddleware {
    constructor() {}

    /**
     * @function entryMiddleware
     * @description It will be executed for all requests. (Log the all client's requests)
     *
     * @param {Request} req Client's Request object.
     * @param {Response} res Server's Response object.
     * @param {function} next Next function.
     */
    entryMiddleware(req, res, next) {
        const idx = req.isAuthenticated() ? req.user.idx : -1;
        const bodyStr = JSON.stringify(req.body);
        logger.info(`Method: ${req.method}, Url: ${req.url}, userIdx: ${idx}, body: ${bodyStr}`);
        next();
    }

    /**
     * @function redirectionToRoot
     * @description Redirect to root page (/)
     *
     * @param {Request} req Client's Request object.
     * @param {Response} res Server's Response object.
     */
    redirectToRoot(req, res) {
        utility.routerSend(res, type.HttpStatus.OK, { uri: '/' });
    }

    /**
     * @function makeError
     * @description If there is no page requested by the user, it will cause 404 error. (middleware callback)
     *
     * @param {Request} req Client's Request object.
     * @param {Response} res Server's Response object.
     * @param {NextFunction} next Next function
     */
    makeError(req, res, next) {
        const error = new Error('404 Not Found');
        error.status = type.HttpStatus.NotFound;
        next(error);
    }

    /**
     * @function showError
     * @description When the middleware callback passes the error object, it is displayed on the web page. (middleware callback)
     *
     * @param {error} err Error object that the middleware callback passed.
     * @param {Request} req Client's Request object.
     * @param {Response} res Server's Response object.
     * @param {NextFunction} next Next function
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
