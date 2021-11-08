/**
 * server.js
 * Last modified: 2021.10.13
 * Author: Lee Hong Jun
 * Description: Express web server
 */

/* Web Server Modules */
const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const nunjucks = require('nunjucks');
const cors = require('cors');

/* Security modules */
require('dotenv').config();
const helmet = require('helmet');
const hpp = require('hpp');
const passport = require('passport');
const passportConfig = require('@src/passport/passportConfig');

/* Util modules */
const path = require('path');
const logger = require('@src/utils/logger');

/* Routers */
const pageRouter = require('@src/routes/pageRouter');
const authRouter = require('@src/routes/authRouter');
const voteRouter = require('@src/routes/voteRouter');
const uploadRouter = require('@src/routes/uploadRouter');
const errorRouter = require('@src/routes/errorRouter');
const tempRouter = require('@root/src/routes/tempRouter');

/**
 * @class ExpressServer
 * @description Express web server
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
     * @async @function init
     * @description Initialize the express app.
     *
     * @param {boolean} secure Type of express server. (false: http, true: https)
     * @example
     * const secure = serverType === 'https' ? true : false;
     * const expressServer = new ExpressServer();
     * expressServer.init(secure);
     * ...
     */
    init(secure = false) {
        if (typeof secure !== 'boolean') {
            secure = false;
        }

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
        this.app.use('/', pageRouter);
        this.app.use('/auth', authRouter);
<<<<<<< HEAD
        this.app.use('/upload', uploadRouter.router);
        this.app.use('/temp', tempRouter);
=======
        this.app.use('/upload', uploadRouter);
        this.app.use('/vote', voteRouter);
>>>>>>> develop
        this.app.use(errorRouter);
    }
}

/* Export the class as module. */
module.exports = ExpressServer;
