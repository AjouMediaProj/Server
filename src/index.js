/**
 * index.js
 * Last modified: 2021.11.19
 * Author: Lee Hong Jun (arcane22, hong3883@naver.com)
 * Description: Entry point of web server program.
 */

/* Modules */
require('module-alias/register');
const CrawlerServer = require('@src/core/crawlerServer');
const ExpressServer = require('@src/core/expressServer');
const WebServer = require('@src/core/webServer');

const contract = require('@src/blockchain/contract');
const db = require('@src/database/database2');
const logger = require('@src/utils/logger');

/* Variables */
const expressServer = new ExpressServer();
const webServer = new WebServer();
const crawlerServer = new CrawlerServer();

/**
 * @class WebService
 * @description Entry point of web service
 */
class WebService {
    constructor() {}

    /**
     * @static @async @function runService
     * @description Initialize and run the web server.
     *
     * @example
     * In window powershell,
     * yarn express -> Run web server based on express module. Port (Your Port)
     * yarn http -> Run web server based on express, http module. Port (80)
     * yarn https -> Run web server based on express, https module. Port (443, secure)
     * yarn http2 -> Run web server based on express, http2 module. Port (443, secure)
     * yarn crawler -> Run crawler server
     * yarn test -> Run the test code.
     */
    static async runService(serviceType, serverType) {
        try {
            // Initialize & run the web server
            switch (serviceType) {
                case 'web':
                    expressServer.init(serverType);

                    if (serverType === 'express') {
                        expressServer.run();
                    } else {
                        webServer.init(expressServer, serverType);
                        webServer.run(serverType);
                    }
                    break;

                case 'crawler':
                    await crawlerServer.run();
                    break;

                case 'test':
                    this.test();
                    break;

                default:
                    throw new Error('Undefined Server Type');
            }

            // Initialize the database & contract
            if (serviceType !== 'test') {
                await db.init(false, false);
                contract.init();
            }
        } catch (err) {
            logger.error(err);
        }
    }

    /**
     * @static @async @function test
     * @description Function to test simple code.
     */
    static test() {
        // todo something (test code)
    }
}

/* Run the web service */
const cmd = process.argv.slice(2); // Slice the command (argv[0] argv[1] / argv[2] ...)
const serviceType = cmd[0];
const serverType = cmd[1];

WebService.runService(serviceType, serverType);
