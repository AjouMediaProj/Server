/**
 * type.js
 * Last modified: 2021.11.29
 * Author: Lee Hong Jun (arcane22, hong3883@naver.com)
 * Description: Define the types of various basic objects.
 */

/* Modules */
const utility = require('@src/utils/utility');

/**
 *
 * ----------------- [ Constants ] ---------------------
 */

/**
 * ----------------------------------------------------
 * @typedef {object} HttpStatus
    // 2XX: Successful
    @property {number} OK: 200,
    @property {number} Created: 201,
    @property {number} Accepted: 202,
    @property {number} NonAuthoritativeInformation: 203,
    @property {number} NoContent: 204,

    // 3XX: Redirection
    @property {number} MovedPermanently: 301,
    @property {number} Found: 302,
    @property {number} SeeOther: 303,
    @property {number} NotModified: 304,
    @property {number} UseProxy: 305,
    @property {number} Unused: 306,
    @property {number} TemporaryRedirect: 307,

    // 4XX: Client Error
    @property {number} BadRequest: 400,
    @property {number} Unauthorized: 401,
    @property {number} PaymentRequired: 402,
    @property {number} Forbidden: 403,
    @property {number} NotFound: 404,
    @property {number} MethodNotAllowed: 405,
    @property {number} NotAcceptable: 406,
    @property {number} ProxyAuthenticationRequired: 407,
    @property {number} RequestTimeout: 408,
    @property {number} Conflict: 409,

    // 5XX: Server Error
    @property {number} InternalServerError: 500,
    @property {number} NotImplemented: 501,
 * ----------------------------------------------------
 */
const HttpStatus = Object.freeze({
    // 2XX: Successful
    OK: 200,
    Created: 201,
    Accepted: 202,
    NonAuthoritativeInformation: 203,
    NoContent: 204,

    // 3XX: Redirection
    MovedPermanently: 301,
    Found: 302,
    SeeOther: 303,
    NotModified: 304,
    UseProxy: 305,
    Unused: 306,
    TemporaryRedirect: 307,

    // 4XX: Client Error
    BadRequest: 400,
    Unauthorized: 401,
    PaymentRequired: 402,
    Forbidden: 403,
    NotFound: 404,
    MethodNotAllowed: 405,
    NotAcceptable: 406,
    ProxyAuthenticationRequired: 407,
    RequestTimeout: 408,
    Conflict: 409,

    // 5XX: Server Error
    InternalServerError: 500,
    NotImplemented: 501,
});

const Category = Object.freeze({
    1: '총학생회',
    101: '정보통신대학',
    10101: '미디어학과',
    10102: '전자공학과',
    10103: '소프트웨어학과',
    10104: '국방디지털융합학과',
    10105: '사이버보안학과',
    10106: '인공지능융합학과',
    102: '공과대학',
    10201: '기계공학과',
    10202: '환경안전공학과',
    10203: '산업공학과',
    10204: '건설시스템공학과',
    10205: '화학공학과',
    10206: '교통시스템공학과',
    10207: '신소재공학과',
    10208: '건축학과',
    10209: '응용화학생명공학과',
    10210: '융합시스템공학과',
    103: '자연과학대학',
    10301: '수학과',
    10302: '화학과',
    10303: '물리학과',
    10304: '생명과학과',
    104: '경영대학',
    10401: '경영학과',
    10402: '금융공학과',
    10403: 'e-비즈니스학과',
    10404: '글로벌경영학과',
    105: '인문대학',
    10501: '국어국문학과',
    10502: '사학과',
    10503: '영어영문학과',
    10504: '문화콘텐츠학과',
    10505: '불어불문학과',
    106: '사회과학대학',
    10601: '경제학과',
    10602: '사회학과',
    10603: '행정학과',
    10604: '정치외교학과',
    10605: '심리학과',
    10606: '스포츠레저학과',
    10701: '의학과',
    10801: '간호학과',
    10901: '약학과',
});

const CategoryCount = Object.freeze({
    1: 9200,
    101: 2800,
    10101: 400,
    10102: 1000,
    10103: 800,
    10104: 200,
    10105: 200,
    10106: 200,
    102: 2000,
    10201: 200,
    10202: 200,
    10203: 200,
    10204: 200,
    10205: 200,
    10206: 200,
    10207: 200,
    10208: 200,
    10209: 200,
    10210: 200,
    103: 800,
    10301: 200,
    10302: 200,
    10303: 200,
    10304: 200,
    104: 800,
    10401: 200,
    10402: 200,
    10403: 200,
    10404: 200,
    105: 1000,
    10501: 200,
    10502: 200,
    10503: 200,
    10504: 200,
    10505: 200,
    106: 1200,
    10601: 200,
    10602: 200,
    10603: 200,
    10604: 200,
    10605: 200,
    10606: 200,
    10701: 200,
    10801: 200,
    10901: 200,
});

/**
 * ----------------------------------------------------
 * @typedef {object} QueryMethods
 * @property {number} create 0
 * @property {number} findOne 1
 * @property {number} findAll 2
 * @property {number} update 3
 * @property {number} delete 4
 * ----------------------------------------------------
 */
const QueryMethods = Object.freeze({
    create: 0,
    findOne: 1,
    findAll: 2,
    update: 3,
    delete: 4,
});

/**
 * ----------------------------------------------------
 * @typedef {object} CandidateStatus
 * @property {number} default 0
 * @property {number} deleted 1
 * ----------------------------------------------------
 */
const CandidateStatus = Object.freeze({
    default: 0,
    deleted: 1,
});

/**
 * ----------------------------------------------------
 * @typedef {object} VoteStatus
 * @property {number} default 0
 * @property {number} deleted 1
 * ----------------------------------------------------
 */
const VoteStatus = Object.freeze({
    default: 0,
    deleted: 1,
});

/**
 * ----------------------------------------------------
 * @typedef {object} VoteRecordStatus
 * @property {number} default 0
 * @property {number} verified 1
 * ----------------------------------------------------
 */
const VoteRecordStatus = Object.freeze({
    default: 0,
    verified: 1,
});

/**
 *
 * ----------------- [ Objects ] ---------------------
 */

/**
 * ----------------------------------------------------
 * @typedef {object} QueryObject
 * @property {string} model Specific model name
 * @property {number} method Specific query method (type.QueryMethods)
 * @property {object} conditions Query conditions
 * @property {object} data Query data
 * ----------------------------------------------------
 */
const QueryObject = Object.freeze({
    model: '',
    method: 0,
    data: null,
    conditions: {},
});

/**
 * ----------------------------------------------------
 * @typedef {object} AccountObject
 * @property {number} idx Account index
 * @property {string} email Account email
 * @property {string} password Account password
 * @property {string} salt Account salt
 * ----------------------------------------------------
 */
const AccountObject = Object.freeze({
    idx: 0,
    email: '',
    password: '',
    salt: '',
});

/**
 * ----------------------------------------------------
 * @typedef {object} UserObject
 * @property {number} idx User index
 * @property {string} name User name
 * @property {number} studentID User student id
 * @property {number} major User major
 * @property {number} accessLevel User accessLevel
 * ----------------------------------------------------
 */

const UserObject = Object.freeze({
    idx: 0,
    name: '',
    studentID: 0,
    major: 0,
    accessLevel: 0,
});

/**
 * ----------------------------------------------------
 * @typedef {object} AuthMailObject
 * @property {string} email User authentication email
 * @property {string} authCode User authentication code
 * @property {string} expirationDate Authentication email expiration date
 * ----------------------------------------------------
 */
const AuthMailObject = Object.freeze({
    email: '',
    authCode: '',
    expirationDate: '',
});

/**
 * ----------------------------------------------------
 * @typedef {object} CandidateObject
 * @property {number} idx Candidate index
 * @property {number} voteIdx Vote index
 * @property {string} name Candidate name
 * @property {string} photo Candidate's profile photo
 * @property {string} img Candidate's election promise (image)
 * @property {string} txt Candidate's election promise (string)
 * @property {number} count Candidate's the number of votes.
 * @property {number} status Candidate status (based on Type.CandidateStatus)
 * ----------------------------------------------------
 */
const CandidateObject = Object.freeze({
    idx: 0,
    voteIdx: 0,
    name: '',
    photo: '',
    img: '',
    txt: '',
    count: 0,
    status: CandidateStatus.default,
});

/**
 * ----------------------------------------------------
 * @typedef {object} VoteObject
 * @property {number} idx Vote index from contract.
 * @property {number} category Category type. Defined in file.
 * @property {string} name Vote name
 * @property {number} totalCount Total count of vote
 * @property {string} startTime Vote startTime
 * @property {string} endTime Vote endTime
 * @property {number} status Vote status (based on Type.VoteStatus)
 * ----------------------------------------------------
 */
const VoteObject = Object.freeze({
    idx: 0,
    category: 0,
    name: '',
    totalCount: 0,
    startTime: '',
    endTime: '',
    status: VoteStatus.default,
});

/**
 * ----------------------------------------------------
 * @typedef {object} VoteRecordObject
 * @property {number} voteIdx Vote index
 * @property {number} userIdx User index
 * @property {number} status Vote record status (based on Type.VoteRecordStatus)
 * ----------------------------------------------------
 */
const VoteRecordObject = Object.freeze({
    voteIdx: 0,
    userIdx: 0,
    status: VoteRecordStatus.default,
});

/**
 * @class Type
 * @description
 */
class Type {
    constructor() {}

    /**
     * ------------ [ Constants ] ----------------
     */
    get HttpStatus() {
        return HttpStatus;
    }

    get Category() {
        return Category;
    }

    get CategoryCount() {
        return CategoryCount;
    }

    /**
     * @getter Get Query method object
     * @returns {QueryMethods} Base QueryMethods object (readonly)
     */
    get QueryMethods() {
        return QueryMethods;
    }

    /**
     * @getter Get candidate status.
     * @returns {CandidateStatus} Base CandidateStatus object (readonly)
     */
    get CandidateStatus() {
        return CandidateStatus;
    }

    /**
     * @getter Get vote status.
     * @returns {VoteStatus} Base VoteStatus object (readonly)
     */
    get VoteStatus() {
        return VoteStatus;
    }

    /**
     * @getter Get vote record status.
     * @returns {VoteRecordStatus} Base VoteRecordStatus object (readonly)
     */
    get VoteRecordStatus() {
        return VoteRecordStatus;
    }

    /**
     * ------------ [ QueryObject ] ----------------
     */
    /**
     * @getter Get query object
     * @returns {QueryObject} Base query object (readonly)
     */
    get QueryObject() {
        return QueryObject;
    }
    /**
     * @function cloneQueryObject
     * @description Clone query object
     *
     * @param {object} initData Data to initialize the object
     * @returns {QueryObject} Base query object
     */
    cloneQueryObject(initData = null) {
        return utility.clone(QueryObject, initData);
    }

    /**
     * ------------ [ AccountObject ] ----------------
     */
    /**
     * @getter Get account object.
     * @returns {AccountObject} Base account object (readonly)
     */
    get AccountObject() {
        return AccountObject;
    }
    /**
     * @function cloneAccountObject
     * @description Clone account object.
     *
     * @param {object} initData Data to initialize the object
     * @returns {AccountObject} Base account object
     */
    cloneAccountObject(initData = null) {
        return utility.clone(AccountObject, initData);
    }

    /**
     * ------------ [ UserObject ] ----------------
     */
    /**
     * @getter Get user object.
     * @returns {UserObject} Base user object (readonly)
     */
    get UserObject() {
        return UserObject;
    }
    /**
     * @function cloneUserObject
     * @description Clone user object.
     *
     * @param {object} initData Data to initialize the object
     * @returns {UserObject} Base user object
     */
    cloneUserObject(initData = null) {
        return utility.clone(UserObject, initData);
    }

    /**
     * ------------ [ AuthMailObject ] ----------------
     */
    /**
     * @getter Get auth mail object.
     * @returns {AuthMailObject} Base auth mail object (readonly)
     */
    get AuthMailObject() {
        return AuthMailObject;
    }
    /**
     * @function cloneAuthMailObject Clone auth mail object.
     * @description Clone auth mail object.
     *
     * @param {object} initData Data to initialize the object
     * @returns {AuthMailObject} Base auth mail object
     */
    cloneAuthMailObject(initData = null) {
        return utility.clone(AuthMailObject, initData);
    }

    /**
     * ------------ [ CandidateObject ] ----------------
     */
    /**
     * @getter Get candidate object.
     * @returns {CandidateObject} Base candidate object (readonly)
     */
    get CandidateObject() {
        return CandidateObject;
    }
    /**
     * @function cloneCandidateObject
     * @description Clone candidate object.
     *
     * @param {object} initData Data to initialize the object
     * @returns {CandidateObject} Base candidate object
     */
    cloneCandidateObject(initData = null) {
        return utility.clone(CandidateObject, initData);
    }

    /**
     * ------------ [ VoteObject ] ----------------
     */
    /**
     * @getter Get vote object.
     * @returns {VoteObject} Base vote object (readonly)
     */
    get VoteObject() {
        return VoteObject;
    }
    /**
     * @function cloneVoteObject Clone vote object.
     * @description Clone vote object.
     *
     * @param {object} initData Data to initialize the object
     * @returns {VoteObject} Base vote object
     */
    cloneVoteObject(initData = null) {
        return utility.clone(VoteObject, initData);
    }

    /**
     * ------------ [ VoteRecordObject ] ----------------
     */
    /**
     * @getter Get vote record object.
     * @returns {VoteRecordObject} Base vote record object (readonly)
     */
    get VoteRecordObject() {
        return VoteRecordObject;
    }
    /**
     * @function cloneVoteRecordObject
     * @description Clone voteRecord object.
     *
     * @param {object} initData Data to initialize the object
     * @returns {VoteRecordObject} Base vote record object
     */
    cloneVoteRecordObject(initData = null) {
        return utility.clone(VoteRecordObject, initData);
    }

    /**
     * -------------------- [ Methods ] ------------------------
     */

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
}

/* Export class as module */
module.exports = new Type();
