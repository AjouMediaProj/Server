/**
 * mailer.js
 * Last modified: 2021.10.04
 * Author: Lee Hong Jun
 * Description: mailer.js can be used to send e-mail to users.
 */

/* Modules */
const moment = require('moment');
const ejs = require('ejs');
const nodeMailer = require('nodemailer');
const path = require('path');
const utility = require('./utility');

/* config */
const config = require('../config/config');

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
            const mail = await ejs.renderFile(path.join(__dirname, '/authMail.ejs'), data);
            this.sendMail(dest, 'Block chain vote service authentication code', mail);
        } catch (error) {
            console.error(error);
        }
    }
}

/* Export the class as module */
module.exports = new Mailer();
