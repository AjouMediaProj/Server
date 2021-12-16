/**
 * candidateManager.js
 * Last modified: 2021.11.08
 * Author: Han Kyu Hyeon (kahmnkk, kyuhh1214@naver.com)
 * Description: Candidate Manager
 */

/* Modules */
const db = require('@root/src/database/database');
const type = require('@src/utils/type');
const logger = require('@src/utils/logger');
const utility = require('@src/utils/utility');

/**
 * @class CandidateManager
 * @description
 */
class CandidateManager {
    constructor() {
        this.modelName = 'candidate';
    }

    /**
     * @async
     * @function registerCandidate
     * @description
     *
     * @param {type.CandidateObject} candObj
     * @returns {type.CandidateObject}
     */
    async registerCandidate(candObj) {
        let rtn = null;

        try {
            const q = db.getModel(this.modelName).makeQuery(type.QueryMethods.create, candObj);
            rtn = await db.execQuery(q);
        } catch (err) {
            throw err;
        }

        return rtn;
    }

    /**
     * @async
     * @function findCandidates
     * @description Find all candidates from vote
     *
     * @param {number} voteIdx Vote index which candidate belongs.
     * @returns {Array<baseCandidateObject>}
     */
    async findCandidatesFromVote(voteIdx) {
        let rtn = null;

        try {
            const q = db.getModel(this.modelName).makeQuery(type.QueryMethods.findAll);
            q.where = {
                // prettier-ignore
                [db.Op.and]: [
                    { voteIdx: { [db.Op.eq]: voteIdx } }, 
                    { status: { [db.Op.eq]: type.CandidateStatus.default } }
                ],
            };
            rtn = await db.execQuery(q);
        } catch (err) {
            throw err;
        }

        return rtn;
    }

    /**
     * @function setCandidateCount
     * @description Set candidate count from contract.
     *
     * @param {number} idx
     * @param {number} count
     * @returns {number}
     */
    async setCandidateCount(idx, count) {
        let rtn = null;

        try {
            const q = db.getModel(this.modelName).makeQuery(type.QueryMethods.update, { count }, { where: { idx } });
            rtn = await db.execQuery(q);
        } catch (err) {
            throw err;
        }

        return rtn;
    }
}

/* Export object as module */
module.exports = new CandidateManager();
