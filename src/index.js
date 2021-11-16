/**
 * index.js
 * Last modified: 2021.10.13
 * Author: Lee Hong Jun
 * Description: Web server entry point.
 */

/* Modules */

require('module-alias/register');
const HttpServer = require('@src/core/httpServer');
const HttpsServer = require('@src/core/httpsServer');
const CrawlerServer = require('@src/core/crawlerServer');
const ExpressServer = require('@src/core/expressServer');

const contract = require('@src/blockchain/contract');

const database = require('@src/database/database');
const logger = require('@src/utils/logger');

const httpServer = new HttpServer();
const httpsServer = new HttpsServer();
const crawlerServer = new CrawlerServer();
const expressServer = new ExpressServer();

/**
 * @async @function runService
 * @description Initialize the HTTP, HTTPS server and run it.
 *
 * @example
 * In window powershell,
 * yarn http -> run http server
 * yarn https -> run https server
 * yarn crawler -> run crawler server
 */

async function runService() {
    try {
        // Slice the command (argv[0] argv[1] / argv[2] ...)
        const cmd = process.argv.slice(2).toString();
        const secure = cmd === 'https' ? true : false;
        switch (cmd) {
            case 'http':
            case 'https':
                expressServer.init(secure);
                httpServer.init(expressServer);
                httpServer.run();
                if (secure) {
                    httpsServer.init(expressServer);
                    httpsServer.run();
                }
                break;

            case 'crawler':
                await crawlerServer.run();
                break;
        }

        await database.init(false, false);
        contract.init();
    } catch (err) {
        logger.error(err);
    }
}

runService();
