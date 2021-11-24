/**
 * authMiddleware.js
 * Last modified: 2021.10.29
 * Author: Lee Hong Jun (arcane22, hong3883@naver.com)
 * Description: Various middleware callbacks used in Express server are defined.
 */

/* Modules */
require('dotenv').config();
const passport = require('passport');
const mailer = require('@src/utils/mailer');
const accountManager = require('@src/database/managers/accountManager');
const logger = require('@src/utils/logger');
const db = require('@src/database/database2');

/**
 * @class AuthMiddleware
 * @description
 */
class AuthMiddleware {
    constructor() {}

    /**
     * @function signIn
     * @description Excuted when user sign in the web service. (middleware callback)
     * @param {object} req Client's Request object.
     * @param {object} res Server's Response object.
     * @param {function} next Next function.
     */
    signIn(req, res, next) {
        const makeLogin = (req, res, next, user) => {
            req.login(user, (loginError) => {
                if (loginError) {
                    logger.error(loginError);
                    return next(loginError);
                } else {
                    return res.redirect('/');
                }
            });
        };

        const callback = (err, user, info) => {
            if (err) {
                // occured sign in error
                logger.error(err);
                return next(err);
            } else if (!user) {
                // cannot find the user
                return res.redirect(`/?loginError=${info.message}`);
            } else {
                // try to make login
                makeLogin(req, res, next, user);
            }
        };

        passport.authenticate('local', callback)(req, res, next);
    }

    /**
     * @async @function signUp
     * @description Called when user sign up for a web service. (middleware callback)
     * @param {object} req Client's Request object.
     * @param {object} res Server's Response object.
     * @param {function} next Next function.
     */
    async signUp(req, res, next) {
        const email = req.body.email;
        const password = req.body.password;

        try {
            const user = await accountManager.findAccountByEmail(req.body.email);

            if (user) {
                return res.redirect('/join?error=exist');
            }

            const accObj = await accountManager.makeAccountObj(accountManager.accountType.local, req.body.email, req.body.password);
            await accountManager.createAccount(accObj);
            return res.redirect('/');
        } catch (err) {
            logger.error(err);
            return next(err);
        }
    }

    /**
     * @function signOut
     * @description Called when user sign out for a web service. (middleware callback)
     * @param {object} req Client's Request object.
     * @param {object} res Server's Response object.
     * @param {function} next Next function.
     */
    signOut(req, res) {
        req.logout();
        req.session.destroy();
        res.redirect('/');
    }

    /**
     * @function isSignedIn
     * @description
     * Check whether the user is signed in to the web service or not. (middleware callback)
     * Logout router or image upload router is accessible only to signed in user.
     * @param {object} req Client's Request object.
     * @param {object} res Server's Response object.
     * @param {function} next Next function.
     */
    isSignedIn(req, res, next) {
        if (req.isAuthenticated()) {
            next();
        } else {
            res.status(403).send('Need to sign in our service.');
            /*const error = new Error('Need to sign in our service.');
            error.status = 403;
            next(error);*/
            //res.status(403).redirect('/');
        }
    }

    /**
     * @function isNotSignedIn
     * @description
     * Check whether the user is not signed in to the web service or not. (middleware callback)
     * Sign up router or sign in router is accessible only to those who have not signed in.
     * @param {object} req Client's Request object.
     * @param {object} res Server's Response object.
     * @param {function} next Next function.
     */
    isNotSignedIn(req, res, next) {
        if (!req.isAuthenticated()) {
            next();
        } else {
            res.redirect(`/?error='You are currently logged in.'`);
        }
    }

    /**
     *
     */
    async sendAuthMail(req, res) {
        const email = req.body.email;
        if (email === undefined) {
            logger.info('Fail to send auth mail: email property is undefined');
            res.sendStatus(404);
        } else {
            const result = await mailer.sendAuthMail(email);
            if (result) {
                logger.info('Success to send auth mail');
                res.sendStatus(200);
            } else {
                logger.info('Fail to send auth mail: mailer.sendAuthMail() returns false');
                res.sendStatus(404);
            }
        }
    }
}

/* Export instance as module */
module.exports = new AuthMiddleware();
