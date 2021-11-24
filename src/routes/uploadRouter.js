/**
 * uploadRouter.js
 * Last modified: 2021.10.16
 * Author: Lee Hong Jun (arcane22, hong3883@naver.com)
 * Description: Express router related to upload feature.
 */

/* Modules */
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const multerS3 = require('multer-s3');
const express = require('express');
const AWS = require('aws-sdk');
const uploadMiddleware = require('@src/routes/middlewares/uploadMiddleware');
const authMiddleware = require('@src/routes/middlewares/authMiddleware');

/* Utils */
const moment = require('moment');
const logger = require('@src/utils/logger');

/* Variables */
const router = express.Router();

/**
 * Local Uploader
 */

/* GET */

// '/upload/local': Upload test page request. (using the local upload (multer) system.)
router.get('/local', uploadMiddleware.uploadPage);

/* POST */

// '/upload/local': Send file to server (using the local upload (multer) system.)
router.post('/local/sendfile', uploadMiddleware.localUploader.fields([{ name: 'image1' }, { name: 'image2' }]), uploadMiddleware.uploadToLocal);

/**
 * AWS S3 Uploader
 */

/* POST */

// '/upload/single_img': Send a single image file to server (using the aws upload (multer) system.)
router.post('/single_img', uploadMiddleware.awsUploader.single('img'), uploadMiddleware.uploadSingleImgToAWS);

// '/upload/multi_img': Send multi files (two) to server (using the aws upload (multer) system.)
router.post('/multi_img', uploadMiddleware.awsUploader.fields([{ name: 'img1' }, { name: 'img2' }]), uploadMiddleware.uploadMultiImgToAWS);

/* Export the router as module */
module.exports = router;
