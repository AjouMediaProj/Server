/**
 * errorRouter.js
 * Last modified: 2021.10.16
 * Author: Lee Hong Jun (arcane22, hong3883@naver.com)
 * Description: Express router related to error.
 */

/* Modules */
const express = require('express');
const middlewares = require('@src/routes/middlewares');

const router = express.Router();

// Excuted all requests: Make 404 Error.
router.use(middlewares.makeError);

// Excuted all requests: Show Error to client.
router.use(middlewares.showError);

/* Export the router as module */
module.exports = router;
