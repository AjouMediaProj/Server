/**
 * voteRecordManager.js
 * Last modified: 2021.11.08
 * Author: Han Kyu Hyeon (kahmnkk, kyuhh1214@naver.com)
 * Description: Vote Record Manager
 */

/* Modules */
const BaseManager = require('@src/database/managers/baseManager');
const logger = require('@src/utils/logger');
const utility = require('@src/utils/utility');

/* Variables */
const baseVoteRecordObject = {
    voteIdx: null,
    userIdx: null,
    status: null,
};

const status = {
    default: 0,
    verified: 1,
};

/**
 * @class VoteRecordManager
 * @description
 */
class VoteRecordManager extends BaseManager {
    constructor() {
        super();

        this.modelName = 'voteRecord';
    }

    get status() {
        return status;
    }

    /**
     * @function makeVoteObj
     * @description Make new object based on baseVoteRecordObject
     *
     * @param {number} voteIdx Vote index
     * @param {number} userIdx User index
     * @returns {baseVoteRecordObject} New vote record object
     */
    async makeVoteRecordObj(voteIdx, userIdx) {
        let rtn = super.getBaseObject(baseVoteRecordObject);

        rtn.voteIdx = voteIdx;
        rtn.userIdx = userIdx;
        rtn.status = status.default;

        return rtn;
    }

    /**
     * @function create
     * @description Sequelize create
     *
     * @param {baseVoteRecordObject} voteRecordObj VoteRecord object
     */
    async create(voteRecordObj) {
        await super.create(this.modelName, voteRecordObj);
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

        const query = {
            where: {
                [super.getOp.and]: [{ voteIdx: { [super.getOp.eq]: voteIdx } }, { userIdx: { [super.getOp.eq]: userIdx } }],
            },
        };
        try {
            rtn = await super.find(this.modelName, query);
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
        const contents = { status };
        const query = {
            where: {
                [super.getOp.and]: [{ voteIdx: { [super.getOp.eq]: voteIdx } }, { userIdx: { [super.getOp.eq]: userIdx } }],
            },
        };

        await this.update(this.modelName, contents, query);
    }
}

/* Export object as module */
module.exports = new VoteRecordManager();
