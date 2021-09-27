/**
 * entryption.js
 * Last modified: 2021.09.27
 * Author: Lee Hong Jun
 * Description: entryption.js can be used to encrypt user's password or auth code.. etc
 */


/* Modules */
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const util = require('util');


/* Constants */
const BASE64_LENGTH = 64;
const HEX_LENGTH = 128;


/**
 * @class Entryption
 * @description You can create instances of that class and encrypt data one-way or two-way.
 */
class Entryption {

    /**
     * @function constructor
    */
    constructor() {
        this.cipherAlgorithm = 'aes-256-cbc';
        this.cipherKey = 'abcdefghijklmnopqrstuvwxyz123456';
        this.cipherIV = '1234567890123456';
    }


    /**
     * @async @function createSalt
     * @description Create random salt string. (length: 64)
     * 
     * @return {promise} Promise of salt string
     * @example 
     * In async function, 
     * const salt = await createhSalt(); 
     * ...
    */
    async createSalt() {
        try {
            const salt = await util.promisify(crypto.randomBytes)(64);
            return salt.toString('base64');
        }
        catch(error) {
            console.error(error);
        }
    }


    /**
     * @async @function createHash
     * @description Encrypt the string using hash algorithm. (pbkdf2)
     * 
     * @param {string} str String to encrypt.
     * @return {promise} Promise of hash string
     * @example
     * In async function,
     * const salt = await createSalt();
     * const hash = await createHash('string to encrypt', salt);
     * ...
    */
    async createHash(str, salt) {

        try {
            const hash = util.promisify(crypto.pbkdf2)(str, salt, 100000, BASE64_LENGTH, 'sha512');
            return (await hash).toString('base64');
            
        }
        catch(error) {
            console.error(error);
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
     * const salt = await createSalt();
     * const hash = await createHash('string to encrypt', salt);
     * ...
    */
    async createBcrypt(str) {
        const hash = await bcrypt.hash(str, 12);
        return hash;
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


