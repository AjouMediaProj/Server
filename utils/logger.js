/**
 * utils.js
 * Last modified: 2021.10.04
 * Author: Lee Hong Jun (Onggae22, hong3883@naver.com)
 * Description: logger.js is used to save server logs.
 */

/* Modules */
const moment = require('moment');
const winston = require('winston');
const path = require('path');
require('winston-daily-rotate-file');
require('dotenv').config();

/* Constants */
const { combine, timestamp, printf, colorize } = winston.format;

/**
 * @class Logger
 * @description
 */
class Logger {
    /**
     * @function constructor
     * @description initialize logger property
     */
    constructor() {
        this.logger = null;
    }

    /**
     * @function makeFormat
     * @description make logger format
     *
     * @returns {winston.Logform.Format}
     */
    makeFormat() {
        return combine(
            timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
            printf((info) => {
                return `${info.timestamp} [${info.level}] : ${info.message}`;
            }),
        );
    }

    /**
     * @function getTransport
     * @description make logger transport
     *
     * @param {string} type Type of transport (ex console, log, error)
     * @returns {winston.transports.ConsoleTransportInstance}
     * @returns {winston.transports.DailyRotateFile}
     * @throws {Invalid Type Error}
     */
    getTransport(type) {
        const isDev = (process.env.NODE_ENV || 'development') === 'development';

        switch (type) {
            case 'console':
                return new winston.transports.Console({
                    format: combine(colorize({ all: true })),
                    handleExceptions: true,
                });

            case 'log':
                return new winston.transports.DailyRotateFile({
                    level: 'debug',
                    datePattern: 'YYYY-MM-DD-HH',
                    dirname: path.resolve('logs'),
                    filename: '%DATE%.log',
                    maxFiles: 30,
                    zippedArchive: false,
                });

            case 'error':
                return new winston.transports.DailyRotateFile({
                    level: 'error',
                    datePattern: 'YYYY-MM-DD-HH',
                    dirname: path.resolve('logs', 'error'),
                    filename: '%DATE%.error.log',
                    maxFiles: 30,
                    zippedArchive: false,
                });

            default:
                throw new Error('Invalid type error');
        }
    }

    /**
     * @function createLogger
     * @description If the logger property is null, create new instance of logger.
     *
     * @param {string} type Type of log (e: error, w: warning, i: info, d: debug, default: debug)
     * @param {string} msg Data to show in log.
     */
    createLogger() {
        if (!this.logger) {
            const isDev = (process.env.NODE_ENV || 'development') === 'development';
            this.logger = winston.createLogger({
                level: isDev ? 'debug' : 'http',
                format: this.makeFormat(),
                transports: [
                    this.getTransport('console'), // console log
                    this.getTransport('log'), // File log (all)
                    this.getTransport('error'), // File log (error)
                ],
            });
        }
    }

    /**
     * @function debug
     * @description logging the message (type: debug)
     *
     * @param {string} msg Data to show in log.
     */
    debug(msg) {
        if (!this.logger) {
            this.createLogger();
        }
        this.logger.debug(typeof msg === 'object' ? JSON.stringify(msg) : msg);
    }

    /**
     * @function info
     * @description logging the message (type: info)
     *
     * @param {string} msg Data to show in log.
     */
    info(msg) {
        if (!this.logger) {
            this.createLogger();
        }
        this.logger.info(typeof msg === 'object' ? JSON.stringify(msg) : msg);
    }

    /**
     * @function warn
     * @description logging the message (type: warn)
     *
     * @param {string} msg Data to show in log.
     */
    warn(msg) {
        if (!this.logger) {
            this.createLogger();
        }
        this.logger.warn(typeof msg === 'object' ? JSON.stringify(msg) : msg);
    }

    /**
     * @function error
     * @description logging the message (type: error)
     *
     * @param {string} msg Data to show in log.
     */
    error(msg) {
        if (!this.logger) {
            this.createLogger();
        }
        this.logger.error(typeof msg === 'object' ? JSON.stringify(msg) : msg);
    }
}

/* Exports */
module.exports = new Logger();
