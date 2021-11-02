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

const contract = require('@src/blockchain/contract');

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

    // Temp Router
    async addVote(req, res) {
        const reqKeys = {
            voteName: 'voteName',
            startTime: 'startTime',
            endTime: 'endTime',
        };
        const resKeys = {
            idx: 'idx',
            voteName: 'voteName',
            startTime: 'startTime',
            endTime: 'endTime',
        };

        try {
            const resData = {};
            const body = req.query;
            const voteName = body[reqKeys.voteName];
            const startTime = body[reqKeys.startTime];
            const endTime = body[reqKeys.endTime];

            // @todo - Insert DB(startTransaction ~ query)

            const rtn = await contract.addVote(voteName, startTime, endTime);

            // @todo - Insert DB(commit or rollback ~ release)

            resData[resKeys.idx] = rtn.idx;
            resData[resKeys.voteName] = rtn.name;
            resData[resKeys.startTime] = rtn.startTime;
            resData[resKeys.endTime] = rtn.endTime;

            logger.info(resData);
            res.send(resData);
        } catch (err) {
            logger.error(err);
            res.send(err);
        }
    }

    async addCandidate(req, res) {
        const reqKeys = {
            voteIdx: 'voteIdx',
            candName: 'candName',
        };
        const resKeys = {
            idx: 'idx',
            candName: 'candName',
        };

        try {
            const resData = {};
            const body = req.query;
            const voteIdx = body[reqKeys.voteIdx];
            const candName = body[reqKeys.candName];

            // @todo - Save Image, Insert DB(startTransaction ~ query)

            const rtn = await contract.addCandidate(voteIdx, candName);

            // @todo - Insert DB(commit or rollback ~ release)

            resData[resKeys.idx] = rtn.idx;
            resData[resKeys.candName] = rtn.name;

            logger.info(resData);
            res.send(resData);
        } catch (err) {
            logger.error(err);
            res.send(err);
        }
    }

    async vote(req, res) {
        const reqKeys = {
            voteIdx: 'voteIdx',
            candIdx: 'candIdx',
            renounce: 'renounce',
        };
        const resKeys = {
            receipt: 'receipt',
        };

        try {
            const resData = {};
            const body = req.query;
            const voteIdx = Number(body[reqKeys.voteIdx]);
            const candIdx = Number(body[reqKeys.candIdx]);
            // const renounce = body[reqKeys.renounce];
            const renounce = body[reqKeys.renounce] == 'true' ? true : false;

            // @todo - Check user's status
            // @todo - Update user's status, Insert DB(startTransaction ~ query)

            const rtn = await contract.vote(voteIdx, candIdx, renounce);

            // @todo - Insert DB(commit or rollback ~ release)

            resData[resKeys.receipt] = rtn.receipt;

            logger.info(resData);
            res.send(resData);
        } catch (err) {
            logger.error(err);
            res.send(err);
        }
    }

    async getVoteOverview(req, res) {
        const reqKeys = {
            voteIdx: 'voteIdx',
        };
        const resKeys = {
            idx: 'idx',
            voteName: 'voteName',
            candidates: 'candidates',
            totalVoteCnt: 'totalVoteCnt',
            startTime: 'startTime',
            endTime: 'endTime',
            status: 'status',
        };

        try {
            const resData = {};
            const body = req.query;
            const voteIdx = body[reqKeys.voteIdx];

            const voteData = await contract.getVote(voteIdx);

            let candidates = [];
            for (let i in voteData.candIdxes) {
                const candData = await contract.getCandidate(voteData.candIdxes[i]);
                candidates.push(candData);
            }

            resData[resKeys.idx] = voteData.voteIdx;
            resData[resKeys.voteName] = voteData.voteName;
            resData[resKeys.candidates] = candidates;
            resData[resKeys.totalVoteCnt] = voteData.totalVoteCnt;
            resData[resKeys.startTime] = voteData.startTime;
            resData[resKeys.endTime] = voteData.endTime;
            resData[resKeys.status] = voteData.status;

            logger.info(resData);
            res.send(resData);
        } catch (err) {
            logger.error(err);
            res.send(err);
        }
    }

    async decodeVoteReceipt(req, res) {
        const reqKeys = {
            transactionHash: 'transactionHash',
        };
        const resKeys = {
            voteIdx: 'voteIdx',
            candIdx: 'candIdx',
            renounce: 'renounce',
        };

        try {
            const resData = {};
            const body = req.query;
            const transactionHash = body[reqKeys.transactionHash];

            const decodedData = await contract.decodeVoteReceipt(transactionHash);

            resData[resKeys.voteIdx] = decodedData.voteIdx;
            resData[resKeys.candIdx] = decodedData.candIdx;
            resData[resKeys.renounce] = decodedData.renounce;

            logger.info(resData);
            res.send(resData);
        } catch (err) {
            logger.error(err);
            res.send(err);
        }
    }
}

/* Export Middlewares object as module */
module.exports = new Middlewares();
