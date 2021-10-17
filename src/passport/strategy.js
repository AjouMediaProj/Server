/**
 * strategy.js
 * Last modified: 2021.10.16
 * Author: Lee Hong Jun (arcane22, hong3883@naver.com)
 * Description: Initialize the passport configurations.
 */

/* Modules */
const passportLocal = require('passport-local');
const passportKakao = require('passport-kakao');
const userManager = require('@src/database/userManager');

const LocalStrategy = passportLocal.Strategy;
const KakaoStrategy = passportKakao.Strategy;

/* Utils */
const logger = require('@src/utils/logger');
const encryption = require('@src/utils/encryption');

/**
 * @class Strategy
 * @description
 */
class Strategy {
    constructor() {}

    /**
     * @function createLocalStrategy
     * @description create local authentication strategy.
     *
     * @return {LocalStrategy} Authentication strategy based on local.
     * @example
     * ...
     * passport.use(strategy.createLocalStrategy());
     */
    createLocalStrategy() {
        const opts = {
            usernameField: 'email',
            passwordField: 'password',
            session: true,
        };

        const callback = async (email, password, done) => {
            try {
                const user = await userManager.isValidAccount(email, 'blote');

                // account does not exist.
                if (!user) {
                    done(null, false, { message: 'This account does not exist.' });
                }

                // Invalid password.
                const isValid = await encryption.compareHash(password, user.salt, user.password);
                if (!isValid) {
                    done(null, false, { message: `The password doesn't match.` });
                }

                // success to authenticate user's account.
                done(null, user);
            } catch (err) {
                logger.error(err);
                done(err);
            }
        };

        return new LocalStrategy(opts, callback);
    }

    /**
     * @function createKakaoStrategy
     * @description create kakao authentication strategy.
     *
     * @returns {KakaoStrategy} Authentication strategy based on kakao.
     * @example
     * ...
     * passport.use(strategy.createKakaoStrategy());
     */
    createKakaoStrategy() {
        const opts = {
            clientID: process.env.KAKAO_ID,
            callbackURL: '/auth/kakao/callback',
        };

        const callback = async (accessToken, refreshToken, profile, done) => {
            try {
                const exUser = await userManager.isValidAccount(profile._json.kakao_account.email);
                if (exUser) {
                    done(null, exUser.dataValues);
                } else {
                    const newUser = await userManager.createKakaoUserObject(profile);
                    await userManager.createUser(newUser);
                    done(null, newUser);
                }
            } catch (err) {
                logger.error(err);
                done(err);
            }
        };

        return new KakaoStrategy(opts, callback);
    }
}

/* Export object as module */
module.exports = new Strategy();
