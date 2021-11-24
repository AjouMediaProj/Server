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
 * ----------------------------------------------------
 *
 * @typedef {object} QueryType
 * @property {number} create 0, INSERT INTO
 * @property {number} findOne 1, SELECT FROM
 * @property {number} findAll 2, SELECT FROM
 * @property {number} update 3, UPDATE SET
 * @property {number} delete 4, DELETE FROM
 *
 * ----------------------------------------------------
 *
 * @typedef {object} CandidateStatus
 * @property {number} default 0
 * @property {number} deleted 1
 *
 * ----------------------------------------------------
 *
 * @typedef {object} VoteStatus
 * @property {number} default 0
 * @property {number} deleted 1
 *
 * ----------------------------------------------------
 *
 * @typedef {object} VoteRecordStatus
 * @property {number} default 0
 * @property {number} verified 1
 *
 * ----------------------------------------------------
 */
const QueryType = {
    create: 0,
    findOne: 1,
    findAll: 2,
    update: 3,
    delete: 4,
};

const CandidateStatus = {
    default: 0,
    deleted: 1,
};

const VoteStatus = {
    default: 0,
    deleted: 1,
};

const VoteRecordStatus = {
    default: 0,
    verified: 1,
};

/**
 *
 * [ Objects ]
 *
 * ----------------------------------------------------
 *
 * @typedef {object} QueryObject
 * @property {string} modelName Specific model name
 * @property {number} type query type (based on Type.QueryType)
 * @property {object} conditions query conditions
 * @property {object} data query data
 *
 * ----------------------------------------------------
 *
 * @typedef {object} AccountObject
 * @property {number} idx Account index
 * @property {string} email Account email
 * @property {string} password Account password
 * @property {string} salt Account salt
 * ----------------------------------------------------
 *
 * @typedef {object} UserObject
 * @property {number} idx User index
 * @property {string} name User name
 * @property {string} nickname User nickname
 * @property {string} major User major
 * @property {string} accessLevel User accessLeve
 *
 * ----------------------------------------------------
 *
 * @typedef {object} AuthMailObject
 * @property {string} email User authentication email
 * @property {string} authCode User authentication code
 * @property {string} expirationDate Authentication email expiration date
 *
 * ----------------------------------------------------
 *
 * @typedef {object} CandidateObject
 * @property {number} idx
 * @property {number} voteIdx
 * @property {string} name
 * @property {string} photo
 * @property {string} img
 * @property {number} count
 * @property {number} status Candidate status (based on Type.CandidateStatus)
 *
 * ----------------------------------------------------
 *
 * @typedef {object} VoteObject
 * @property {number} idx Vote index from contract.
 * @property {number} category Category type. Defined in file.
 * @property {string} name Vote name
 * @property {number} totalCount Total count of vote
 * @property {string} startTime Vote startTime
 * @property {string} endTime Vote endTime
 * @property {number} status Vote status (based on Type.VoteStatus)
 *
 * ----------------------------------------------------
 *
 * @typedef {object} VoteRecordObject
 * @property {number} voteIdx Vote index
 * @property {number} userIdx User index
 * @property {number} status Vote record status (based on Type.VoteRecordStatus)
 *
 * ----------------------------------------------------
 */

const Objects = {
    // Object for database
    Query: {
        modelName: '',
        type: 0,
        conditions: {},
        data: {},
    },

    // Objects for user
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

    //Objects for vote
    Candidate: {
        idx: 0,
        voteIdx: 0,
        name: '',
        photo: '',
        img: '',
        count: 0,
        status: 0,
    },

    Vote: {
        idx: 0,
        category: 0,
        name: '',
        totalCount: 0,
        startTime: '',
        endTime: '',
        status: 0,
    },

    VoteRecord: {
        voteIdx: 0,
        userIdx: 0,
        status: 0,
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
    static get QueryType() {
        return QueryType;
    }

    /**
     * @getter Get candidate status.
     * @returns {CandidateStatus}
     */
    static get CandidateStatus() {
        return CandidateStatus;
    }

    /**
     * @getter Get candidate status.
     * @returns {VoteStatus}
     */
    static get VoteStatus() {
        return VoteStatus;
    }

    /**
     * @getter Get candidate status.
     * @returns {VoteRecordStatus}
     */
    static get VoteRecordStatus() {
        return VoteRecordStatus;
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
