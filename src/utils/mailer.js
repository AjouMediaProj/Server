/**
 * mailer.js
 * Last modified: 2021.11.22
 * Author: Lee Hong Jun (arcane22, hong3883@naver.com)
 * Description: mailer.js can be used to send e-mail to users.
 */

/* Modules */
const ejs = require('ejs');
const moment = require('moment');
const nodeMailer = require('nodemailer');
const path = require('path');

/* Custom modules */
const logger = require('@src/utils/logger');
const utility = require('@src/utils/utility');
const encryption = require('@src/utils/encryption');
const db = require('@src/database/database2');
const Type = require('@src/utils/type');

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
     * @async @function sendMail
     * @description send e-mail to destination.
     *
     * @param {string} dest Destination for sending e-mail. (ex. user's e-mail address)
     * @param {string} subject The title of the e-mail.
     * @param {string} html Html page to be displayed in e-mail.
     */
    async sendMail(dest, subject, html) {
        const mailOps = {
            from: config.mailer.auth.user,
            to: dest,
            subject,
            html,
        };

        try {
            const info = await this.transporter.sendMail(mailOps);
            this.transporter.close();
        } catch (err) {
            logger.error(err);
        }
    }

    /**
     * @async @function sendAuthMail
     * @description Send authentication e-mail to destination.
     *
     * @param {string} dest Destination for sending authentication e-mail. (ex. user's e-mail address)
     */
    async sendAuthMail(dest) {
        let result = false;

        try {
            // make auth mail object
            const authMailObj = db.models.AuthMail.makeObject();
            authMailObj.email = dest;
            authMailObj.authCode = utility.createRandomCode(6);
            authMailObj.expirationDate = moment().add(30, 'minutes').format('YYYY-MM-DD HH:mm:ss');

            // make query object
            const q = db.models.AuthMail.makeQuery();
            q.type = Type.queryType.find;
            q.conditions.where = { email: dest };
            q.data = authMailObj;

            if (await db.execQuery(q)) {
                // Auth mail already exist in db. (update it)
                q.type = Type.queryType.update;
            } else {
                // Auth mail doesn't exist in db. (create new one)
                q.type = Type.queryType.create;
            }

            if (await db.execQuery(q)) {
                const mail = await ejs.renderFile(path.join(__dirname, '/authMail.ejs'), authMailObj);
                await this.sendMail(dest, 'Blote authentication code', mail);
                result = true;
            }

            q.type = Type.queryType.find;
            console.log((await db.execQuery(q)).dataValues);
        } catch (err) {
            logger.error(err);
        } finally {
            return result;
        }
    }

    /**
     * @async @function sendAuthMail_test
     * @description Send authentication e-mail to destination. (test version)
     *
     * @param {string} dest Destination for sending authentication e-mail. (ex. user's e-mail address)
     */
    async sendAuthMail_test(dest) {
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
            logger.error(err);
        } finally {
            return result;
        }
    }
}

/* Export the class as module */
module.exports = new Mailer();
