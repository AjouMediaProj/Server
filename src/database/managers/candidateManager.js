/**
 * candidateManager.js
 * Last modified: 2021.11.08
 * Author: Han Kyu Hyeon (kahmnkk, kyuhh1214@naver.com)
 * Description: Candidate Manager
 */

/* Modules */
const BaseManager = require('@src/database/managers/baseManager');
const logger = require('@src/utils/logger');
const utility = require('@src/utils/utility');

/* Variables */
const baseCandidateObject = {
    idx: null,
    voteIdx: null,
    name: null,
    photo: null,
    img: null,
    count: null,
    status: null,
};

const status = {
    default: 0,
    deleted: 1,
};

/**
 * @class CandidateManager
 * @description
 */
class CandidateManager extends BaseManager {
    constructor() {
        super();

        this.modelName = 'candidate';
    }

    /**
     * @function makeCandidateObj
     * @description Make new object based on baseCandidateObject
     *
     * @param {number} idx Candidate index from contract.
     * @param {number} voteIdx Vote index which candidate belongs.
     * @param {string} name Candidate name
     * @param {string} photo Candidate photo
     * @param {string} img Candidate promise image
     * @returns {baseCandidateObject} New Candidate object
     */
    async makeCandidateObj(idx, voteIdx, name, photo, img) {
        let rtn = super.getBaseObject(baseCandidateObject);

        rtn.idx = idx;
        rtn.voteIdx = voteIdx;
        rtn.name = name;
        rtn.photo = photo;
        rtn.img = img;
        rtn.count = 0;
        rtn.status = status.default;

        return rtn;
    }

    /**
     * @function create
     * @description Sequelize create
     *
     * @param {baseCandidateObject} candidateObj Candidate object
     */
    async create(candidateObj) {
        await super.create(this.modelName, candidateObj);
    }

    /**
     * @function findEnableVotes
     * @description Select enable votes from database.
     *
     * @param {number} voteIdx Vote index which candidate belongs.
     * @returns {Array<baseCandidateObject>}
     */
    async findCandidates(voteIdx) {
        let rtn = null;

        const query = {
            where: {
                [super.getOp.and]: [{ voteIdx: { [super.getOp.eq]: voteIdx } }, { status: { [super.getOp.eq]: status.default } }],
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
     * @function setCandidateCount
     * @description Set candidate count from contract.
     *
     * @param {number} idx
     * @param {number} count
     */
    async setCandidateCount(idx, count) {
        const contents = { count };
        const query = { where: { idx } };

        await this.update(this.modelName, contents, query);
    }
}

/* Export object as module */
module.exports = new CandidateManager();
