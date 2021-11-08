/**
 * voteMiddleware.js
 * Last modified: 2021.11.03
 * Author: Lee Hong Jun (arcane22, hong3883@naver.com)
 * Description: Various middleware callbacks used in Express server are defined.
 */

/* Modules */
require('dotenv').config();
const logger = require('@src/utils/logger');
const contract = require('@src/blockchain/contract');

/**
 * @class VoteMiddleware
 * @description
 */
class VoteMiddleware {
    constructor() {}

    async getVoteList(req, res) {
        const arr = [];
        arr.push({ id: 1, text: '26대 총학생회 선거!', date: '2121.10.11 ~ 2021.12.11!', category: '총학생회' });
        arr.push({ id: 2, text: '26대 총학생회 선거!!', date: '2121.10.11~2021.12.11!!', category: '총학생회' });
        arr.push({ id: 3, text: '자연과학대학2', date: '2121.10.11~2021.12.11', category: '단과대학교' });
        arr.push({ id: 4, text: '미디어학과', date: '2121.10.11~2021.12.11', category: '학과' });
        arr.push({ id: 5, text: '경제학과', date: '2121.10.11~2021.12.11', category: '학과' });
        arr.push({ id: 6, text: '금융공학과1', date: '2121.10.11~2021.12.11', category: '학과' });
        arr.push({ id: 7, text: '자연과학대학3', date: '2121.10.11~2021.12.11', category: '단과대학교' });
        arr.push({ id: 8, text: '자연과학대학4', date: '2121.10.11~2021.12.11', category: '단과대학교' });
        arr.push({ id: 9, text: '자연과학대학5', date: '2121.10.11~2021.12.11', category: '단과대학교' });
        arr.push({ id: 10, text: '자연과학대학6', date: '2121.10.11~2021.12.11', category: '단과대학교' });
        arr.push({ id: 11, text: '금융공학과2', date: '2121.10.11~2021.12.11', category: '학과' });
        arr.push({ id: 12, text: '금융공학과43', date: '2121.10.11~2021.12.11', category: '학과' });
        arr.push({ id: 13, text: '금융공학과5', date: '2121.10.11~2021.12.11', category: '학과' });
        arr.push({ id: 14, text: '금융공학과4', date: '2121.10.11~2021.12.11', category: '학과' });
        res.send(arr);
    }

    async addVote(req, res) {
        const reqKeys = {
            voteName: 'voteName',
            startTime: 'startTime',
            endTime: 'endTime',
        };
        const resKeys = {
            idx: 'idx',
            voteName: 'voteName',
            startTime: 'startTime',
            endTime: 'endTime',
        };

        try {
            const resData = {};
            const body = req.body;
            const voteName = body[reqKeys.voteName];
            const startTime = body[reqKeys.startTime];
            const endTime = body[reqKeys.endTime];

            // @todo - Insert DB(startTransaction ~ query)

            const rtn = await contract.addVote(voteName, startTime, endTime);

            // @todo - Insert DB(commit or rollback ~ release)

            resData[resKeys.idx] = rtn.idx;
            resData[resKeys.voteName] = rtn.name;
            resData[resKeys.startTime] = rtn.startTime;
            resData[resKeys.endTime] = rtn.endTime;

            logger.info(resData);
            res.send(resData);
        } catch (err) {
            logger.error(err);
            res.send(err);
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
        };

        try {
            const resData = {};
            const body = req.body;
            const voteIdx = body[reqKeys.voteIdx];
            const candName = body[reqKeys.candName];

            // @todo - Save Image, Insert DB(startTransaction ~ query)

            const rtn = await contract.addCandidate(voteIdx, candName);

            // @todo - Insert DB(commit or rollback ~ release)

            resData[resKeys.idx] = rtn.idx;
            resData[resKeys.candName] = rtn.name;

            logger.info(resData);
            res.send(resData);
        } catch (err) {
            logger.error(err);
            res.send(err);
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

            // @todo - Check user's status
            // @todo - Update user's status, Insert DB(startTransaction ~ query)

            const rtn = await contract.vote(voteIdx, candIdx, renounce);

            // @todo - Insert DB(commit or rollback ~ release)

            resData[resKeys.receipt] = rtn.receipt;

            logger.info(resData);
            res.send(resData);
        } catch (err) {
            logger.error(err);
            res.send(err);
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

            const voteData = await contract.getVote(voteIdx);

            let candidates = [];
            for (let i in voteData.candIdxes) {
                const candData = await contract.getCandidate(voteData.candIdxes[i]);
                candidates.push(candData);
            }

            resData[resKeys.idx] = voteData.voteIdx;
            resData[resKeys.voteName] = voteData.voteName;
            resData[resKeys.candidates] = candidates;
            resData[resKeys.totalVoteCnt] = voteData.totalVoteCnt;
            resData[resKeys.startTime] = voteData.startTime;
            resData[resKeys.endTime] = voteData.endTime;
            resData[resKeys.status] = voteData.status;

            logger.info(resData);
            res.send(resData);
        } catch (err) {
            logger.error(err);
            res.send(err);
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

            logger.info(resData);
            res.send(resData);
        } catch (err) {
            logger.error(err);
            res.send(err);
        }
    }
}

/* Export instance as module */
module.exports = new VoteMiddleware();
