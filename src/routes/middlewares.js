/**
 * middlewares.js
 * Last modified: 2021.10.16
 * Author: Lee Hong Jun (arcane22, hong3883@naver.com)
 * Description: Various middleware callbacks used in Express server are defined.
 */

/* Modules */
require('dotenv').config();
const passport = require('passport');
const userManager = require('@src/database/userManager');
const logger = require('@src/utils/logger');

/**
 * @class Middlewares
 * @description
 */
class Middlewares {
    constructor() {}

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
     * @function getPage
     * @description Process GET requests for page resources. (middleware callback)
     * @param {object} req Client's Request object.
     * @param {object} res Server's Response object.
     * @param {function} next Next function.
     */
    getPage(req, res, next) {
        const method = req.method;
        const url = req.url;

        if (method !== 'GET') {
            next();
        }

        switch (url) {
            // GET Request [/] : Root page
            case '/': {
                const twits = [];
                res.render('main', {
                    title: 'Test',
                    twits,
                });
                break;
            }

            // GET Request [/signup] : Sign up page
            case '/signup': {
                res.render('signup', { title: '회원가입' });
                break;
            }

            // GET Request [/profile] : Profile page
            case '/profile': {
                res.render('profile', { title: '내 정보' });
                break;
            }

            default: {
                next();
                break;
            }
        }
    }

    /**
     * @function getRootPage
     * @description Process GET requests for root page resources. (middleware callback)
     * @param {object} req Client's Request object.
     * @param {object} res Server's Response object.
     * @param {function} next Next function.
     */
    getRootPage(req, res, next) {
        const twits = [];
        res.render('main', {
            title: 'Test',
            twits,
        });
    }

    /**
     * @function getSignUpPage
     * @description Process GET requests for sign up page resources. (middleware callback)
     * @param {object} req Client's Request object.
     * @param {object} res Server's Response object.
     */
    getSignUpPage(req, res) {
        res.render('signup', { title: '회원가입' });
    }

    /**
     * @function getProfilePage
     * @description Process GET requests for profile page resources. (middleware callback)
     * @param {object} req Client's Request object.
     * @param {object} res Server's Response object.
     */
    getProfilePage(req, res) {
        res.render('profile', { title: '내 정보' });
    }

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
        const initDataObj = {
            email: req.body.email,
            nickname: req.body.nickname,
            password: req.body.password,
        };

        try {
            const exUser = await userManager.isValidAccount(initDataObj.email, 'blote');
            if (exUser) {
                return res.redirect('/join?error=exist');
            }

            const newUser = await userManager.createLocalUserObject(initDataObj);
            await userManager.createUser(newUser);
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
       Sign up router or sign in router is accessible only to those who have not signed in.
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

/* Export Middlewares object as module */
module.exports = new Middlewares();
