/**
 * voteManager.js
 * Last modified: 2021.11.08
 * Author: Han Kyu Hyeon (kahmnkk, kyuhh1214@naver.com)
 * Description: Vote Manager
 */

/* Modules */
const BaseManager = require('@src/database/managers/baseManager');
const logger = require('@src/utils/logger');
const utility = require('@src/utils/utility');

/* Variables */
const baseVoteObject = {
    idx: null,
    category: null,
    name: null,
    totalCount: null,
    startTime: null,
    endTime: null,
    status: null,
};

const status = {
    default: 0,
    deleted: 1,
};

/**
 * @class VoteManager
 * @description
 */
class VoteManager extends BaseManager {
    constructor() {
        super();

        this.modelName = 'vote';
    }

    /**
     * @function makeVoteObj
     * @description Make new object based on baseVoteObject
     *
     * @param {number} idx Vote index from contract.
     * @param {number} category Category type. Defined in file.
     * @param {string} name Vote name
     * @param {number} startTime Vote startTime
     * @param {number} endTime Vote endTime
     * @returns {baseVoteObject} New vote object
     */
    async makeVoteObj(idx, category, name, startTime, endTime) {
        let rtn = super.getBaseObject(baseVoteObject);

        rtn.idx = idx;
        rtn.category = category;
        rtn.name = name;
        rtn.totalCount = 0;
        rtn.startTime = startTime;
        rtn.endTime = endTime;
        rtn.status = status.default;

        return rtn;
    }

    /**
     * @function create
     * @description Sequelize create
     *
     * @param {baseVoteObject} voteObj Vote object
     */
    async create(voteObj) {
        await super.create(this.modelName, voteObj);
    }

    /**
     * @function findVote
     * @description Select vote from database.
     *
     * @param {number} idx Vote index
     * @returns {baseVoteObject}
     */
    async findVote(idx) {
        let rtn = null;

        const query = {
            where: { idx },
        };
        try {
            rtn = await super.find(this.modelName, query);
        } catch (err) {
            throw err;
        }

        return rtn;
    }

    /**
     * @function findEnableVotes
     * @description Select enable votes from database.
     *
     * @returns {Array<baseVoteObject>}
     */
    async findEnableVotes() {
        let rtn = null;

        const query = {
            where: {
                [super.getOp.and]: [{ startTime: { [super.getOp.lte]: Date.now() } }, { endTime: { [super.getOp.gte]: Date.now() } }, { status: { [super.getOp.eq]: status.default } }],
            },
        };
        try {
            rtn = await super.findAll(this.modelName, query);
        } catch (err) {
            throw err;
        }

        return rtn;
    }

    /**
     * @function setVoteCount
     * @description Set vote count from contract.
     *
     * @param {number} idx
     * @param {number} totalCount
     */
    async setVoteCount(idx, totalCount) {
        const contents = { totalCount };
        const query = { where: { idx } };

        await this.update(this.modelName, contents, query);
    }
}

/* Export object as module */
module.exports = new VoteManager();
