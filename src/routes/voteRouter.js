/**
 * voteRouter.js
 * Last modified: 2021.11.03
 * Author: Lee Hong Jun (arcane22, hong3883@naver.com)
 * Description: Express router related to authentication.
 */

/* Modules */
const express = require('express');
const passport = require('passport');
const VoteMiddleware = require('@src/routes/middlewares/voteMiddleware');

/* Router */
const router = express.Router();

/** Process the Vote Page **/

/* GET */
// '/vote/list': vote list request.
router.get('/list', VoteMiddleware.getVoteList);

/* POST */

/* Export the router as module */
module.exports = router;
