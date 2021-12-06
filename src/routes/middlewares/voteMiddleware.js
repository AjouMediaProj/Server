/**
 * voteMiddleware.js
 * Last modified: 2021.12.06
 * Author: Lee Hong Jun (arcane22, hong3883@naver.com)
 * Description: Various middleware callbacks used in Express server are defined.
 */

/* Modules */
require('dotenv').config();
const { Request, Response, NextFunction } = require('express');
const type = require('@src/utils/type');
const logger = require('@src/utils/logger');
const utility = require('@src/utils/utility');

/* Manager */
const voteMgr = require('@src/database/managers/voteManager');
const contract = require('@src/blockchain/contract');

/**
 * @class VoteMiddleware
 * @description
 */
class VoteMiddleware {
    constructor() {}

    /**
     * @async
     * @function getVoteList
     * @description Get valid vote list from database
     *
     * @param {Request} req Express request object (from client)
     * @param {Response} res Express response object (to client)
     */
    async getVoteList(req, res) {
        const reqKeys = {};
        const resKeys = {
            list: 'list',
        };

        try {
            let rtn = [];
            const resData = {};
            const votes = await voteMgr.findValidVotes();

            for (let v of votes) {
                rtn.push(v);
            }

            resData[resKeys.list] = rtn;

            utility.routerSend(res, type.HttpStatus.OK, resData);
        } catch (err) {
            utility.routerSend(res, type.HttpStatus.InternalServerError, err, true);
        }
    }

    /**
     * @async
     * @function addVote
     * @description Add new vote to block chain & database
     *
     * @param {Request} req Express request object (from client)
     * @param {Response} res Express response object (to client)
     */
    async addVote(req, res) {
        const reqKeys = {
            category: 'category',
            voteName: 'voteName',
            startTime: 'startTime', // sec
            endTime: 'endTime', // sec
        };
        const resKeys = {
            idx: 'idx',
            category: 'category',
            voteName: 'name',
            totalCount: 'totalCount',
            startTime: 'startTime',
            endTime: 'endTime',
            status: 'status',
        };

        try {
            // parse body data
            const body = req.body;
            const category = body[reqKeys.category];
            const voteName = body[reqKeys.voteName];
            const startTime = body[reqKeys.startTime];
            const endTime = body[reqKeys.endTime];

            // add vote to block chain
            const rtn = await contract.addVote(voteName, startTime, endTime);

            const resData = type.cloneVoteObject();
            resData[resKeys.idx] = Number(rtn.idx);
            resData[resKeys.category] = category;
            resData[resKeys.voteName] = voteName;
            resData[resKeys.startTime] = startTime * 1000; // convert sec to milisec
            resData[resKeys.endTime] = endTime * 1000; // convert sec to milisec

            // add vote to database
            await voteMgr.registerVote(resData);

            // send result to client
            utility.routerSend(res, type.HttpStatus.Created, resData);
        } catch (err) {
            utility.routerSend(res, type.HttpStatus.InternalServerError, err, true);
        }
    }

    /**
     * @async
     * @function addCandidate
     * @description Add new candidate to block chain & client
     *
     * @param {Request} req Express request object (from client)
     * @param {Response} res Express response object (to client)
     */
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
            txt: 'txt',
        };

        try {
            const resData = {};
            const body = req.body;
            const voteIdx = body[reqKeys.voteIdx];
            const candName = body[reqKeys.candName];

            // add candidate to block chain
            const rtn = await contract.addCandidate(voteIdx, candName);

            // @todo - Save Image, Insert DB(startTransaction ~ query)
            const candObj = type.cloneCandidateObject();
            candObj.idx = Number(rtn.idx);
            candObj.voteIdx = voteIdx;
            candObj.name = candName;
            candObj.photo = '';
            candObj.img = '';
            candObj.txt = '';

            // add candidate to database
            await voteMgr.registerCandidate(candObj);

            resData[resKeys.idx] = candObj.idx;
            resData[resKeys.candName] = candObj.name;
            resData[resKeys.photo] = candObj.photo;
            resData[resKeys.img] = candObj.img;

            // send result to client
            utility.routerSend(res, type.HttpStatus.Created, resData);
        } catch (err) {
            utility.routerSend(res, type.HttpStatus.InternalServerError, err, true);
        }
    }

    /**
     * @async
     * @function vote
     * @description
     *
     * @param {Request} req Express request object (from client)
     * @param {Response} res Express response object (to client)
     */
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

            const userIdx = req.user.idx;
            const result = await voteMgr.findVoteRecord(voteIdx, userIdx);
            if (result != null && result.status == type.VoteRecordStatus.verified) {
                throw new Error('error: user already voted');
            }

            // add vote record to database
            const recordObj = type.cloneVoteRecordObject();
            recordObj.voteIdx = voteIdx;
            recordObj.userIdx = userIdx;
            await voteMgr.registerVoteRecord(recordObj);

            // add new user's vote to block chain
            const rtn = await contract.vote(voteIdx, candIdx, renounce);

            // update vote record status (default -> verified)
            await voteMgr.updateVoteRecordStatus(voteIdx, userIdx, type.VoteRecordStatus.verified);

            // send result to client
            resData[resKeys.receipt] = rtn.receipt;
            utility.routerSend(res, type.HttpStatus.Created, resData);
        } catch (err) {
            utility.routerSend(res, type.HttpStatus.InternalServerError, err, true);
        }
    }

    /**
     * @async
     * @function getVoteOverview
     * @description
     *
     * @param {Request} req Express request object (from client)
     * @param {Response} res Express response object (to client)
     */
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

            // find vote & candidates from database
            const voteData = await voteMgr.findVoteByIdx(voteIdx);
            const candidates = await voteMgr.findCandidatesFromVote(voteIdx);

            if (voteData) {
                resData[resKeys.idx] = voteData.idx;
                resData[resKeys.voteName] = voteData.name;
                resData[resKeys.candidates] = candidates;
                resData[resKeys.totalVoteCnt] = voteData.totalCount;
                resData[resKeys.startTime] = voteData.startTime;
                resData[resKeys.endTime] = voteData.endTime;
                resData[resKeys.status] = voteData.status;

                // send result to client
                utility.routerSend(res, type.HttpStatus.OK, resData);
            } else {
                utility.routerSend(res, type.HttpStatus.NotFound);
            }
        } catch (err) {
            utility.routerSend(res, type.HttpStatus.InternalServerError, err, true);
        }
    }

    /**
     * @async
     * @function decodeVoteReceipt
     * @description
     *
     * @param {Request} req Express request object (from client)
     * @param {Response} res Express response object (to client)
     */
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

            // decode the vote receipt
            const decodedData = await contract.decodeVoteReceipt(transactionHash);

            resData[resKeys.voteIdx] = decodedData.voteIdx;
            resData[resKeys.candIdx] = decodedData.candIdx;
            resData[resKeys.renounce] = decodedData.renounce;

            // send result to client
            utility.routerSend(res, type.HttpStatus.OK, resData);
        } catch (err) {
            utility.routerSend(res, type.HttpStatus.InternalServerError, err, true);
        }
    }
}

/* Export instance as module */
module.exports = new VoteMiddleware();
