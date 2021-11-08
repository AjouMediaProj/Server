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
const ExpressServer = require('@src/core/expressServer');

const contract = require('@src/blockchain/contract');

const database = require('@src/database/database');
const logger = require('@src/utils/logger');

const httpServer = new HttpServer();
const httpsServer = new HttpsServer();
const expressServer = new ExpressServer();

/**
 * @async @function runService
 * @description Initialize the HTTP, HTTPS server and run it.
 *
 * @example
 * In window powershell,
 * yarn http -> run http server
 * yarn https -> run https server
 */

async function runService() {
    try {
        // Slice the command (argv[0] argv[1] / argv[2] ...)
        const secure = process.argv.slice(2).toString() === 'https' ? true : false;
        await database.init(true, false);
        expressServer.init(secure);
        httpServer.init(expressServer);
        httpServer.run();

        contract.init();

        if (secure) {
            httpsServer.init(expressServer);
            httpsServer.run();
        }
    } catch (err) {
        logger.error(err);
    }
}

runService();
