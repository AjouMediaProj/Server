/**
 * entryption.js
 * Last modified: 2021.10.11
 * Author: Lee Hong Jun
 * Description: entryption.js can be used to encrypt user's password or auth code.. etc
 */

/* Crypto Modules */
const crypto = require('crypto');
const bcrypt = require('bcrypt');

/* Utils */
const util = require('util');
const logger = require('./logger');

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
     * @return {promise} Promise of salt string. (ex. arg size: 32, -> return salt string size: 64 (x2))
     * @example
     * In async function,
     * ...
     * const salt = await createhSalt();
     * ...
     */
    async createSalt(size) {
        try {
            const salt = await util.promisify(crypto.randomBytes)(size);
            return salt.toString('hex');
        } catch (err) {
            logger.error(err);
            return '';
        }
    }

    /**
     * @async @function createHash
     * @description Encrypt the string using hash algorithm.
     *
     * @param {string} str String to encrypt.
     * @param {string} salt String to be used as salt.
     * @return {promise} Promise of hash string
     * @example
     * In async function,
     * ...
     * const salt = await createSalt();
     * const hash = await createHash('string to encrypt', salt);
     * ...
     */
    async createHash(str, salt) {
        try {
            const hash = await util.promisify(crypto.pbkdf2)(str, salt, 100000, salt.length, 'sha512');
            return hash.toString('hex');
        } catch (err) {
            logger.error(err);
            return '';
        }
    }

    /**
     * @async @function compareHash
     * @description Compare string and hash string using salt.
     *
     * @param {string} str Normal string.
     * @param {string} salt Salt string.
     * @param {string} hashStr Hash string.
     * @return {promise} Promise of hash string
     * @example
     * In async function,
     * ...
     * const salt = await createSalt();
     * const hash = await createHash('string to encrypt', salt);
     * ...
     */
    async compareHash(str, salt, hashStr) {
        try {
            const hash = await this.createHash(str, salt);
            return hash === hashStr;
        } catch (err) {
            logger.error(err);
            return false;
        }
    }

    /**
     * @async @function createBcrypt
     * @description Encrypt the string using hash algorithm. (bcrypt)
     *
     * @param {string} str String to encrypt.
     * @return {promise} Promise of hash string
     * @example
     * In async function,
     * ...
     * const hash = await createBcrypt('abcd');
     * ...
     */
    async createBcrypt(str) {
        try {
            const hash = await bcrypt.hash(str, 12);
            return hash;
        } catch (err) {
            logger.error(err);
        }
    }

    /**
     * @async @function compareBcrypt
     * @description Encrypt the string using hash algorithm. (bcrypt)
     *
     * @param {string} str1 String to encrypt.
     * @return {boolean} Promise of hash string
     * @example
     * In async function,
     * const salt = await createSalt();
     * const hash = await createHash('string to encrypt', salt);
     * ...
     */
    async compareBcrypt(str, hashStr) {
        try {
            const result = await bcrypt.compare(str, hashStr);
            return result;
        } catch (err) {
            logger.error(err);
            return false;
        }
    }

    /**
     * @function createCipher
     * @description Encrypt the string.
     *
     * @param {string} str String to encrypt.
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
