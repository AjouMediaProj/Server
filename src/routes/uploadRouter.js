/* Modules */
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const multerS3 = require('multer-s3');
const express = require('express');
const AWS = require('aws-sdk');

/* Utils */
const moment = require('moment');
const logger = require('@src/utils/logger');

/* Variables */
const router = express.Router();

const localUploader = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, `${dirname}/`);
        },
        filename(req, file, done) {
            const ext = path.extname(file.originalname);
            done(null, `${path.basename(file.originalname, ext)}${Date.now()}${ext}`);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
});

const awsUploader = null;

class UploadRouter {
    constructor() {
        this.multer = null;
        this.router = express.Router();
        this.initAWS();
        this.initUploader('');
    }

    checkDirExist(dirname) {
        try {
            fs.readdirSync(dirname);
        } catch (err) {
            logger.error(`${dirname} directory not exists. Create new directory ${dirname}`);
            fs.mkdirSync(dirname);
        }
    }

    initAWS() {
        AWS.config.update({
            accessKeyId: process.env.S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
            region: 'ap-northeast-2',
        });
    }

    initUploader(dirname) {
        this.upload = multer({
            storage: multer.diskStorage({
                destination(req, file, done) {
                    done(null, `${dirname}/`);
                },
                filename(req, file, done) {
                    const ext = path.extname(file.originalname);
                    done(null, `${path.basename(file.originalname, ext)}${Date.now()}${ext}`);
                },
            }),
            limits: { fileSize: 5 * 1024 * 1024 },
        });

        this.router
            .route('/local')
            .get((req, res) => {
                res.sendFile(path.resolve('views/multipart.html'));
            })
            .post(this.upload.fields([{ name: 'image1' }, { name: 'image2' }]), (req, res) => {
                console.log(req.files, req.body);
                res.send('ok');
            });
    }
}

module.exports = new UploadRouter();
