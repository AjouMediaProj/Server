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
        this.accountType = {
            local: 0,
            kakao: 1,
        };
    }

    async setAccountInactive(email) {
        const contents = { accessLevel: -1 };
        const query = { where: { email } };

        try {
            await this.update('account', contents, query);
            return true;
        } catch (err) {
            logger.error(err);
            return false;
        }
    }

    async findAccountByEmail(email) {
        let account = null;
        const query = { where: { email } };
        try {
            account = await this.find('account', query);
        } catch (err) {}
    }
    /**
     * @async @function deleteAccount
     * @description Delete the account in database.
     *
     * @param {object} conditions query conditions.
     * @returns {boolean} Result of delete operation.
     */
    async deleteAccountByEmail(email) {
        const query = { where: { email } };
        try {
            await super.delete('account', query);
            return true;
        } catch (err) {
            logger.error(err);
            return false;
        }
    }

    /**
     * @async @function makeAccountObj
     * @description Make new object based on baseAcountObject
     *
     * @param {number} type Account type. (Local: 0, kakao: 1) (based on accountManager.accountType.local or .kakao)
     * @param {string} email user's account email.
     * @param {string} password user's account password.
     * @param {string} snsId user's snsId. (Local: -1, kakao: profile.id)
     * @returns {baseAccountObject} New account object.
     */
    async makeAccountObj(type, email, password = -1, snsId = -1) {
        let account = super.getBaseObject(baseAccountObject);

        account.email = email;
        account.snsId = snsId;
        account.provider = type;
        account.salt = await encryption.createSalt(16);
        account.uid = await encryption.createHash(account.email, account.salt);
        account.password = password == -1 ? password : await encryption.createHash(password, account.salt);

        return account;
    }
}

module.exports = new AccountManager();
