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
 * -------------------- [GET] --------------------
 */

/* URL: '/auth/kakao' - Sign in request. (passport kakao) */
router.get('/kakao', passport.authenticate('kakao'));

/* URL: '/auth/kakao/callback' - Sign in request result callback. (passport kakao) */
router.get('/kakao/callback', passport.authenticate('kakao', { failureRedirect: '/' }), utilsMiddleware.redirectToRoot);

/* URL: '/auth/find-email' - Find email request. */
router.get('/find-email', authMiddleware.isNotSignedIn, authMiddleware.findEmail);

/**
 * -------------------- [POST] --------------------
 */

/* URL: '/auth/send-email' - Send authentication email */
router.post('/send-auth-mail', authMiddleware.sendAuthMail);

/* URL: '/auth/sign-in' - sign in request. (passport local) */
router.post('/sign-in', authMiddleware.signIn);

/* URL: '/auth/sign-up' - sign up request. (passport local) */
router.post('/sign-up', authMiddleware.isNotSignedIn, authMiddleware.signUp);

/* URL: '/auth/sign-out' - Sign out from service */
router.post('/sign-out', authMiddleware.isSignedIn, authMiddleware.signOut);

/**
 * -------------------- [PATCH] --------------------
 */

/* URL: '/auth/update-password' - Update account password */
router.patch('/update-password', authMiddleware.isSignedIn, authMiddleware.updatePassword);

/* URL: '/auth/reset-password' - Reset the account password to temporary password. */
router.patch('/reset-password', authMiddleware.isNotSignedIn, authMiddleware.resetPassword);

/**
 * -------------------- [DELETE] --------------------
 */
router.delete('/delete-account', authMiddleware.isSignedIn, authMiddleware.deleteAccount);

/* Export the router as module */
module.exports = router;
