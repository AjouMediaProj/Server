/**
 * crawlerServer.js
 * Last modified: 2021.12.02
 * Author: Han Kyu Hyeon
 * Description: Crawling vote contract to sync vote counts.
 */

/* Modules */
const voteMgr = require('@src/database/managers/voteManager');

/* Utils */
const logger = require('@src/utils/logger');

/**
 * @class CrawlerServer
 * @description
 */
class CrawlerServer {
    constructor() {
        this.runGap = 1000; // 1000 ms (1sec)
        this.standardTime = 600; //10 min
    }

    /**
     * @async
     * @function run
     * @description Execute the update method per execTime
     */
    async run() {
        setInterval(async () => {
            try {
                await this.update();
            } catch (err) {
                logger.error(err);
            }
        }, this.runGap);
    }

    /**
     * @async
     * @function update
     * @description Execute the task every this.runGap
     */
    async update() {
        const nowTimestamp = Math.floor(Date.now() / 1000);
        if (nowTimestamp % this.standardTime === 0) {
            const votes = await voteMgr.findValidVotes();
            await voteMgr.syncVotes(votes);
        }
    }
}

/* Export the CrawlerServer class as module */
module.exports = CrawlerServer;
