/**
 * type.js
 * Last modified: 2021.11.23
 * Author: Lee Hong Jun (arcane22, hong3883@naver.com)
 * Description: Define the types of various basic objects.
 */

/* Modules */
const utility = require('@src/utils/utility');

/*** <--- Type Definition --- > ***/

/**
 *
 * [ Constants ]
 *
 */
/**
 *
 * @typedef {object} QueryType
 * @property {number} create 0, INSERT INTO
 * @property {number} findOne 1, SELECT FROM
 * @property {number} findAll 2, SELECT FROM
 * @property {number} update 3, UPDATE SET
 * @property {number} delete 4, DELETE FROM
 */
const QueryType = {
    create: 0,
    findOne: 1,
    findAll: 2,
    update: 3,
    delete: 4,
};

/**
 *
 * [ Objects ]
 *
 */
/**
 * @typedef {object} QueryObject
 * @property {string} modelName Specific model name
 * @property {number} type query type
 * @property {object} conditions query conditions
 * @property {object} data query data
 */

/**
 * @typedef {object} AccountObject
 * @property {number} idx Account index
 * @property {string} email Account email
 * @property {string} password Account password
 * @property {string} salt Account salt
 */

/**
 * @typedef {object} UserObject
 * @property {number} idx User index
 * @property {string} name User name
 * @property {string} nickname User nickname
 * @property {string} major User major
 * @property {string} accessLevel User accessLevel
 */

/**
 *  @typedef {object} AuthMailObject
 * @property {string} email User authentication email
 * @property {string} authCode User authentication code
 * @property {string} expirationDate Authentication email expiration date
 */

const Objects = {
    Query: {
        modelName: '',
        type: 0,
        conditions: {},
        data: {},
    },
    Account: {
        idx: null,
        email: null,
        password: null,
        salt: null,
    },
    User: {
        idx: null,
        name: null,
        nickname: null,
        major: null,
        accessLevel: null,
    },
    AuthMail: {
        email: '',
        authCode: '',
        expirationDate: '',
    },
};

/**
 * @class Type
 * @description
 */
class Type {
    /*** Static Properties  ***/

    /**
     * @getter Get query type.
     * @returns {QueryType}
     */
    static get queryType() {
        return QueryType;
    }

    /**
     * @function makeObject
     * @description Clone new object.
     *
     * @param {string} name Object name (QueryObject -> 'Query', AccountObject -> 'Account')
     * @returns {object} new object
     */
    static makeObject(name) {
        const obj = Objects[name];

        if (obj === undefined) return null;
        else return utility.clone(obj);
    }

    /*** Static Methods ***/

    /**
     * @static @function compareType
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
    static compareType(obj1, obj2) {
        console.log(obj1);
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
     * @static @function equals
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
    static equals(obj1, obj2) {
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
}

/* Export class as module */
module.exports = Type;
