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

        let category = {
            0: '총학생회',
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
            107: '의과대학',
            108: '간호대학',
            108: '약학대학',
        };
        let year = 2020;
        let nowTimestamp = Math.floor(Date.now() / 1000);
        const timeArr = this.getTimestampFromYear(year);
        let startIdx = 1000;
        let startCandIdx = 1000;
        let query = '';
        for (let i in category) {
            let name = year + '학년도 아주대학교 ' + category[i] + ' 선거';
            let totalCnt = utility.createRandomNum(10, 250);
            query += `INSERT INTO votes (idx, category, name, totalCount, startTime, endTime, createdAt, updatedAt) VALUES (${startIdx}, ${Number(i)}, "${name}", ${totalCnt}, FROM_UNIXTIME(${
                timeArr[0]
            }), FROM_UNIXTIME(${timeArr[1]}), FROM_UNIXTIME(${nowTimestamp}), FROM_UNIXTIME(${nowTimestamp}));`;
            let candCnt = utility.createRandomNum(1, 5);
            for (let j = 1; j <= candCnt; j++) {
                let candName = category[i] + ' 후보자' + j;
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
