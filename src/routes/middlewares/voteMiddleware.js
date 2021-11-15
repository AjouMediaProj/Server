/**
 * voteMiddleware.js
 * Last modified: 2021.11.03
 * Author: Lee Hong Jun (arcane22, hong3883@naver.com)
 * Description: Various middleware callbacks used in Express server are defined.
 */

/* Modules */
require('dotenv').config();
const logger = require('@src/utils/logger');
const utility = require('@src/utils/utility');

/* Manager */
const voteMgr = require('@src/database/managers/voteManager');
const candidateMgr = require('@src/database/managers/candidateManager');
const voteRecordMgr = require('@src/database/managers/voteRecordManager');

const contract = require('@src/blockchain/contract');

/**
 * @class VoteMiddleware
 * @description
 */
class VoteMiddleware {
    constructor() {}

    async getVoteList(req, res) {
        const reqKeys = {};
        const resKeys = {
            list: 'list',
        };

        try {
            const resData = {};

            let rtn = [];

            const votes = await voteMgr.findEnableVotes();
            for (let i in votes) {
                let item = votes[i].dataValues;
                item.startTime = utility.convertToTimestamp(item.startTime);
                item.endTime = utility.convertToTimestamp(item.endTime);

                rtn.push(item);
            }

            resData[resKeys.list] = rtn;

            utility.routerSend(res, resData);
        } catch (err) {
            utility.routerError(res, err);
        }
    }

    async addVote(req, res) {
        const reqKeys = {
            category: 'category',
            voteName: 'voteName',
            startTime: 'startTime',
            endTime: 'endTime',
        };
        const resKeys = {
            idx: 'idx',
            category: 'category',
            voteName: 'voteName',
            totalCount: 'totalCount',
            startTime: 'startTime',
            endTime: 'endTime',
            status: 'status',
        };

        try {
            const resData = {};
            const body = req.body;
            const category = body[reqKeys.category];
            const voteName = body[reqKeys.voteName];
            const startTime = body[reqKeys.startTime];
            const endTime = body[reqKeys.endTime];

            const rtn = await contract.addVote(voteName, startTime, endTime);

            const voteObj = await voteMgr.makeVoteObj(Number(rtn.idx), category, voteName, startTime * 1000, endTime * 1000);
            await voteMgr.create(voteObj);

            resData[resKeys.idx] = voteObj.idx;
            resData[resKeys.category] = voteObj.category;
            resData[resKeys.voteName] = voteObj.name;
            resData[resKeys.totalCount] = voteObj.totalCount;
            resData[resKeys.startTime] = voteObj.startTime / 1000;
            resData[resKeys.endTime] = voteObj.endTime / 1000;
            resData[resKeys.status] = voteObj.status;

            utility.routerSend(res, resData);
        } catch (err) {
            utility.routerError(res, err);
        }
    }

    async addCandidate(req, res) {
        const reqKeys = {
            voteIdx: 'voteIdx',
            candName: 'candName',
        };
        const resKeys = {
            idx: 'idx',
            candName: 'candName',
            photo: 'photo',
            img: 'img',
        };

        try {
            const resData = {};
            const body = req.body;
            const voteIdx = body[reqKeys.voteIdx];
            const candName = body[reqKeys.candName];

            const rtn = await contract.addCandidate(voteIdx, candName);

            // @todo - Save Image, Insert DB(startTransaction ~ query)
            const candObj = await candidateMgr.makeCandidateObj(Number(rtn.idx), voteIdx, candName, '', '');
            await candidateMgr.create(candObj);

            resData[resKeys.idx] = candObj.idx;
            resData[resKeys.candName] = candObj.name;
            resData[resKeys.photo] = candObj.photo;
            resData[resKeys.img] = candObj.img;

            utility.routerSend(res, resData);
        } catch (err) {
            utility.routerError(res, err);
        }
    }

    async vote(req, res) {
        const reqKeys = {
            voteIdx: 'voteIdx',
            candIdx: 'candIdx',
            renounce: 'renounce',
        };
        const resKeys = {
            receipt: 'receipt',
        };

        try {
            const resData = {};
            const body = req.body;
            const voteIdx = Number(body[reqKeys.voteIdx]);
            const candIdx = Number(body[reqKeys.candIdx]);
            const renounce = body[reqKeys.renounce];

            const userIdx = 2; // Temp Data
            const result = await voteRecordMgr.findVoteRecord(voteIdx, userIdx);
            if (result != null) {
                throw 'error: user already voted';
            }

            const rtn = await contract.vote(voteIdx, candIdx, renounce);

            const recordObj = await voteRecordMgr.makeVoteRecordObj(voteIdx, userIdx);
            await voteRecordMgr.create(recordObj);

            resData[resKeys.receipt] = rtn.receipt;

            utility.routerSend(res, resData);
        } catch (err) {
            utility.routerError(res, err);
        }
    }

    async getVoteOverview(req, res) {
        const reqKeys = {
            voteIdx: 'voteIdx',
        };
        const resKeys = {
            idx: 'idx',
            voteName: 'voteName',
            candidates: 'candidates',
            totalVoteCnt: 'totalVoteCnt',
            startTime: 'startTime',
            endTime: 'endTime',
            status: 'status',
        };

        try {
            const resData = {};
            const body = req.body;
            const voteIdx = body[reqKeys.voteIdx];

            const voteData = await voteMgr.findVote(voteIdx);
            const candidates = await candidateMgr.findCandidates(voteIdx);

            resData[resKeys.idx] = voteData.idx;
            resData[resKeys.voteName] = voteData.name;
            resData[resKeys.candidates] = candidates;
            resData[resKeys.totalVoteCnt] = voteData.totalCount;
            resData[resKeys.startTime] = voteData.startTime;
            resData[resKeys.endTime] = voteData.endTime;
            resData[resKeys.status] = voteData.status;

            utility.routerSend(res, resData);
        } catch (err) {
            utility.routerError(res, err);
        }
    }

    async decodeVoteReceipt(req, res) {
        const reqKeys = {
            transactionHash: 'transactionHash',
        };
        const resKeys = {
            voteIdx: 'voteIdx',
            candIdx: 'candIdx',
            renounce: 'renounce',
        };

        try {
            const resData = {};
            const body = req.body;
            const transactionHash = body[reqKeys.transactionHash];

            const decodedData = await contract.decodeVoteReceipt(transactionHash);

            resData[resKeys.voteIdx] = decodedData.voteIdx;
            resData[resKeys.candIdx] = decodedData.candIdx;
            resData[resKeys.renounce] = decodedData.renounce;

            utility.routerSend(res, resData);
        } catch (err) {
            utility.routerError(res, err);
        }
    }
}

/* Export instance as module */
module.exports = new VoteMiddleware();
