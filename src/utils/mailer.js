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
const uniqid = require('uniqid');
const nodeMailer = require('nodemailer');

/* Custom modules */
const db = require('@src/database/database2');
const logger = require('@src/utils/logger');
const utility = require('@src/utils/utility');
const encryption = require('@src/utils/encryption');

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
            await this.transporter.sendMail(mailOps);
            this.transporter.close();
        } catch (err) {
            throw err;
        }
    }

    /**
     * @async
     * @function sendResetPwMail
     * @description Send reset password e-mail to destination.
     *
     * @param {string} email Destination for sending authentication e-mail. (ex. user's e-mail address)
     * @param {string} tempPW Temporary password
     * @throws {error}
     * @returns {string} Temporary password
     */
    async sendResetPwMail(email, tempPW) {
        try {
            console.log(path.join(__dirname, '/mails', '/resetpwMail.ejs'));
            const mail = await ejs.renderFile(path.join(__dirname, '/mails', '/resetpwMail.ejs'), { email, tempPW });
            await this.sendMail(email, 'Blote Service (Temporary Password)', mail);

            return tempPW;
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
        let t = null;
        let result = false;
        let queryResult = null;

        try {
            const authCode = utility.createRandomCode(6);
            const expirationDate = moment().add(30, 'minutes').format('YYYY-MM-DD HH:mm:ss');
            const model = await db.getModel('AuthMail');
            const condition = { where: { email } };

            // create or update auth mail
            t = await db.sequelize.transaction();
            if (await model.findOne(condition, t)) {
                // Auth email alreay exist -> update
                queryResult = await model.update({ authCode, expirationDate }, condition, t);
            } else {
                // Auth email doesn't exist -> create
                queryResult = await model.create({ email, authCode, expirationDate }, t);
            }
            await t.commit();

            // send auth mail to client
            if (queryResult) {
                console.log(path.join(__dirname, '/mails', '/authMail.ejs'));
                const mail = await ejs.renderFile(path.join(__dirname, '/mails', '/authMail.ejs'), { email, authCode, expirationDate });
                await this.sendMail(email, 'Blote Service (Authentication Code)', mail);
                result = true;
            }
        } catch (err) {
            logger.error(err);
            await t.rollback();
            throw err;
        }

        return result;
    }

    /**
     * @async @function sendAuthMail_Base
     * @description Send authentication e-mail to destination. (test version)
     *
     * @param {string} email Destination for sending authentication e-mail. (ex. user's e-mail address)
     * @throws {error}
     * @returns {boolean} Result of mailer.
     */
    async sendAuthMail_Base(email) {
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
