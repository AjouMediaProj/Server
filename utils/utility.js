/**
 * utils.js
 * Last modified: 2021.09.23
 * Author: Lee Hong Jun (Onggae22, hong3883@naver.com)
 * Description: utils.js has many utility functions.
 */

/* Modules */

/**
 * @class Utility
 * @description
 */
class Utility {
    /**
     * @function constructor
     * @description constructor of PromiseManager class
     */
    constructor() {}

    /**
     * @static @function createRandomNum
     * @description create random interger value (range min ~ max).
     *
     * @param {number} min Minimum value of range.
     * @param {number} max Maximum value of range.
     * @returns {number} Return a random value within the range.
     */
    createRandomNum(min, max) {
        if (typeof min === 'number' && typeof max === 'number') {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        } else {
            throw new Error('Arguments must be the number');
        }
    }

    /**
     * @static @function createRandomCode
     * @description create random code ex) 50372, 1230583 .. (can be used as authentication code)
     *
     * @param {number} len The length of the code.
     * @returns {string} Return the code as string.
     */
    createRandomCode(len) {
        if (typeof len === 'number') {
            let code = '';
            for (let i = 0; i < len; i++) {
                code += this.createRandomNum(0, 9);
            }
            return code;
        } else {
            throw new Error('Arguments must be the number');
        }
    }
}

/* Export the class as module */
module.exports = new Utility();
