/**
 * userManager.js
 * Last modified: 2021.11.04
 * Author: Lee Hong Jun (arcane22, hong3883@naver.com)
 * Description: Candidate model
 */

/* Modules */
const BaseManager = require('@src/database/managers/baseManager');
const logger = require('@src/utils/logger');
const utility = require('@src/utils/utility');
const encryption = require('@src/utils/encryption');

/* Variables */
const baseUserObject = {
    uid: null,
    name: null,
    nickname: null,
    age: null,
    gender: null,
    birthday: null,
    accessLevel: 0,
};

let userModel = null;

/**
 * @class UserManager
 * @description
 */
class UserManager extends BaseManager {
    constructor() {
        super();
    }
}

/* Export object as module */
module.exports = new UserManager();
