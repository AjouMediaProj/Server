/**
 * pageRouter.js
 * Last modified: 2021.10.16
 * Author: Lee Hong Jun (arcane22, hong3883@naver.com)
 * Description: Express router related to each pages.
 */

/* Modules */
const express = require('express');
const pageMiddleware = require('@root/src/routes/middlewares/pageMiddleware');
const authMiddleware = require('@src/routes/middlewares/authMiddleware');
const utilsMiddleware = require('@root/src/routes/middlewares/utilsMiddleware');
const logger = require('@src/utils/logger');

const router = express.Router();

// Entry Middleware (Excuted for all requests)
router.use(utilsMiddleware.entryMiddleware);

// GET Request : Excuted all page requests.
//router.use(middlewares.getPage);

// GET Request [/]: Root page request.
router.get('/', pageMiddleware.getRootPage);

// GET Request [/signup]: Sign up page request.
router.get('/signup', authMiddleware.isNotSignedIn, pageMiddleware.getSignUpPage);

// GET Request [/profile]: Profile page request.
router.get('/profile', authMiddleware.isSignedIn, pageMiddleware.getProfilePage);

/* Export the router as module */
module.exports = router;
