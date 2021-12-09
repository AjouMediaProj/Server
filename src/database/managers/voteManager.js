/**
 * voteManager.js
 * Last modified: 2021.12.06
 * Author
 *  Han Kyu Hyeon (kahmnkk, kyuhh1214@naver.com)
 *  Lee Hong Jun (arcane22, hong3883@naver.com)
 * Description: Vote Manager
 */

/* Modules */
const db = require('@src/database/database2');
const type = require('@src/utils/type');
const contract = require('@src/blockchain/contract');
const utility = require('@root/src/utils/utility');

const modelName = {
    candidate: db.getModel('Candidate').name,
    vote: db.getModel('Vote').name,
    voteRecord: db.getModel('VoteRecord').name,
};

/**
 * @calss VoteManager
 * @description Manage Candidate, Vote, VoteRecord table
 */
class VoteManager {
    constructor() {}

    /**
     * -----------------------------------------------------------------------------
     * ------------------------------- [ Candidate ] -------------------------------
     * -----------------------------------------------------------------------------
     */

    /**
     * @async
     * @function registerCandidate
     * @description Register new candidate to database
     *
     * @param {type.CandidateObject} candObj
     * @returns {type.CandidateObject}
     */
    async registerCandidate(candObj) {
        let rtn = null;

        try {
            const q = db.getModel(modelName.candidate).makeQuery(type.QueryMethods.create, candObj);
            rtn = await db.execQuery(q);
        } catch (err) {
            throw err;
        }

        return rtn;
    }

    /**
     * @async
     * @function findCandidatesFromVote
     * @description Find all candidates from vote
     *
     * @param {number} voteIdx Vote index which candidate belongs.
     * @returns {Array<baseCandidateObject>}
     */
    async findCandidatesFromVote(voteIdx) {
        let rtn = null;

        try {
            const q = db.getModel(modelName.candidate).makeQuery(type.QueryMethods.findAll);
            q.conditions.where = {
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
     * @async
     * @function findCandidateByIdx
     * @description Find specific candidate by idx
     *
     * @param {number} idx Index of candidate
     * @returns {type.CandidateObject} Candidate object
     */
    async findCandidateByIdx(idx) {
        let rtn = null;

        try {
            const q = db.getModel(modelName.candidate).makeQuery(type.QueryMethods.findOne, null, { where: { idx } });
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
            const q = db.getModel(modelName.candidate).makeQuery(type.QueryMethods.update, { count }, { where: { idx } });
            rtn = await db.execQuery(q);
        } catch (err) {
            throw err;
        }

        return rtn;
    }

    /**
     * @async
     * @function updateCandidate
     * @description Update candidate
     *
     * @param {type.CandidateObject} candObj Candidate object
     * @returns {boolean}
     */
    async updateCandidate(candObj) {
        let rtn = false;

        try {
            const q = db.getModel(modelName.candidate).makeQuery(type.QueryMethods.update);
            q.data = { name: candObj.name, photo: candObj.photo, img: candObj.img, txt: candObj.txt, status: candObj.status };
            q.conditions.where = { idx: candObj.idx };

            if ((await db.execQuery(q)) > 0) rtn = true;
        } catch (err) {
            throw err;
        }
    }

    /**
     * -----------------------------------------------------------------------------
     * --------------------------------- [ Vote ] ----------------------------------
     * -----------------------------------------------------------------------------
     */

    /**
     * @async
     * @function registerNewVote
     * @description Register new vote to contract & database
     *
     * @param {type.VoteObject} voteObj Vote object
     * @returns {type.VoteObject}
     */
    async registerVote(voteObj) {
        let rtn = null;

        try {
            const q = db.getModel(modelName.vote).makeQuery(type.QueryMethods.create, voteObj);
            rtn = await db.execQuery(q);
        } catch (err) {
            throw err;
        }

        return rtn;
    }

    /**
     * @async
     * @function findVoteByIdx
     * @description Find specific vote by idx
     *
     * @param {number} idx Index of vote
     * @returns {type.VoteObject} Vote object
     */
    async findVoteByIdx(idx) {
        let rtn = null;

        try {
            const q = db.getModel(modelName.vote).makeQuery(type.QueryMethods.findOne, null, { where: { idx } });
            rtn = await db.execQuery(q);
        } catch (err) {
            throw err;
        }

        return rtn;
    }

    /**
     * @async
     * @function findValidVotes
     * @description Find all valid votes in database
     *
     * @returns {Array<type.VoteObject>} Array of vote objects
     */
    async findValidVotes() {
        let rtn = null;

        try {
            const q = db.getModel(modelName.vote).makeQuery(type.QueryMethods.findAll);
            q.conditions.where = {
                // prettier-ignore
                [db.Op.and]: [
                        { startTime: { [db.Op.lte]: Date.now() } }, 
                        { endTime: { [db.Op.gte]: Date.now() } }, 
                        { status: { [db.Op.eq]: type.VoteStatus.default } }
                    ],
            };

            rtn = await db.execQuery(q);
        } catch (err) {
            throw err;
        }

        return rtn;
    }

    /**
     * @async
     * @function setVoteTotalCount
     * @description Set vote total count
     *
     * @param {number} idx Index of vote
     * @param {number} totalCount Vote total count
     * @returns {boolean} Whether the update is successful or not.
     */
    async setVoteTotalCount(idx, totalCount) {
        let rtn = false;

        try {
            const q = db.getModel(modelName.vote).makeQuery(type.QueryMethods.update);
            q.data = { totalCount };
            q.conditions.where = { idx };

            if ((await db.execQuery(q)) > 0) rtn = true;
        } catch (err) {
            throw err;
        }
    }

    /**
     * @async
     * @function syncVotes
     * @description Synchronize voting information between database and contact.
     *
     * @param {Array<type.VoteObject>} votes Array based on type.VoteObject
     */
    async syncVotes(votes) {
        for (let v of votes) {
            const arr = [];
            const voteData = await contract.getVote(v.idx);
            arr.push(db.getModel(modelName.vote).makeQuery(type.QueryMethods.update, { totalCount: voteData.totalVoteCnt }, { where: { idx: voteData.voteIdx } }));

            for (let c of voteData.candIdxes) {
                const candData = await contract.getCandidate(c);
                arr.push(db.getModel(modelName.candidate).makeQuery(type.QueryMethods.update, { count: candData.voteCnt }, { where: { idx: candData.candIdx } }));
            }

            await db.execTransaction(arr);
        }
    }

    /**
     * @async
     * @function setVoteTotalCount
     * @description Set vote total count
     *
     * @param {type.VoteObject} voteObj Vote object
     * @returns {boolean}
     */
    async updateVote(voteObj) {
        let rtn = false;

        try {
            const q = db.getModel(modelName.vote).makeQuery(type.QueryMethods.update);
            q.data = { category: voteObj.category, name: voteObj.name, startTime: voteObj.startTime, endTime: voteObj.endTime, status: voteObj.status };
            q.conditions.where = { idx: voteObj.idx };

            if ((await db.execQuery(q)) > 0) rtn = true;
        } catch (err) {
            throw err;
        }
    }

    /**
     * -----------------------------------------------------------------------------
     * ------------------------------ [ VoteRecord ] -------------------------------
     * -----------------------------------------------------------------------------
     */

    /**
     * @async
     * @function registerVoteRecord
     * @description
     *
     * @param {type.VoteRecordObject} voteRecordObj
     * @returns {type.VoteRecordObject}
     */
    async registerVoteRecord(voteRecordObj) {
        let rtn = null;

        try {
            const q = db.getModel(modelName.voteRecord).makeQuery(type.QueryMethods.create, voteRecordObj);
            rtn = await db.execQuery(q);
        } catch (err) {
            throw err;
        }

        return rtn;
    }

    /**
     * @function findVoteRecord
     * @description Select vote record from database.
     *
     * @param {number} voteIdx Vote index
     * @param {number} userIdx User index
     * @returns {baseVoteRecordObject}
     */
    async findVoteRecord(voteIdx, userIdx) {
        let rtn = null;

        try {
            const q = db.getModel(modelName.voteRecord).makeQuery(type.QueryMethods.findOne);
            q.conditions.where = {
                // prettier-ignore
                [db.Op.and]: [
                        { voteIdx: { [db.Op.eq]: voteIdx } }, 
                        { userIdx: { [db.Op.eq]: userIdx } }
                    ],
            };

            rtn = await db.execQuery(q);
        } catch (err) {
            throw err;
        }

        return rtn;
    }

    /**
     * @function updateVoteRecordStatus
     * @description Update vote record status.
     *
     * @param {number} voteIdx Vote index
     * @param {number} userIdx User index
     * @param {number} status Vote record status
     */
    async updateVoteRecordStatus(voteIdx, userIdx, status) {
        let rtn = null;

        try {
            const q = db.getModel(modelName.voteRecord).makeQuery(type.QueryMethods.update, { status });
            q.conditions.where = {
                // prettier-ignore
                [db.Op.and]: [
                    { voteIdx: { [db.Op.eq]: voteIdx } }, 
                    { userIdx: { [db.Op.eq]: userIdx } }
                ],
            };

            rtn = await db.execQuery(q);
        } catch (err) {
            throw err;
        }

        return rtn;
    }

    /**
     * -----------------------------------------------------------------------------
     * ------------------------------ [ Common ] -------------------------------
     * -----------------------------------------------------------------------------
     */

    /**
     * @function validReserveTime
     * @description Valid reserve time
     *
     * @param {Number} startTime
     * @param {Number} endTime
     * @returns {boolean}
     */
    validReserveTime(startTime, endTime) {
        let rtn = false;
        if (Date.now() < utility.convertToTimestamp(startTime, true) && Date.now() < utility.convertToTimestamp(endTime, true)) {
            rtn = true;
        }
        return rtn;
    }

    /**
     * @function validEndTime
     * @description Valid end time
     *
     * @param {Number} endTime
     * @returns {boolean}
     */
    validEndTime(endTime) {
        let rtn = false;
        if (Date.now() < utility.convertToTimestamp(endTime, true)) {
            rtn = true;
        }
        return rtn;
    }
}

/* Export instance as module */
module.exports = new VoteManager();
