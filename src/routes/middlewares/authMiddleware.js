/**
 * authMiddleware.js
 * Last modified: 2021.12.06
 * Author: Lee Hong Jun (arcane22, hong3883@naver.com)
 * Description: Various middleware callbacks used in Express server are defined.
 */

/* Modules */
require('dotenv').config();
const { Request, Response, NextFunction } = require('express');
const passport = require('passport');
const uniqid = require('uniqid');

const type = require('@src/utils/type');
const mailer = require('@src/utils/mailer');
const logger = require('@src/utils/logger');
const utility = require('@src/utils/utility');
const encryption = require('@src/utils/encryption');
const authManager = require('@src/database/managers/authManager');

/**
 * @class AuthMiddleware
 * @description
 */
class AuthMiddleware {
    constructor() {}

    /**
     * @function signIn
     * @description Excuted when user sign in the web service. (middleware callback)
     *
     * @param {Request} req Express Request object (from client)
     * @param {Response} res Express Response object (to client)
     * @param {MextFunction} next Next function.
     */
    signIn(req, res, next) {
        // local sign in callback
        const signInCallback = (req, res, next, user) => {
            req.login(user, async (err) => {
                // occured sign in error
                if (err) {
                    logger.error(err);
                    return next(err);
                }
                // success to sign in the service
                else {
                    return utility.routerSend(res, type.HttpStatus.OK, user);
                }
            });
        };

        // local authentication callback
        const localAuthCallback = (err, user) => {
            // occured sign in error
            if (err) {
                logger.error(err);
                return next(err);
            }
            // cannot find the user
            else if (!user) {
                return utility.routerSend(res, type.HttpStatus.NotFound, 'WrongInformation', true);
            }
            // try to make sign in
            else {
                signInCallback(req, res, next, user);
            }
        };

        if (req.isAuthenticated()) delete req.session.passport;
        passport.authenticate('local', localAuthCallback)(req, res, next);
    }

    /**
     * @async 
     * @function signUp
     * @description Called when user sign up for a web service. (middleware callback)
     * 
     * Request.body = {
            email,
            password,
            authCode,
            name,
            studentID,
            major
        }
     *
     * @param {Request} req Express Request object (from client)
     * @param {Response} res Express Response object (to client)
     * @param {NextFunction} next Next function.
     */
    async signUp(req, res, next) {
        // Make account, user object
        const accObj = type.cloneAccountObject(req.body);
        const userObj = type.cloneUserObject(req.body);
        const authCode = req.body.authCode;

        try {
            // Check whether the email is duplicated or not.
            if (await authManager.findAccountByEmail(accObj.email)) return utility.routerSend(res, type.HttpStatus.Conflict, 'DuplicatedEmail', true);
            // Check whether the studentID is duplicated or not.
            else if (await authManager.findUserByStudentID(userObj.studentID)) return utility.routerSend(res, type.HttpStatus.Conflict, 'DuplicatedStudentID', true);

            // Check whether the auth mail is valid or not.
            if (!(await authManager.isValidAuthCode(accObj.email, authCode))) {
                return res.sendStatus(type.HttpStatus.BadRequest);
            }

            // Register new account & user information
            if (await authManager.registerUserInfo(accObj, userObj)) return res.sendStatus(type.HttpStatus.Created);
            else throw new Error('FailToRegisterUserError');
        } catch (err) {
            logger.error(err);
            return next(err);
        }
    }

    /**
     * @function signOut
     * @description Called when user sign out for a web service. (middleware callback)
     *
     * @param {Request} req Express Request object (from client)
     * @param {Response} res Express Response object (to client)
     * @param {NextFunction} next Next function
     */
    signOut(req, res, next) {
        try {
            req.logout();
            req.session.destroy();
            utility.routerSend(res);
        } catch (err) {
            logger.error(err);
            return next(err);
        }
    }

    /**
     * @async
     * @function findEmail
     * @description Find email using user's name & studentID
     * 
     *  req.body = {
            name,
            studentID
        }

        res.data = {
            {
                email: 'useremail@abcd.com'
            }
        }
     * 
     * @param {Request} req Express Request object (from client)
     * @param {Response} res Express Response object (to client)
     * @param {NextFunction} next Next function
     */
    async findEmail(req, res, next) {
        const name = req.body.name;
        const studentID = req.body.studentID;

        try {
            const result = await authManager.findEmailByUser(name, studentID);

            if (result) {
                utility.routerSend(res, type.HttpStatus.OK, result);
            } else {
                utility.routerSend(res, type.HttpStatus.NotFound);
            }
        } catch (err) {
            logger.error(err);
            return next(err);
        }
    }

    /**
     * @async
     * @function resetPassword
     * @description Reset account password (without sign in)
     *
     * @param {Request} req Express Request object (from client)
     * @param {Response} res Express Response object (to client)
     * @param {NextFunction} next Next function
     */
    async resetPassword(req, res, next) {
        const email = req.body.email;

        try {
            if (!email) return utility.routerSend(res, type.HttpStatus.BadRequest, 'BadRequest', true);

            const account = await authManager.findAccountByEmail(email);
            if (account) {
                const tempPW = await encryption.createSalt();

                // success to send & update temporary password
                if (await authManager.resetPasswordByIdx(account.idx, tempPW)) {
                    await mailer.sendResetPwMail(email, tempPW);
                    utility.routerSend(res);
                }
                // fail to send temporary password
                else {
                    utility.routerSend(res, type.HttpStatus.BadRequest, 'BadRequest', true);
                }
            } else {
                // Cannot find email in database
                utility.routerSend(res, type.HttpStatus.NotFound, 'NotFound', true);
            }
        } catch (err) {
            logger.error(err);
            return next(err);
        }
    }

    /**
     * @async 
     * @function updatePassword
     * @description Update account password 
     * 
     *  req.body = {
            password
        }
     * 
     * @param {Request} req Express Request object (from client)
     * @param {Response} res Express Response object (to client)
     * @param {NextFunction} next Next function
     */
    async updatePassword(req, res, next) {
        const password = req.body.password;

        if (!password) return utility.routerSend(res, type.HttpStatus.BadRequest, 'BadRequest', true);

        try {
            if (await authManager.resetPasswordByIdx(req.user.idx, password)) utility.routerSend(res);
            else utility.routerSend(res, type.HttpStatus.BadRequest, 'FailToUpdatePW', true);
        } catch (err) {
            logger.error(err);
            return next(err);
        }
    }

    /**
     * @async
     * @function deleteAccount
     * @description Delete account from service
     *
     * @param {Request} req Express Request object (from client)
     * @param {Response} res Express Response object (to client)
     * @param {NextFunction} next Next function
     */
    async deleteAccount(req, res, next) {
        const idx = req.user.idx;
        if (!idx) return utility.routerSend(res, type.HttpStatus.Unauthorized);

        try {
            await authManager.deleteAccountByIdx(idx);
            utility.routerSend(res, type.HttpStatus.NoContent);
        } catch (err) {
            logger.error(err);
            return next(err);
        }
    }

    /**
     * @async
     * @function sendAuthMail
     * @description Send authentication to client & Register it to database.
     * 
     * Request.body = {
            email,
        }

     * @param {Request} req Express Request object (from client)
     * @param {Response} res Express Response object (to client)
     * @param {NextFunction} next Next function
     */
    async sendAuthMail(req, res, next) {
        // Get email from req.body
        const email = req.body.email;
        if (!email) return utility.routerSend(res, type.HttpStatus.BadRequest, 'BadRequest', true);

        try {
            // send auth mail
            if (await mailer.sendAuthMail(email)) utility.routerSend(res, type.HttpStatus.OK);
            else throw Error('FailToSendAuthMail');
        } catch (err) {
            logger.error(err);
            return next(err);
        }
    }

    /**
     * @function isSignedIn
     * @description
     * Check whether the user is signed in to the web service or not. (middleware callback)
     * Logout router or image upload router is accessible only to signed in user.
     *
     * @param {Request} req Express Request object (from client)
     * @param {Response} res Express Response object (to client)
     * @param {NextFunction} next Next function.
     */
    isSignedIn(req, res, next) {
        if (req.isAuthenticated()) {
            // Authenticated request, next()
            next();
        } else {
            // Unauthenticated request, send 401 Unauthorized
            utility.routerSend(res, type.HttpStatus.Unauthorized, 'Unauthorized', true);
        }
    }

    /**
     * @function isNotSignedIn
     * @description
     * Check whether the user is not signed in to the web service or not. (middleware callback)
     * Sign up router or sign in router is accessible only to those who have not signed in.
     *
     * @param {Request} req Express Request object (from client)
     * @param {Response} res Express Response object (to client)
     * @param {NextFunction} next Next function.
     */
    isNotSignedIn(req, res, next) {
        if (!req.isAuthenticated()) {
            // Unauthenticated request, next()
            next();
        } else {
            // Authenticated request, send 400 Bad Request
            utility.routerSend(res, type.HttpStatus.BadRequest, 'BadRequest', true);
        }
    }
}

/* Export instance as module */
module.exports = new AuthMiddleware();
