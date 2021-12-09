/**
 * errorRouter.js
 * Last modified: 2021.12.10
 * Author: Lee Hong Jun (arcane22, hong3883@naver.com)
 * Description: Entry express router
 */

/* Modules */
const express = require('express');
const utilsMiddleware = require('@root/src/routes/middlewares/utilsMiddleware');

/* Router */
const router = express.Router();

/* All Requests */
router.use(utilsMiddleware.entryMiddleware);

/* Export the router as module */
module.exports = router;
