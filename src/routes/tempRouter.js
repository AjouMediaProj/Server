/* Modules */
const express = require('express');
const middlewares = require('@src/routes/middlewares');
const logger = require('@src/utils/logger');

const router = express.Router();

// router.use(middlewares.entryMiddleware);

router.get('/addVote', middlewares.isNotSignedIn, middlewares.addVote);
router.get('/addCandidate', middlewares.isNotSignedIn, middlewares.addCandidate);
router.get('/vote', middlewares.isNotSignedIn, middlewares.vote);
router.get('/getVoteOverview', middlewares.isNotSignedIn, middlewares.getVoteOverview);
router.get('/decodeVoteReceipt', middlewares.isNotSignedIn, middlewares.decodeVoteReceipt);

module.exports = router;
