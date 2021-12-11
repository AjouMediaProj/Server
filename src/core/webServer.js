/**
 * webServer.js
 * Last modified: 2021.11.18
 * Author: Lee Hong Jun (arcane22, hong3883@naver.com)
 * Description: Web server based on http, https, http2 module
 */

/* Node modules */
require('dotenv').config();
const fs = require('fs');
const http = require('http');
const https = require('https');
const http2 = require('http2');
const http2Express = require('http2-express-bridge');

/* Custom modules */
const ExpressServer = require('@src/core/expressServer');
const logger = require('@src/utils/logger');

/* Variables */
const httpPort = process.env.HTTP_PORT;
const httpsPort = process.env.HTTPS_PORT;

/**
 * @class WebServer
 * @description Web server based on http, https, http2 module
 */
class WebServer {
    /**
     * @constructor
     * @param {ExpressServer} expressServer
     * @description Initialize the WebServer class properties.
     */
    constructor() {
        this.httpServer = null;
        this.httpsServer = null;
        this.http2Server = null;
    }

    /**
     * @function init
     * @param {ExpressServer} expressServer Instance of ExpressServer class. (Have to initialize the expressServer instance first.)
     * @param {string} type Type of web server ex) 'http', 'https', 'http2', 'express'
     * @description Run the web server.
     */
    init(expressServer, type) {
        if (expressServer === null || expressServer === undefined) throw new Error('ExpressServer is null or undefined');
        if (expressServer.app === null || expressServer.app === undefined) throw new Error('ExpressServer app is null or undefined');

        switch (type) {
            case 'http':
                this.httpServer = http.createServer(expressServer.app);
                break;

            case 'https':
                const httpsOpts = {
                    cert: fs.readFileSync('', 'utf8'),
                    key: fs.readFileSync('', 'utf8'),
                    ca: fs.readFileSync('', 'utf8'),
                };

                this.httpsServer = https.createServer(httpsOpts, expressServer.app);
                break;

            case 'http2':
                const http2Opts = {
                    cert: fs.readFileSync('', 'utf8'),
                    key: fs.readFileSync('', 'utf8'),
                    ca: fs.readFileSync('', 'utf8'),
                    allowHTTP1: true,
                };

                const http2ExiressBride = http2Express(expressServer.app);
                this.http2Server = http2.createSecureServer(http2Opts, http2ExiressBride);
                break;

            default:
                throw new Error('Undefined Server Type');
        }
    }

    /**
     * @function run
     * @param {string} type Type of web server ex) 'http', 'https', 'http2', 'express'
     * @description Run the web server.
     */
    run(type) {
        switch (type) {
            case 'http':
                if (this.httpServer === null) throw new Error('Need to initialize the http server.');

                this.httpServer.listen(httpPort, () => {
                    logger.info(`Http server running on port [${httpPort}]`);
                });
                break;

            case 'https':
                if (this.httpServer === null) throw new Error('Need to initialize the https server.');

                this.httpsServer.listen(httpsPort, () => {
                    logger.info(`Https server running on port [${httpsPort}]`);
                });
                break;

            case 'http2':
                if (this.httpServer === null) throw new Error('Need to initialize the http2 server.');

                this.http2Server.listen(httpsPort, () => {
                    logger.info(`Http2 server running on port [${httpsPort}]`);
                });
                break;

            default:
                throw new Error('Undefined Server Type');
        }
    }
}

/* Export the class as module */
module.exports = WebServer;
