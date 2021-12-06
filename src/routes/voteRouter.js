/**
 * voteRouter.js
 * Last modified: 2021.11.03
 * Author: Lee Hong Jun (arcane22, hong3883@naver.com)
 * Description: Express router related to authentication.
 */

/* Modules */
const express = require('express');
const authMiddleware = require('@src/routes/middlewares/authMiddleware');
const voteMiddleware = require('@src/routes/middlewares/voteMiddleware');

/* Router */
const router = express.Router();

/** Process the Vote Page **/

/* GET */

/* POST */
router.post('/getVoteList', voteMiddleware.getVoteList);
router.post('/addVote', authMiddleware.isSignedIn, voteMiddleware.addVote);
router.post('/addCandidate', authMiddleware.isSignedIn, voteMiddleware.addCandidate);
router.post('/vote', authMiddleware.isSignedIn, voteMiddleware.vote);
router.post('/getVoteOverview', authMiddleware.isSignedIn, voteMiddleware.getVoteOverview);
router.post('/decodeVoteReceipt', authMiddleware.isSignedIn, voteMiddleware.decodeVoteReceipt);

/* Export the router as module */
module.exports = router;
