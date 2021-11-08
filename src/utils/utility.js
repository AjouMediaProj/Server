/**
 * utility.js
 * Last modified: 2021.10.18
 * Author: Lee Hong Jun (Onggae22, hong3883@naver.com)
 * Description: utility.js has many utility functions.
 */

/* Modules */
const cloneDeep = require('clone-deep');
const rp = require('request-promise');
const logger = require('@src/utils/logger');

/**
 * @class Utility
 * @description
 */
class Utility {
    /**
     * @function constructor
     * @description constructor of Utility class
     */
    constructor() {}

    /**
     * @function createRandomNum
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
     * @function createRandomCode
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

    /**
     * @function isJsonString
     * @description Check the string is valid JSON format string.
     *
     * @param {string} str Input string.
     * @returns {boolean} If str is valid JSON format, return true. Else, return false.
     */
    isJsonString(str) {
        if (typeof str !== 'string') return false;

        try {
            const jsonObj = JSON.parse(str);
            if (typeof jsonObj === 'object' && jsonObj !== null) return true;
            else return false;
        } catch (err) {
            logger.error(err);
            return false;
        }
    }

    /**
     * @function isJsonObj
     * @description Check the object is valid JSON object.
     *
     * @param {object} obj Input object.
     * @returns {boolean} If obj is valid JSON object, return true. Else, return false.
     */
    isJsonObj(obj) {
        if (typeof obj !== 'object') return false;

        try {
            const str = JSON.stringify(obj);
            const jsonObj = JSON.parse(str);

            if (typeof jsonObj === 'object' && jsonObj !== null) return true;
            else return false;
        } catch (err) {
            logger.error(err);
            return false;
        }
    }

    isObject(obj) {
        return typeof obj === 'object' && obj !== null;
    }

    /**
     * @function compareType
     * @description Compare the types of two objects.
     *              If the two objects have the same property, return true.
     *
     * @param obj1 object 1.
     * @param obj2 object 2.
     * @returns {boolean}
     * @example
     * const obj1 = { a: 1, b: 2, c: { d: 5, e: 7 } };
     * const obj2 = { a: 1, b: null, c: { d: 'abcd', e: 7 } };
     * const obj3 = { a: 1, b: 3, c: 5 }
     *
     * compareType(obj1, obj2) -> true
     * compareType(obj1, obj3) -> false
     */
    compareType(obj1, obj2) {
        if (Object.keys(obj1).length !== Object.keys(obj2).length) {
            return false;
        }

        for (let key in obj1) {
            if (obj2.hasOwnProperty(key)) {
                let isObjCnt = 0;
                isObjCnt += this.isObject(obj1[key]) ? 1 : 0;
                isObjCnt += this.isObject(obj1[key]) ? 1 : 0;

                if (isObjCnt == 1) {
                    return false;
                }

                if (isObjCnt == 2) {
                    if (!this.compareType(obj1[key], obj2[key])) {
                        return false;
                    }
                }
            } else {
                return false;
            }
        }

        return true;
    }

    /**
     * @function equals
     * @description Both objects have the same property, and if the values are the same, return true.
     *
     * @param obj1 object 1.
     * @param obj2 object 2.
     * @returns {boolean}
     * @example
     * const obj1 = { a: 1, b: 2, c: 5};
     * const obj2 = { a: 1, b: 2, c: 5};
     * const obj3 = { a: 1, c: 5};
     * equals(obj1, obj2) -> true
     * equals(obj1, obj3) -> false
     */
    equals(obj1, obj2) {
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);

        if (keys1.length !== keys2.length) {
            return false;
        }

        for (let key of keys1) {
            const val1 = obj1[key];
            const val2 = obj2[key];
            const areBothObj = this.isObject(val1) && this.isObject(val2);

            if (areBothObj) {
                if (!this.equals(val1, val2)) {
                    return false;
                }
            } else {
                if (val1 !== val2) {
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * @function merge
     * @description merge source object to destination object.
     *
     * @param {object} src source object.
     * @param {object} dest destination object.
     * @returns {boolean}
     * @example
     * const obj1 = { a: 1, b: 2};
     * const obj2 = { a: 6, b: 8, c: 5, d: 3};
     * merge(obj1, obj2) -> {a: 1, b: 2, c: 5, d: 3}
     */
    merge(src, dest) {
        if (!this.isObject(src) && !this.isObject(dest)) {
            return false;
        }
        for (let key in src) {
            if (dest.hasOwnProperty(key)) {
                dest[key] = src[key];
            }
        }

        return true;
    }

    /**
     * @function clone
     * @description clone the base object and initialize based on the initDataObj.
     *
     * @param baseObj Base object.
     * @param initDataObj Init data object.
     * @returns {object} Clone object.
     * @example
     * const baseObject = { a: null, b: null, c: null };
     * const initDataObj = { a: 10, b: 'hi' };
     * clone(baseObject, initDataObj) -> { a: 10, b: 'hi', c: null }
     */
    clone(baseObj, initDataObj) {
        let cloneObj = cloneDeep(baseObj);

        if (initDataObj !== null) {
            this.merge(initDataObj, cloneObj);
        }
        return cloneObj;
    }

    async requestHTTP(uri) {
        let rtn = null;
        try {
            const response = await rp({
                uri: uri,
                method: 'POST',
            });

            rtn = response;
        } catch (err) {
            logger.error(err);
        } finally {
            return rtn;
        }
    }
}

/* Export the class as module */
module.exports = new Utility();
