/**
 * mailer.js
 * Last modified: 2021.09.23
 * Author: Lee Hong Jun
 * Description: mailer.js can be used to send e-mail to users.
 */

/* Modules */
const moment = require('moment');
const ejs = require('ejs');
const nodeMailer = require('nodemailer');
const path = require('path');
const dotenv = require('dotenv');
const utility = require('./utility');

/* Files */
const mailerConfig = require('./mailerConfig.json');
dotenv.config();

/**
 * @class Mailer
 * @description
 */
class Mailer {
    /**
     * @function constructor
     * @description constructor of PromiseManager class
     */
    constructor() {
        this.transporter = nodeMailer.createTransport({
            service: mailerConfig.mailInfo.service,
            host: mailerConfig.mailInfo.host,
            port: mailerConfig.mailInfo.port,
            secure: mailerConfig.mailInfo.secure,
            auth: {
                user: process.env.MAILER_ID,
                pass: process.env.MAILER_PW,
            },
        });
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
            from: process.env.MAILER_ID,
            to: dest,
            subject,
            html,
        };

        try {
            const info = await this.transporter.sendMail(mailOps);
            console.log(info.response);
            this.transporter.close();
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * @async @function sendAuthMail
     * @description send authentication e-mail to destination.
     *
     * @param {string} dest Destination for sending authentication e-mail. (ex. user's e-mail address)
     */
    async sendAuthMail(dest) {
        const code = utility.createRandomCode(6);
        const expirationTime = moment().add(30, 'minutes').format('YYYY-MM-DD HH:mm:ss');

        try {
            const data = { authCode: code, email: dest, expirationTime };
            console.log(__dirname);
            const mail = await ejs.renderFile(path.join(__dirname, '/auth.ejs'), data);
            this.sendMail(dest, 'Block chain vote service authentication code', mail);
        } catch (error) {
            console.error(error);
        }
    }
}

/* Export the class as module */
module.exports = new Mailer();
