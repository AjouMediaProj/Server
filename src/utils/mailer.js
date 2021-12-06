/**
 * mailer.js
 * Last modified: 2021.12.06
 * Author: Lee Hong Jun (arcane22, hong3883@naver.com)
 * Description: mailer.js can be used to send e-mail to users.
 */

/* Modules */
const ejs = require('ejs');
const path = require('path');
const moment = require('moment');
const nodeMailer = require('nodemailer');

/* Custom modules */
const db = require('@src/database/database2');
const type = require('@src/utils/type');
const logger = require('@src/utils/logger');
const utility = require('@src/utils/utility');

/* config */
const config = require('@root/config/config');

/**
 * @class Mailer
 * @description
 */
class Mailer {
    /**
     * @function constructor
     * @description constructor of Mailer class (Initialize nodemailer's transporter - read config file)
     */
    constructor() {
        this.transporter = nodeMailer.createTransport(config.mailer);
    }

    /**
     * @async
     * @function sendMail
     * @description send e-mail to destination.
     *
     * @param {string} email Destination for sending e-mail. (ex. user's e-mail address)
     * @param {string} subject The title of the e-mail.
     * @param {string} html Html page to be displayed in e-mail.
     * @throws {error}
     */
    async sendMail(email, subject, html) {
        const mailOps = {
            from: config.mailer.auth.user,
            to: email,
            subject,
            html,
        };

        try {
            const info = await this.transporter.sendMail(mailOps);
            this.transporter.close();
        } catch (err) {
            throw err;
        }
    }

    /**
     * @async
     * @function sendAuthMail
     * @description Send authentication e-mail to destination.
     *
     * @param {string} email Destination for sending authentication e-mail. (ex. user's e-mail address)
     * @throws {error}
     * @returns {number} Result of sending auth mail (http status code)
     */
    async sendAuthMail(email) {
        let result = 0;

        try {
            // make auth mail object
            const authMailObj = type.cloneAccountObject();
            authMailObj.email = email;
            authMailObj.authCode = utility.createRandomCode(6);
            authMailObj.expirationDate = moment().add(30, 'minutes').format('YYYY-MM-DD HH:mm:ss');

            // create or update auth mail
            const q = db.getModel('AuthMail').makeQuery(type.QueryMethods.findOne, authMailObj, { where: { email } });

            if (await db.execQuery(q)) {
                // alreay exist: update
                q.method = type.QueryMethods.update;
            } else {
                // doesn't exist: create
                q.method = type.QueryMethods.create;
            }

            // send auth mail to client
            if (await db.execQuery(q)) {
                const mail = await ejs.renderFile(path.join(__dirname, '/authMail.ejs'), authMailObj);
                await this.sendMail(email, 'Blote authentication code', mail);
                result = type.HttpStatus.OK;
            } else {
                result = type.HttpStatus.BadRequest;
            }
        } catch (err) {
            throw err;
        }

        return result;
    }

    /**
     * @async @function sendAuthMail_test
     * @description Send authentication e-mail to destination. (test version)
     *
     * @param {string} email Destination for sending authentication e-mail. (ex. user's e-mail address)
     * @throws {error}
     * @returns {boolean} Result of mailer.
     */
    async sendAuthMail_test(email) {
        let result = false;

        try {
            const mail = await ejs.renderFile(path.join(__dirname, '/authMail.ejs'), {
                email: dest,
                authCode: utility.createRandomCode(6),
                expirationDate: moment().add(30, 'minutes').format('YYYY-MM-DD HH:mm:ss'),
            });
            await this.sendMail(dest, 'Blote authentication code', mail);
            result = true;
        } catch (err) {
            throw err;
        }

        return result;
    }
}

/* Export the class as module */
module.exports = new Mailer();
