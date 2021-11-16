/**
 * crawlerServer.js
 * Last modified: 2021.11.15
 * Author: Han Kyu Hyeon
 * Description: Crawling vote contract to sync vote counts.
 */

/* Modules */
const contract = require('@src/blockchain/contract');
const voteMgr = require('@src/database/managers/voteManager');
const candMgr = require('@src/database/managers/candidateManager');

/* Utils */
const logger = require('@src/utils/logger');

/**
 * @class CrawlerServer
 * @description
 */
class CrawlerServer {
    constructor() {
        this.standardTime = 600; // 10 min
    }

    async run() {
        setInterval(async () => {
            try {
                await this.update();
            } catch (err) {
                logger.error(err);
            }
        }, 1000);
    }

    async update() {
        const nowTimestamp = Math.floor(Date.now() / 1000);
        if (nowTimestamp % this.standardTime == 0) {
            const votes = await voteMgr.findEnableVotes();
            for (let i in votes) {
                // @todo db transaction
                const voteData = await contract.getVote(votes[i].idx);
                await voteMgr.setVoteCount(votes[i].idx, voteData.totalVoteCnt);

                for (let i in voteData.candIdxes) {
                    const candData = await contract.getCandidate(voteData.candIdxes[i]);
                    await candMgr.setCandidateCount(candData.candIdx, candData.voteCnt);
                }
            }
        }
    }
}

module.exports = CrawlerServer;
