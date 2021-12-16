/**
 * voteManager.js
 * Last modified: 2021.12.06
 * Author
 *  Han Kyu Hyeon (kahmnkk, kyuhh1214@naver.com)
 *  Lee Hong Jun (arcane22, hong3883@naver.com)
 * Description: Vote Manager
 */

/* Modules */
const db = require('@root/src/database/database');
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
     * @function findValidVotes
     * @description Find all past votes in database
     *
     * @param {number} page Current Page
     * @param {string} name Name of vote to search
     * @param {number} year Year of vote
     * @returns {Array<type.VoteObject>} Array of vote objects
     */
    async findPastVotes(page, name = '', year = 0) {
        let rtn = null;

        const voteNumberPerPage = 8;

        let query = 'SELECT * FROM votes WHERE ';
        if (name != '') {
            query += `name LIKE '%${name}%' AND `;
        }
        if (year != 0) {
            const timeArr = this.getTimestampFromYear(year);
            query += `endTime BETWEEN FROM_UNIXTIME(${timeArr[0]}) AND FROM_UNIXTIME(${timeArr[1]}) AND `;
        }
        query += `endTime < FROM_UNIXTIME(${Math.floor(Date.now() / 1000)}) AND status = ${type.VoteStatus.default} `;
        query += `ORDER BY idx DESC LIMIT ${voteNumberPerPage} OFFSET ${(page - 1) * voteNumberPerPage};`;

        try {
            rtn = await db.sequelize.query(query, { type: db.sequelize.QueryTypes.SELECT, raw: true });
        } catch (err) {
            throw err;
        }

        return rtn;
    }

    /**
     * @async
     * @function findValidVotes
     * @description Find count of past votes in database
     *
     * @param {number} page Current Page
     * @param {string} name Name of vote to search
     * @param {number} year Year of vote
     * @returns {number} Count of past votes
     */
    async findPastVoteCount(name = '', year = 0) {
        let rtn = 0;

        let query = 'SELECT Count(1) AS cnt FROM votes WHERE ';
        if (name != '') {
            query += `name LIKE '%${name}%' AND `;
        }
        if (year != 0) {
            const timeArr = this.getTimestampFromYear(year);
            query += `endTime BETWEEN FROM_UNIXTIME(${timeArr[0]}) AND FROM_UNIXTIME(${timeArr[1]}) AND `;
        }
        query += `endTime < FROM_UNIXTIME(${Math.floor(Date.now() / 1000)}) AND status = ${type.VoteStatus.default} `;
        query += `ORDER BY idx DESC;`;

        try {
            rtn = await db.sequelize.query(query, { type: db.sequelize.QueryTypes.SELECT, raw: true });
        } catch (err) {
            throw err;
        }

        return rtn[0].cnt;
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

    async insertTempVotes() {
        let rtn = null;

        let year = 2020;
        let nowTimestamp = Math.floor(Date.now() / 1000);
        const timeArr = this.getTimestampFromYear(year);
        let startIdx = 1000;
        let startCandIdx = 1000;
        let query = '';
        for (let i in type.Category) {
            let name = year + '학년도 아주대학교 ' + type.Category[i] + ' 선거';
            let totalCnt = type.CategoryCount[i];
            query += `INSERT INTO votes (idx, category, name, totalCount, startTime, endTime, createdAt, updatedAt) VALUES (${startIdx}, ${Number(i)}, "${name}", ${totalCnt}, FROM_UNIXTIME(${
                timeArr[0]
            }), FROM_UNIXTIME(${timeArr[1]}), FROM_UNIXTIME(${nowTimestamp}), FROM_UNIXTIME(${nowTimestamp}));`;
            let candCnt = utility.createRandomNum(1, 5);
            for (let j = 1; j <= candCnt; j++) {
                let candName = type.Category[i] + ' 후보자' + j;
                let candVoteCnt = totalCnt;
                if (j != candCnt) {
                    candVoteCnt = utility.createRandomNum(0, totalCnt);
                }
                query += `INSERT INTO candidates (idx, voteIdx, name, count, createdAt, updatedAt) VALUES (${startCandIdx}, ${startIdx}, "${candName}", ${candVoteCnt}, FROM_UNIXTIME(${nowTimestamp}), FROM_UNIXTIME(${nowTimestamp}));`;
                totalCnt -= candVoteCnt;
                startCandIdx++;
            }
            startIdx++;
        }

        try {
            rtn = await db.sequelize.query(query, { type: db.sequelize.QueryTypes.INSERT, raw: true });
        } catch (err) {
            throw err;
        }

        return rtn;
    }

    /**
     * @async
     * @function validCategory
     * @description Check valid category
     *
     * @param {Number} userCategory User category
     * @param {Number} voteCategory Vote category
     * @returns {boolean}
     */
    validCategory(userCategory, voteCategory) {
        let rtn = false;

        switch (voteCategory.toString().length) {
            case 1:
                userCategory = Math.floor(userCategory / 10000);
                break;

            case 3:
                userCategory = Math.floor(userCategory / 100);
                break;
        }
        if (voteCategory == userCategory) {
            rtn = true;
        }

        return rtn;
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
     * @returns {type.VoteRecordObject}
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
     * @function findAllVoteRecord
     * @description Select all vote record from database.
     *
     * @param {number} userIdx User index
     * @returns {Array<type.VoteRecordObject>}
     */
    async findAllVoteRecord(userIdx) {
        let rtn = null;

        try {
            const q = db.getModel(modelName.voteRecord).makeQuery(type.QueryMethods.findAll);
            q.conditions.where = { userIdx };

            rtn = await db.execQuery(q);
        } catch (err) {
            throw err;
        }

        return rtn;
    }

    /**
     * @function findVerifiedVoteRecord
     * @description Select verified vote record from database.
     *
     * @param {number} userIdx User index
     * @returns {Array<type.VoteRecordObject>}
     */
    async findVerifiedVoteRecord(userIdx) {
        let rtn = null;

        try {
            const q = db.getModel(modelName.voteRecord).makeQuery(type.QueryMethods.findAll);
            q.conditions.where = {
                // prettier-ignore
                [db.Op.and]: [
                        { userIdx: { [db.Op.eq]: userIdx } },
                        { status: { [db.Op.eq]: type.VoteRecordStatus.verified } }
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

    /**
     * @function getTimestampFromYear
     * @description Get timestamp from year
     *
     * @param {Number} year
     * @returns {Array<Number>}
     */
    getTimestampFromYear(year) {
        let startTime = new Date(year, 0, 1);
        let endTime = new Date(year, 11, 31);
        return [Math.floor(startTime.getTime() / 1000), Math.floor(endTime.getTime() / 1000)];
    }
}

/* Export instance as module */
module.exports = new VoteManager();
