const express = require('express');
const router = express.Router();
const {
    getMatchesForCandidate,
    getMatchesForJob
} = require('../controllers/matchController');

router.get('/candidate/:candidateId', getMatchesForCandidate);
router.get('/job/:jobId', getMatchesForJob);

module.exports = router;