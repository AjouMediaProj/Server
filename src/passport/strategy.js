/**
 * strategy.js
 * Last modified: 2021.12.01
 * Author: Lee Hong Jun (arcane22, hong3883@naver.com)
 * Description: Initialize the passport configurations.
 */

/* Modules */
const passportLocal = require('passport-local');
const passportKakao = require('passport-kakao');
const authManager = require('@src/database/managers/authManager');

const LocalStrategy = passportLocal.Strategy;
const KakaoStrategy = passportKakao.Strategy;

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
            usernameField: 'email', // req.body.email
            passwordField: 'password', // re.body.password
            session: true,
        };

        return new LocalStrategy(opts, authManager.localStrategyCallback);
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

        return new KakaoStrategy(opts, authManager.kakaoStrategyCallback);
    }
}

/* Export object as module */
module.exports = new Strategy();
