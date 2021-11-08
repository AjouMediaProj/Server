/**
 * HttpServer.js
 * Last modified: 2021.10.13
 * Author: Lee Hong Jun
 * Description: HTTP server based on express module.
 */

/* Modules */
const http = require('http');

/* Utils */
const logger = require('@src/utils/logger');

/**
 * @class HttpServer
 * @description
 */
class HttpServer {
    constructor() {
        this.httpServer = null;
    }

    init(expressServer) {
        if (expressServer === null) throw new Error('Required express server instance.');
        if (expressServer.app === null) throw new Error('Required express app instance.');

        this.httpServer = http.createServer(expressServer.app);
    }

    run() {
        if (this.httpServer === null) throw new Error('Need to initialize the httpServer first.');

        this.httpServer.listen(process.env.EXPRESS_PORT, () => {
            logger.info(`Http Server running on port: ${process.env.EXPRESS_PORT}`);
        });
    }
}

module.exports = HttpServer;
