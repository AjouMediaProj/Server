/**
 * server.js
 * Last modified: 2021.10.04
 * Author: Lee Hong Jun
 * Description: express web server
 */

require('module-alias/register');

/* Express Modules */
const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const nunjucks = require('nunjucks');
const passport = require('passport');
const cors = require('cors');

/* Security modules */
const dotenv = require('dotenv');
const helmet = require('helmet');
const hpp = require('hpp');

/* Util modules */
const path = require('path');
const util = require('util');
const logger = require('../utils/logger');

/* Routers */
const pageRouter = require('../routes/page');
const authRouter = require('../routes/auth');
const { sequelize } = require('../models');

/* config */
const passportConfig = require('../passport');
dotenv.config();
passportConfig();

/**
 * @class Server
 * @description express web server
 */
class Server {
    /**
     * @function constructor
     * @description Constructor of class
     */
    constructor() {
        // express app settings
        this.app = express();
        this.app.set('port', process.env.PORT);

        // nunjucks settings
        this.app.set('view engine', 'html');
        nunjucks.configure('views', {
            express: this.app,
            watch: true,
        });

        // connect to db
        sequelize
            .sync({ force: false })
            .then(() => {
                logger.info('# successfully connect to database');
            })
            .catch((err) => {
                logger.error(err);
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
        this.app.use(cors({ origin: true, credentials: true }));
        this.app.use('/', express.static(path.join(__dirname, 'public')));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(cookieParser(process.env.COOKIE_SECRET));
        this.app.use(
            session({
                resave: false,
                saveUninitialized: false,
                secret: process.env.COOKIE_SECRET,
                cookie: {
                    httpOnly: true,
                    secure: false,
                },
                name: 'session-cookie',
            }),
        );

        // passport middlewares
        this.app.use(passport.initialize());
        this.app.use(passport.session());

        // routers
        this.app.use('/', pageRouter);
        this.app.use('/auth', authRouter);

        // error middleware
        this.app.use((req, res, next) => {
            const error = new Error('404 - Not Found');
            error.status = 404;
            console.log(`There is no router: ${req.method}, ${req.url}`);
            next(error);
        });
        this.app.use((err, req, res, next) => {
            res.locals.message = err.message;
            res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
            res.status(err.status || 500);
            res.render('error');
        });
    }

    run() {
        this.app.listen(process.env.PORT, () => {
            logger.info(`# Listening at port: [${process.env.PORT}]`);
        });
    }
}

/* Export the class as module */
module.exports = Server;
