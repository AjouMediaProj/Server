/**
 * authRouther.js
 * Last modified: 2021.10.16
 * Author: Lee Hong Jun (arcane22, hong3883@naver.com)
 * Description: Express router related to authentication.
 */

/* Modules */
const express = require('express');
const passport = require('passport');
const middlewares = require('@src/routes/middlewares');

const router = express.Router();

// POST Request [/auth/signin]: Sign in reqeust.
router.post('/signin', middlewares.isNotSignedIn, middlewares.signIn);

// POST Request [/auth/signup]: Sign up request.
router.post('/signup', middlewares.isNotSignedIn, middlewares.signUp);

// POST Request [/auth/signout]: Sign out request.
router.get('/signout', middlewares.isSignedIn, middlewares.signOut);

// GET Request [/auth/kakao]: Sign in request. (using the kakao authentication system)
router.get('/kakao', passport.authenticate('kakao'));

// GET Request [/auth/kakao/callback]: Sign in request result callback. (using the kakao authentication system)
router.get('/kakao/callback', passport.authenticate('kakao', { failureRedirect: '/' }), middlewares.redirectToRoot);

/* Export the router as module */
module.exports = router;
