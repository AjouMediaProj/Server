/**
 * pageMiddleware.js
 * Last modified: 2021.10.29
 * Author: Lee Hong Jun (arcane22, hong3883@naver.com)
 * Description: Various middleware callbacks used in Express server are defined.
 */

/* Modules */
require('dotenv').config();
const logger = require('@src/utils/logger');

/**
 * @class PageMiddleware
 * @description
 */
class PageMiddleware {
    constructor() {}

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
}

/* Export instance as module */
module.exports = new PageMiddleware();
