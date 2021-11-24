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
const Type = require('@src/utils/type');
const db = require('@src/database/database2');

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

    /**
     *
     * @param {*} email
     * @returns
     */
    async findAccountByEmail(email) {
        let result = null;
        const q = db.models.Account.makeQuery(Type.QueryType.create);
        q.conditions.where = { email };

        try {
            result = await db.execQuery(q);
        } catch (err) {
            logger.error(err);
        } finally {
            return result;
        }
    }
}

module.exports = new AccountManager();
