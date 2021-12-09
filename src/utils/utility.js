/**
 * utility.js
 * Last modified: 2021.12.06
 * Author: Lee Hong Jun (Onggae22, hong3883@naver.com)
 * Description: utility.js has many utility functions.
 */

/* Modules */
const { Request, Response, NextFunction } = require('express');
const cloneDeep = require('clone-deep');
const rp = require('request-promise');

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
     * @getter loadLogger
     * @description lazy loadder (prevant circular access)
     */
    get loadLogger() {
        if (!this._logger) {
            this._logger = require('@src/utils/logger');
        }

        return this._logger;
    }

    /**
     * @getter loadType
     * @description lazy loadder (prevant circular access)
     */
    get loadType() {
        if (!this._type) {
            this._type = require('@src/utils/type');
        }

        return this._type;
    }

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
            this.loadLogger.error(err);
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
            this.loadLogger.error(err);
            return false;
        }
    }

    /**
     * @function isObject
     * @description Check the value is object
     *
     * @param {object} obj Input object value.
     * @returns {boolean} If the argument is valid object, return true. Else, return false.
     */
    isObject(obj) {
        return typeof obj === 'object' && obj !== null;
    }

    /**
     * @function merge
     * @description merge source object to destination object.
     *
     * @param {object} src source object.
     * @param {object} dest destination object.
     * @returns {boolean} Result of merge
     * @example
     * const obj1 = { a: 1, b: 2};
     * const obj2 = { a: 6, b: 8, c: 5, d: 3};
     * merge(obj1, obj2) -> {a: 1, b: 2, c: 5, d: 3}
     */
    merge(src, dest) {
        if (!this.isObject(src) && !this.isObject(dest)) {
            return;
        }

        if (src === null || dest === null) {
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
     * @param {object} baseObj Base object.
     * @param {object} initDataObj Init data object.
     * @returns {object} Cloned object.
     * @example
     * const baseObject = { a: null, b: null, c: null };
     * const initDataObj = { a: 10, b: 'hi' };
     * clone(baseObject, initDataObj) -> { a: 10, b: 'hi', c: null }
     */
    clone(baseObj, initDataObj = null) {
        let cloneObj = cloneDeep(baseObj);

        if (initDataObj !== null) {
            this.merge(initDataObj, cloneObj);
        }
        return cloneObj;
    }

    /**
     * @function requestHTTP
     * @description Send http request to another host
     *
     * @param {string} uri Uri to send the response.
     * @returns {Promise<Response>} Response from another host
     */
    async requestHTTP(uri) {
        let rtn = null;
        try {
            const response = await rp({
                uri: uri,
                method: 'POST',
            });

            rtn = response;
        } catch (err) {
            this.loadLogger.error(err);
        } finally {
            return rtn;
        }
    }

    /**
     * @function routerSend
     * @description Response to client
     *
     * @param {Response} res Express response object (to client)
     * @param {number} statusCode Http status code ex) 200: OK, 304: Not Modified, 404: Not Found ..
     * @param {object} data Data for sending to client
     * @param {boolean} error If true, send error object
     */
    routerSend(res, statusCode = this.loadType.HttpStatus.OK, data = null, error = false) {
        let rtn = null;

        if (data) {
            if (error) {
                rtn = { error: data };
                this.loadLogger.error(data);
            } else {
                rtn = { data };
                this.loadLogger.info(data);
            }

            // send status code & data
            res.status(statusCode).send(rtn);
        } else {
            // send only status code
            res.sendStatus(statusCode);
        }
    }

    /**
     * @function converToTimestamp
     * @description Convert time string to sec or milisec
     *
     * @param {string} timestring Input time string
     * @param {boolean} milisec If true, timestring will be converted to milisec (default: false, convert to sec)
     * @returns {boolean} If obj is valid JSON object, return true. Else, return false.
     */
    convertToTimestamp(timestring, milisec = false) {
        return milisec ? new Date(timestring).getTime() : Math.floor(new Date(timestring).getTime() * 0.001);
    }
}

/* Export the class as module */
module.exports = new Utility();
