/**
 * passportConfig.js
 * Last modified: 2021.12.01
 * Author: Lee Hong Jun (arcane22, hong3883@naver.com)
 * Description: Initialize the passport configurations.
 */

/* Modules */
require('dotenv').config();
const passport = require('passport');
const strategy = require('@src/passport/strategy');

const type = require('@src/utils/type');
const logger = require('@src/utils/logger');
const authManager = require('@src/database/managers/authManager');

/**
 * @class PassportConfig
 * @description
 */
class PassportConfig {
    constructor() {}

    /**
     * @function init
     * @description Initialize the passport configurations.
     * Set up the serializeUser, deserializeUser, local strategy and kakao strategy.
     */
    init() {
        // Run only when user sign in the web service. (save user information object as ID in session)
        // If you save all user information in session, the capacity of the session increases, so save only id.
        passport.serializeUser((user, done) => {
            done(null, user.email);
        });

        // Execute per every request. passport.session calls this method. (recall the user information object through the ID saved in the session)
        passport.deserializeUser(async (email, done) => {
            try {
                const user = await authManager.findAccountByEmail(email);
                done(null, user);
            } catch (err) {
                logger.error(err);
                done(err);
            }
        });

        // Create & use local strategy
        passport.use(strategy.createLocalStrategy());

        // Create & use kakao strategy
        passport.use(strategy.createKakaoStrategy());
    }
}

/* Export class as module. */
module.exports = new PassportConfig();
