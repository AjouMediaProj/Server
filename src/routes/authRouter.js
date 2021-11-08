/**
 * authRouther.js
 * Last modified: 2021.11.03
 * Author: Lee Hong Jun (arcane22, hong3883@naver.com)
 * Description: Express router related to authentication.
 */

/* Modules */
const express = require('express');
const passport = require('passport');
const authMiddleware = require('@src/routes/middlewares/authMiddleware');
const utilsMiddleware = require('@root/src/routes/middlewares/utilsMiddleware');

/* Router */
const router = express.Router();

/**
 * Local Authentication
 */

/* GET */

// '/auth/signout': sign out request. (using the local authentication system)
router.get('/signout', authMiddleware.isSignedIn, authMiddleware.signOut);

/* POST */

// '/auth/signin': sign in request. (using the local authentication system)
router.post('/signin', authMiddleware.isNotSignedIn, authMiddleware.signIn);

// '/auth/signup': sign up request. (using the local authentication system)
router.post('/signup', authMiddleware.isNotSignedIn, authMiddleware.signUp);

/**
 * Kakao Authentication
 */

/* GET */

// '/auth/kakao': Sign in request. (using the kakao authentication system)
router.get('/kakao', passport.authenticate('kakao'));

// '/auth/kakao/callback': Sign in request result callback. (using the kakao authentication system)
router.get('/kakao/callback', passport.authenticate('kakao', { failureRedirect: '/' }), utilsMiddleware.redirectToRoot);

/* Export the router as module */
module.exports = router;
