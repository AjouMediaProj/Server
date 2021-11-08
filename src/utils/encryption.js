/**
 * entryption.js
 * Last modified: 2021.11.08
 * Author: Lee Hong Jun
 * Description: entryption.js can be used to encrypt user's password or auth code.. etc
 */

/* Crypto Modules */
const crypto = require('crypto');
const bcrypt = require('bcrypt');

/* Utils */
const util = require('util');
const logger = require('@src/utils/logger');

/**
 * @class Entryption
 * @description You can create instances of that class and encrypt data one-way or two-way.
 */
class Entryption {
    /**
     * @function constructor
     */
    constructor() {
        this.cipherAlgorithm = process.env.CIPHER_ALGORITHM;
        this.cipherKey = process.env.CIPHER_KEY;
        this.cipherIV = process.env.CIPHER_IV;
    }

    /**
     * @async @function createSalt
     * @description Create random salt string.
     *
     * @param {number} size Size of random bytes.
     * @returns {promise<string>} Promise of salt string. (ex. arg size: 16, -> return salt string size: 32 (x2))
     * @example
     * In async function,
     * ...
     * const salt = await encryption.createhSalt();
     * ...
     */
    async createSalt(size = 16) {
        let salt = null;

        try {
            salt = await util.promisify(crypto.randomBytes)(size);
            salt = salt.toString('hex');
        } catch (err) {
            logger.error(err);
        } finally {
            return salt;
        }
    }

    /**
     * @async @function createHash
     * @description Encrypt the string using hash algorithm.
     *
     * @param {string} str String to encrypt.
     * @param {string} salt String to be used as salt.
     * @returns {promise<string>} Promise of hash string.
     * @example
     * In async function,
     * ...
     * const salt = await encryption.createSalt();
     * const hash = await encryption.createHash('string to encrypt', salt);
     * ...
     */
    async createHash(str, salt) {
        let hash = null;

        try {
            hash = await util.promisify(crypto.pbkdf2)(str, salt, 100000, salt.length, 'sha512');
            hash = hash.toString('hex');
        } catch (err) {
            logger.error(err);
        } finally {
            return hash;
        }
    }

    /**
     * @async @function compareHash
     * @description Compare plain string and hash string using salt.
     *
     * @param {string} str Normal string.
     * @param {string} salt Salt string.
     * @param {string} hashStr Hash string.
     * @returns {promise<boolean>} Promise result of comparison (boolean).
     * @example
     * In async function,
     * ...
     * const password = req.body.pw;
     * const salt = userInDB.salt;
     * const hashPW = userInDB.password;
     * const result = await encryption.compareHash(password, salt, hashPW);
     * ...
     */
    async compareHash(str, salt, hashStr) {
        let result = false;

        try {
            const hash = await this.createHash(str, salt);
            result = hash === hashStr;
        } catch (err) {
            logger.error(err);
        } finally {
            return result;
        }
    }

    /**
     * @async @function createBcryptSalt
     * @description Create random salt string (Bcrypt).
     *
     * @param {number} saltRounds The cost of process the data.
     * @returns {promise<string>} Promise of salt string.
     * @example
     * In async function,
     * ...
     * const bSalt = await encryption.createBcryptSalt(12);
     * ...
     */
    async createBcryptSalt(saltRounds = 10) {
        let salt = null;

        try {
            salt = await bcrypt.genSalt(saltRounds);
        } catch (err) {
            logger.error(err);
        } finally {
            return salt;
        }
    }

    /**
     * @async @function createBcrypt
     * @description Encrypt the string using hash algorithm. (bcrypt)
     *
     * @param {string} str String to encrypt.
     * @param {string} salt Bcrypt salt string. (Don't use createSalt() result to this parameter.)
     * @returns {promise<string>} Promise of hash string (Length: 60)
     * @example
     * In async function,
     * ...
     * const salt = await encryption.createBcryptSalt(12);
     * const hash = await encryption.createBcrypt('String to encrypt', salt);
     * ...
     */
    async createBcrypt(str, salt) {
        let hash = null;

        try {
            hash = await bcrypt.hash(str, salt);
            hash = hash.toString('hex');
        } catch (err) {
            logger.error(err);
        } finally {
            return hash;
        }
    }

    /**
     * @async @function compareBcrypt
     * @description Compare plain string and hash string using salt. (bcrypt)
     *
     * @param {string} str Plain string.
     * @param {string} hashStr Bcrypt hash string.
     * @returns {Promise<boolean>} Promise result of comparison (boolean).
     * @example
     * In async function,
     * ...
     * const password = req.body.pw;
     * const hashPW = userInDB.password;
     * const result = await encryption.compareBcrypt(password, hashPW);
     * ...
     */
    async compareBcrypt(str, hashStr) {
        let result = false;

        try {
            result = await bcrypt.compare(str, hashStr);
        } catch (err) {
            logger.error(err);
        } finally {
            return result;
        }
    }

    /**
     * @function createCipher
     * @description Encrypt the string.
     *
     * @param {string} str String to encrypt.
     * @returns {string} Cipher string.
     */
    createCipher(str) {
        const cipher = crypto.createCipheriv(this.cipherAlgorithm, this.cipherKey, this.cipherIV);
        let result = cipher.update(str, 'utf8', 'hex');
        result += cipher.final('hex');

        return result;
    }

    /**
     * @function createDecipher
     * @description Decodes the string.
     *
     * @param {string} str String to be decrypted.
     * @result {string} Plain string.
     */
    createDecipher(str) {
        const decipher = crypto.createDecipheriv(this.cipherAlgorithm, this.cipherKey, this.cipherIV);
        let result = decipher.update(str, 'hex', 'utf8');
        result += decipher.final('utf8');

        return result;
    }
}

/* Export the class as module */
module.exports = new Entryption();
