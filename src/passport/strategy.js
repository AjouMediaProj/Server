/**
 * strategy.js
 * Last modified: 2021.11.04
 * Author: Lee Hong Jun (arcane22, hong3883@naver.com)
 * Description: Initialize the passport configurations.
 */

/* Modules */
const passportLocal = require('passport-local');
const passportKakao = require('passport-kakao');
const accountManager = require('@src/database/managers/accountManager');

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
                const account = await accountManager.findAccountByEmail(email);

                // Check whether the account exist in the database or not.
                if (!account) {
                    done(null, false, { message: 'This account does not exist.' });
                }

                // Check wheter the password is valid or not.
                const isValidPassword = await encryption.compareHash(password, account.salt, account.password);
                if (!isValidPassword) {
                    done(null, false, { message: `The password doesn't match.` });
                }

                // success to authenticate the account.
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
                const account = await accountManager.findAccountByEmail(profile._sjon.kakao_account.email);

                if (account) {
                    done(null, account.dataValues);
                } else {
                    const newAccount = await accountManager.makeAccountObj(accountManager.accountType.kakao, profile._json.kakao_account.email, -1, profile.id);
                    await accountManager.createAccount(newAccount);
                    done(null, newAccount);
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
