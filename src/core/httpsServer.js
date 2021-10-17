/**
 * HttpsServer.js
 * Last modified: 2021.10.13
 * Author: Lee Hong Jun
 * Description: HTTPS server based on express module.
 */

/* Modules */
const https = require('https');

/* Utils */
const fs = require('fs');
const logger = require('@src/utils/logger');

/**
 * @class HttpsServer
 * @description
 */
class HttpsServer {
    constructor() {
        this.httpsServer = null;
    }

    init(expressServer) {
        if (expressServer === null) throw new Error('Required express server instance.');
        if (expressServer.app === null) throw new Error('Required express app instance.');

        const httpsOpts = {
            cert: fs.readFileSync('', 'utf8'),
            key: fs.readFileSync('', 'utf8'),
            ca: fs.readFileSync('', 'utf8'),
        };

        this.httpsServer = https.createServer(httpsOpts, expressServer.app);
    }

    run() {
        if (this.httpsServer === null) throw new Error('Need to initialize the httpsServer first.');

        this.httpsServer.listen(process.env.HTTPS_PORT, () => {
            logger.info(`Https Server running on port: ${process.env.HTTPS_PORT}`);
        });
    }
}

module.exports = HttpsServer;
