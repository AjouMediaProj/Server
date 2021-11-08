/**
 * uploadMiddleware.js
 * Last modified: 2021.11.03
 * Author: Lee Hong Jun (arcane22, hong3883@naver.com)
 * Description: Various middleware callbacks used in Express server are defined.
 */

/* Modules */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const multerS3 = require('multer-s3');
const express = require('express');
const AWS = require('aws-sdk');

/* Utils */
const moment = require('moment');
const logger = require('@src/utils/logger');

/**
 * @class UploadMiddleware
 * @description
 */
class UploadMiddleware {
    constructor() {
        // local uploader (local storage)
        this.localUploader = multer({
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

        // aws uploader (s3)
        this.awsUploader = multer({
            storage: multerS3({
                s3: new AWS.S3(),
                bucket: `${process.env.S3_BUCKET_NAME}`,
                key(req, file, cb) {
                    cb(null, `original/${Date.now()}${path.basename(file.originalname)}`);
                },
            }),
            limits: { fieldSize: 5 * 1024 * 1024 },
        });

        this.initLocalDir('/uploads');
        this.initAWS();
    }

    initLocalDir(dirname) {
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

    uploadPage(req, res) {
        res.sendFile(path.resolve('views/multipart.html'));
    }

    uploadToLocal(req, res) {
        logger.info(req.files, req.body);
        res.send('ok');
    }

    uploadToAWS(req, res) {
        logger.info(req.file);
        res.json({ url: req.file.location });
    }
}

/* Export instance as module */
module.exports = new UploadMiddleware();
