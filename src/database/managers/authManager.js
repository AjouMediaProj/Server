/**
 * authManager.js
 * Last modified: 2021.11.27
 * Author: Lee Hong Jun (arcane22, hong3883@naver.com)
 * Description: Account model(table) manager
 */

/* Modules */
const db = require('@src/database/database2');
const type = require('@src/utils/type');
const logger = require('@src/utils/logger');
const encryption = require('@src/utils/encryption');

/* Variables */
const modelName = {
    account: 'Account',
    user: 'User',
    authMail: 'AuthMail',
};

/**
 * @class AuthManager
 * @description
 */
class AuthManager {
    /**
     * --------------------------------------------------------------
     * ------------------------- [ CREATE ] -------------------------
     * --------------------------------------------------------------
     */
    /**
     * @async @function registerUserInfo
     * @description Register new user information (account, user information)
     *
     * @param {type.AccountObject} accObj Account object based on type.AccountObject
     * @param {type.UserObject} userObj User object based on type.UserObject
     * @returns {boolean} Result of registration
     */
    async registerUserInfo(accObj, userObj) {
        let t = null;
        let result = false;
        let queryResult = null;

        accObj.salt = await encryption.createSalt(16);
        accObj.password = await encryption.createHash(accObj.password, accObj.salt);

        try {
            // begin transaction
            t = await db.sequelize.transaction();

            // register tuple in Account table
            queryResult = await db.getModel(modelName.account).create(accObj, t);
            if (queryResult) userObj.idx = queryResult.idx;
            else await t.rollback();

            // register tuple in User table
            queryResult = await db.getModel(modelName.user).create(userObj, t);
            if (queryResult) await t.commit();
            else t.rollback();

            //await db.sequelize.query(`DELETE FROM votedb_development WHERE email='${accObj.email}'`);
            result = true;
        } catch (err) {
            await t.rollback();
            throw err;
        }

        return result;
    }

    /**
     * --------------------------------------------------------------
     * -------------------------- [ READ ] --------------------------
     * --------------------------------------------------------------
     */
    /**
     * @async
     * @function findAccountByIdx
     * @description
     *
     * @param {number} idx Check whether the account exists in the database or not.
     * @returns {type.AccountObject}
     */
    async findAccountByIdx(idx) {
        let result = false;
        const q = db.getModel(modelName.account).makeQuery(type.QueryMethods.findOne, null, { where: { idx } });

        try {
            result = await db.execQuery(q);
            return result;
        } catch (err) {
            logger.error(err);
        }
    }

    /**
     * @async
     * @function findAccountByEmail
     * @description
     *
     * @param {string} email Check whether the account exists in the database or not.
     * @returns {type.AccountObject}
     */
    async findAccountByEmail(email) {
        let result = false;
        const q = db.getModel(modelName.account).makeQuery(type.QueryMethods.findOne, null, { where: { email } });

        try {
            result = await db.execQuery(q);
            return result;
        } catch (err) {
            logger.error(err);
        }
    }

    /**
     * @async
     * @function findEmailByUser
     * @description Find account email using user name & studentID
     *
     * @param {string} name User name
     * @param {number} studentID User student ID
     * @returns {string} User's account email
     */
    async findEmailByUser(name, studentID) {
        let q = null;
        let idx = null;
        let result = null;

        try {
            // Get idx from users table
            q = db.getModel(modelName.user).makeQuery(type.QueryMethods.findOne, null, {
                where: {
                    [db.Op.and]: [{ name }, { studentID }],
                },
                attributes: ['idx'],
            });
            idx = await db.execQuery(q);

            if (idx) {
                q.model = modelName.account;
                q.conditions.where = idx;
                q.conditions.attributes = ['email'];

                result = await db.execQuery(q);
            }
        } catch (err) {
            throw err;
        }

        return result;
    }

    /**
     * @async
     * @function findUserByIdx
     * @description
     *
     * @param {number} idx
     * @returns {type.UserObject}
     */
    async findUserByIdx(idx) {
        let result = null;

        try {
            const q = db.getModel(modelName.user).makeQuery(type.QueryMethods.findOne);
            q.conditions.where = { idx };
            q.conditions.attributes = ['name', 'studentID', 'major', 'accessLevel'];
            result = await db.execQuery(q);
        } catch (err) {
            throw err;
        }

        return result;
    }

    /**
     * @async
     * @function findUserByStudentID
     * @description
     *
     * @param {number} studentID
     * @returns
     */
    async findUserByStudentID(studentID) {
        let result = null;

        try {
            const q = db.getModel(modelName.user).makeQuery(type.QueryMethods.findOne);
            q.conditions.where = { studentID };

            result = await db.execQuery(q);
        } catch (err) {
            throw err;
        }

        return result;
    }

    /**
     * @async
     * @function isValidAuthCode
     * @description Check whether the auth mail & authCode is valid or not.
     *
     * @param {string} email
     * @param {string} authCode
     * @returns {boolean} Validation of auth mail (boolean)
     */
    async isValidAuthCode(email, authCode) {
        let result = false;

        try {
            const q = db.getModel(modelName.authMail).makeQuery(type.QueryMethods.findOne, null, { where: { email } });
            const queryResult = await db.execQuery(q);

            if (queryResult) {
                // Authentication mail exists in the database.
                const code = queryResult.authCode;
                const date = new Date(queryResult.expirationDate);
                const tzOffsetHour = (date.getTimezoneOffset() * -1) / 60;
                date.setHours(date.getHours() + tzOffsetHour);

                // check auth code & expiration date
                if (authCode === code && Date.now() < date.getTime()) {
                    result = true;
                }
            }
        } catch (err) {
            logger.error(err);
        }

        return result;
    }

    /**
     * --------------------------------------------------------------
     * ------------------------- [ UPDATE ] -------------------------
     * --------------------------------------------------------------
     */
    /**
     * @async
     * @function resetPassword
     * @description Reset account's salt & password
     *
     * @param {number} idx user index
     * @param {string} pw user new password
     * @throws {error}
     * @returns {boolean} Result of reset password
     */
    async resetPasswordByIdx(idx, pw) {
        let result = false;

        try {
            const salt = await encryption.createSalt(16);
            const password = await encryption.createHash(pw, salt);

            const q = db.getModel(modelName.account).makeQuery(type.QueryMethods.update, { salt, password }, { where: { idx } });
            result = (await db.execQuery(q)) > 0;
        } catch (err) {
            throw err;
        }

        return result;
    }

    /**
     * --------------------------------------------------------------
     * ------------------------- [ DELETE ] -------------------------
     * --------------------------------------------------------------
     */
    /**
     * @async
     * @function deleteAccountByIdx
     * @description Delete account using index
     *
     * @param {number} idx User index
     * @returns {boolean} Result of deletion
     */
    async deleteAccountByIdx(idx) {
        try {
            const arr = [];
            const condition = { where: { idx } };
            arr.push(db.getModel(modelName.account).makeQuery(type.QueryMethods.delete, null, condition));
            arr.push(db.getModel(modelName.user).makeQuery(type.QueryMethods.delete, null, condition));
            await db.execTransaction(arr);
        } catch (err) {
            throw err;
        }
    }

    /**
     * --------------------------------------------------------------
     * ----------------------- [ CALLBACKS ] ------------------------
     * --------------------------------------------------------------
     */
    /**
     * @async
     * @function localStrategyCallback
     * @description Callback used for local strategy (passport local)
     *
     * @param {string} email User email st ring
     * @param {string} password User password string
     * @param {function} done
     */
    async localStrategyCallback(email, password, done) {
        try {
            const q = db.getModel(modelName.account).makeQuery(type.QueryMethods.findOne, null, { where: { email } });
            const account = await db.execQuery(q);

            // Check whether the account exist in the database or not.
            if (!account) {
                done(null, false, { message: 'This account does not exist.' });
            }
            // Check wheter the password is valid or not.
            else if (!(await encryption.compareHash(password, account.salt, account.password))) {
                done(null, false, { message: `The password doesn't match.` });
            }
            // success to authenticate the account.
            else {
                const u = await db.getModel(modelName.user).findOne({ where: { idx: account.idx } });
                if (u) {
                    const user = {};
                    user.idx = account.idx;
                    user.email = account.email;
                    user.name = u.name;
                    user.studentID = u.studentID;
                    user.major = u.major;
                    user.accessLevel = u.accessLevel;
                    done(null, user);
                } else {
                    done(null, false, { message: `Fail to load the user information` });
                }
            }

            // Check wheter the password is valid or not.
        } catch (err) {
            logger.error(err);
            done(err);
        }
    }

    /**
     * @async
     * @function kakaoStrategyCallback
     * @description Callback used for kakao strategy (passport kakao)
     *
     * @param {string} accessToken
     * @param {string} refreshToken
     * @param {object} profile Kakao profile object
     * @param {function} done
     */
    async kakaoStrategyCallback(accessToken, refreshToken, profile, done) {
        try {
            const q = db.getModel(modelName.account).makeQuery(type.QueryMethods.findOne, null, { where: { email } });
            const account = await db.execQuery(q);

            if (!account) {
                // Query array
                const arr = [];

                // Make new account object
                const newAccount = type.cloneAccountObject();
                newAccount.email = profile._json.kakao_account.email;
                newAccount.password = newAccount.salt = -1;

                // Make new user object
                const newUser = type.cloneUserObject();
                newUser.name = profile.displayName;

                // Make new queries
                arr.push(db.getModel(modelName.account).makeQuery(type.QueryMethods.create, newAccount));
                arr.push(db.getModel(modelName.user).makeQuery(type.QueryMethods.create, newUser));

                // Execute transaction
                await db.execTransaction(arr);
            }

            done(null, account);
        } catch (err) {
            logger.error(err);
            done(err);
        }
    }
}

/* Export instance of AuthManager as module */
module.exports = new AuthManager();
