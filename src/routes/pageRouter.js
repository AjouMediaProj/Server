/**
 * pageRouter.js
 * Last modified: 2021.10.16
 * Author: Lee Hong Jun (arcane22, hong3883@naver.com)
 * Description: Express router related to each pages.
 */

/* Modules */
const express = require('express');
const middlewares = require('@src/routes/middlewares');
const logger = require('@src/utils/logger');

const router = express.Router();

// Entry Middleware (Excuted for all requests)
router.use(middlewares.entryMiddleware);

// GET Request : Excuted all page requests.
//router.use(middlewares.getPage);

// GET Request [/]: Root page request.
router.get('/', middlewares.getRootPage);

// GET Request [/signup]: Sign up page request.
router.get('/signup', middlewares.isNotSignedIn, middlewares.getSignUpPage);

// GET Request [/profile]: Profile page request.
router.get('/profile', middlewares.isSignedIn, middlewares.getProfilePage);

/* Export the router as module */
module.exports = router;
