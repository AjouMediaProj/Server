/**
 * voteRecordManager.js
 * Last modified: 2021.11.08
 * Author: Han Kyu Hyeon (kahmnkk, kyuhh1214@naver.com)
 * Description: Vote Record Manager
 */

/* Modules */
const db = require('@src/database/database2');
const type = require('@src/utils/type');
const logger = require('@src/utils/logger');
const utility = require('@src/utils/utility');

/* Variables */

/**
 * @class VoteRecordManager
 * @description
 */
class VoteRecordManager {
    constructor() {
        this.modelName = 'VoteRecord';
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
            const q = db.getModel(this.modelName).makeQuery(type.QueryMethods.findOne);
            q.where = {
                // prettier-ignore
                [db.Op.and]: [
                    { voteIdx: { [db.Op.eq]: voteIdx } }, 
                    { userIdx: { [db.op.eq]: userIdx } }
                ],
            };

            rtn = await db.execQuery(q);
        } catch (err) {
            throw err;
        }

        return rtn;
    }

    /**
     * @function updateVoteRecord
     * @description Update vote record status.
     *
     * @param {number} voteIdx Vote index
     * @param {number} userIdx User index
     * @param {number} status Vote record status
     */
    async updateVoteRecord(voteIdx, userIdx, status) {
        let rtn = null;

        try {
            const q = db.getModel(this.modelName).makeQuery(type.QueryMethods.update, { status });
            q.where = {
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
}

/* Export object as module */
module.exports = new VoteRecordManager();
