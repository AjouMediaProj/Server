/**
 * accountManager.js
 * Last modified: 2021.11.08
 * Author: Lee Hong Jun (arcane22, hong3883@naver.com)
 * Description: Account model(table) manager
 */

/* Modules */
const BaseManager = require('@src/database/managers/baseManager');
const logger = require('@src/utils/logger');
const encryption = require('@src/utils/encryption');
const utility = require('@src/utils/utility');

/* Base Account Object */
let baseAccountObject = {
    idx: null,
    email: null,
    password: null,
    salt: null,
};

/* Sequelize 'Account' model */
let accountModel = null;

/**
 * @class AccountManager @extends BaseManager
 * @description
 */
class AccountManager extends BaseManager {
    /**
     * @constructor
     * @description Constructor of AccountManager class. Initialize the accountModel property.
     */
    constructor() {
        super();
    }
}

module.exports = new AccountManager();
