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
router.post('/add-vote', voteMiddleware.addVote);
router.post('/add-candidate', voteMiddleware.addCandidate);
router.post('/update-vote', voteMiddleware.updateVote);
router.post('/update-candidate', voteMiddleware.updateCandidate);
router.post('/vote', voteMiddleware.vote);
router.post('/get-vote-overview', voteMiddleware.getVoteOverview);
router.post('/decode-vote-receipt', voteMiddleware.decodeVoteReceipt);

/* Export the router as module */
module.exports = router;
