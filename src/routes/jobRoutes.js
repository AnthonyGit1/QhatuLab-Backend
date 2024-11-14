const express = require('express');
const router = express.Router();
const {
    createJob,
    getJobs,
    getJob,
    updateJob,
    deactivateJob
} = require('../controllers/jobController');

router.route('/')
    .get(getJobs)
    .post(createJob);

router.route('/:id')
    .get(getJob)
    .put(updateJob)
    .delete(deactivateJob);

module.exports = router;