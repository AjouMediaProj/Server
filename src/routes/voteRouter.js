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
router.post('/get-vote-list', voteMiddleware.getVoteList);
router.post('/add-vote', authMiddleware.isSignedIn, voteMiddleware.addVote);
router.post('/add-candidate', authMiddleware.isSignedIn, voteMiddleware.addCandidate);
router.post('/update-vote', authMiddleware.isSignedIn, voteMiddleware.updateVote);
router.post('/update-candidate', authMiddleware.isSignedIn, voteMiddleware.updateCandidate);
router.post('/vote', authMiddleware.isSignedIn, voteMiddleware.vote);
router.post('/get-vote-overview', authMiddleware.isSignedIn, voteMiddleware.getVoteOverview);
router.post('/decode-vote-receipt', voteMiddleware.decodeVoteReceipt);

/* Export the router as module */
module.exports = router;
