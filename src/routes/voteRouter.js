/**
 * voteRouter.js
 * Last modified: 2021.11.03
 * Author: Lee Hong Jun (arcane22, hong3883@naver.com)
 * Description: Express router related to authentication.
 */

/* Modules */
const express = require('express');
const passport = require('passport');
const authMiddleware = require('@src/routes/middlewares/authMiddleware');
const voteMiddleware = require('@src/routes/middlewares/voteMiddleware');

/* Router */
const router = express.Router();

/** Process the Vote Page **/

/* GET */

/* POST */
router.post('/getVoteList', voteMiddleware.getVoteList);
router.post('/addVote', authMiddleware.isNotSignedIn, voteMiddleware.addVote);
router.post('/addCandidate', authMiddleware.isNotSignedIn, voteMiddleware.addCandidate);
router.post('/vote', authMiddleware.isNotSignedIn, voteMiddleware.vote);
router.post('/getVoteOverview', authMiddleware.isNotSignedIn, voteMiddleware.getVoteOverview);
router.post('/decodeVoteReceipt', authMiddleware.isNotSignedIn, voteMiddleware.decodeVoteReceipt);

/* Export the router as module */
module.exports = router;
