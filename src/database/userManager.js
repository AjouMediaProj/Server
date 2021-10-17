/**
 * userManager.js
 * Last modified: 2021.10.18
 * Author: Lee Hong Jun
 * Description: Candidate model
 */

/* Modules */
const database = require('@src/database/database');
const logger = require('@src/utils/logger');
const utility = require('@src/utils/utility');
const encryption = require('@src/utils/encryption');

/* Variables */
const baseUserObj = {
    uid: null,
    email: null,
    schoolEmail: null,
    name: null,
    nickname: null,
    password: null,
    salt: null,
    snsId: null,
    provider: null,
    isAdmin: false,
};

/**
 * @class UserManager
 * @description
 */
class UserManager {
    constructor() {}

    /**
     * @function createUser
     * @description Create new user in database.
     *
     * @param {object} userObj User object based on baseUserObj.
     * @returns {object} User object from mysql.
     */
    async createUser(userObj) {
        try {
            const user = await database.models.user.create(userObj);
            return user;
        } catch (err) {
            logger.error(err);
            return null;
        }
    }

    /**
     * @function findUser
     * @description Find the user who meet the conditions.
     *
     * @param {object} conditions query conditions.
     * @returns {object} User object from mysql.
     */
    async findUser(conditions) {
        const query = { where: conditions };

        try {
            const user = await database.models.user.findOne(query);
            return user;
        } catch (err) {
            logger.error(err);
            return null;
        }
    }

    /**
     * @function findAllUsers
     * @description Find all the users who meet the conditions
     *
     * @param {object} conditions query conditions.
     * @returns {Array} User object array.
     */
    async findAllUsers(conditions) {
        const query = { where: conditions };

        try {
            const users = await database.models.user.findAll(query);
            return users;
        } catch (err) {
            logger.error(err);
            return null;
        }
    }

    /**
     * @function updateUser
     * @description Update user informations in database.
     *
     * @param {object} contents contents to update.
     * @param {object} conditions query conditions.
     * @returns {boolean}
     */
    async updateUser(contents, conditions) {
        const query = { where: conditions };
        try {
            await database.models.user.update(contents, query);
            return true;
        } catch (err) {
            logger.error(err);
            return false;
        }
    }

    /**
     * @function deleteUser
     * @description Delete user in database.
     *
     * @param {object} conditions query conditions.
     * @returns {boolean}
     */
    async deleteUser(conditions) {
        const query = { where: conditions };
        try {
            await database.models.user.destroy(query);
            return true;
        } catch (err) {
            logger.error(err);
            return false;
        }
    }

    /**
     * @async @function createLocalUserObject
     * @description Create new local (blote) user object.
     *
     * @param {object} initDataObj An object used for initializing user object.
     * @returns {object} New Local user object.
     */
    async createLocalUserObject(initDataObj) {
        let newUser = utility.clone(baseUserObj, initDataObj);

        try {
            newUser.salt = await encryption.createSalt(16);
            newUser.password = await encryption.createHash(newUser.password, newUser.salt);
            newUser.uid = await encryption.createHash(newUser.email, newUser.salt);
            newUser.snsId = -1;
            newUser.provider = 'blote';

            return newUser;
        } catch (err) {
            logger.error(err);
            return null;
        }
    }

    /**
     * @async @function createKakaoUserObject
     * @description Create new kakao user object.
     *
     * @param {object} profile Profile object from kakao login strategy callback.
     * @returns {object} New Kakao user object.
     */
    async createKakaoUserObject(profile) {
        let newUser = utility.clone(baseUserObj);

        try {
            newUser.email = profile._json.kakao_account.email;
            newUser.salt = await encryption.createSalt(16);
            newUser.uid = await encryption.createHash(newUser.email, newUser.salt);
            newUser.name = newUser.nickname = profile.displayName;
            newUser.snsId = profile.id;
            newUser.provider = 'kakao';
            return newUser;
        } catch (err) {
            logger.error(err);
            return null;
        }
    }

    /**
     * @async @function isValidAccount
     * @description Check if the account is in the database.
     *
     * @param {string} id User email id.
     * @returns {object} User object from mysql.
     */
    async isValidAccount(id) {
        let user = null;
        try {
            /*switch (provider) {
                case 'blote':
                    user = await this.findUser({ email: id, provider });
                    break;
                case 'kakao':
                    user = await this.findUser({ snsId: id, provider });
                    break;
                default:
                    throw new Error('Undefined Provider Error');
            }*/
            user = await this.findUser({ email: id });
            return user;
        } catch (err) {
            logger.error(err);
            return null;
        }
    }
}

/* Export object as module */
module.exports = new UserManager();
