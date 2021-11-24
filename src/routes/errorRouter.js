/**
 * errorRouter.js
 * Last modified: 2021.11.03
 * Author: Lee Hong Jun (arcane22, hong3883@naver.com)
 * Description: Express router related to error.
 */

/* Modules */
const express = require('express');
const utilsMiddleware = require('@root/src/routes/middlewares/utilsMiddleware');

/* Router */
const router = express.Router();

/** Process the Error **/

/* All Requests */
router.use(utilsMiddleware.makeError); // 'Excuted All requests': If the URI resource is not defined on the server, Make 404 Error.
router.use(utilsMiddleware.showError); // 'Excuted all requests': Show Error to client.

/* Export the router as module */
module.exports = router;
