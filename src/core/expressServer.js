/**
 * server.js
 * Last modified: 2021.11.18
 * Author: Lee Hong Jun (arcane22, hong3883@naver.com)
 * Description: Web server based on express module
 */

/* Web Server Modules */
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const nunjucks = require('nunjucks');

/* Security & auth modules */
const helmet = require('helmet');
const hpp = require('hpp');
const passport = require('passport');
const passportConfig = require('@src/passport/passportConfig');

/* Util modules */
const path = require('path');
const logger = require('@src/utils/logger');

/* Routers */
const authRouter = require('@src/routes/authRouter');
const voteRouter = require('@src/routes/voteRouter');
const uploadRouter = require('@src/routes/uploadRouter');
const errorRouter = require('@src/routes/errorRouter');

/* Variables */
const expressPort = process.env.EXPRESS_PORT;

/**
 * @class ExpressServer
 * @description Web server class based on express module
 */
class ExpressServer {
    /**
     * @function constructor
     * @description Constructor of class.
     */
    constructor() {
        this.app = null;
    }

    /**
     * @function init
     * @description Initialize the express app.
     *
     * @param {string} type Type of express server. express, http -> not secure, https, http2 -> secure
     */
    init(type) {
        let secure = false;
        if (type === 'https' || type === 'http2') secure = true;

        // create express app instance
        this.app = express();
        this.app.set('port', process.env.EXPRESS_PORT);

        // nunjucks settings
        this.app.set('view engine', 'html');
        nunjucks.configure('views', {
            express: this.app,
            watch: true,
        });

        // security middlewares
        if (process.env.NODE_ENV === 'production') {
            this.app.use(morgan('combined'));
            this.app.use(helmet({ contentSecurityPolicy: false }));
            this.app.use(hpp());
        } else {
            this.app.use(morgan('dev'));
        }

        // default middlewares
        this.app.use(cors({ origin: true, credentials: true })); // Cross-Origin-Resource-Sharing (CORS)
        this.app.use('/', express.static(path.resolve('public')));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(cookieParser(process.env.COOKIE_SECRET));
        this.app.use(
            session({
                resave: false,
                saveUninitialized: false,
                secret: process.env.COOKIE_SECRET,
                cookie: {
                    httpOnly: !secure,
                    secure,
                    maxAge: 1000 * 60 * 60 * 24, // 1day (24 hours)
                },
                name: 'session-cookie',
            }),
        );

        // redirect http -> https
        if (secure) {
            this.app.enable('trust proxy');
            this.app.use('/', (req, res, next) => {
                if (req.secure) {
                    // https
                    next();
                } else {
                    // redirect http -> https
                    res.redirect(`https://${req.headers.host}${req.url}`);
                }
            });
        }

        // passport middlewares
        passportConfig.init();
        this.app.use(passport.initialize());
        this.app.use(passport.session());

        // routers
        this.app.use('/auth', authRouter);
        this.app.use('/vote', voteRouter);
        this.app.use('/upload', uploadRouter);
        this.app.use(errorRouter);
    }

    /**
     * @function run
     * @description Run the express server.
     */
    run() {
        if (this.app === null) throw new Error('Need to initialize the express server.');

        this.app.listen(expressPort, () => {
            logger.info(`Express server running on port [${expressPort}]`);
        });
    }
}

/* Export the class as module. */
module.exports = ExpressServer;
