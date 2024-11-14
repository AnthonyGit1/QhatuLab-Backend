const express = require('express');
const router = express.Router();
const {
    createCandidate,
    getCandidates,
    getCandidate,
    updateCandidate
} = require('../controllers/candidateController');

router.route('/')
    .get(getCandidates)
    .post(createCandidate);

router.route('/:id')
    .get(getCandidate)
    .put(updateCandidate);

module.exports = router;