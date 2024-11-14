const MatchingService = require('../services/matchingService');

exports.getMatchesForCandidate = async (req, res) => {
    try {
        const matches = await MatchingService.findMatchesForCandidate(req.params.candidateId);
        res.status(200).json({
            success: true,
            count: matches.length,
            data: matches
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

exports.getMatchesForJob = async (req, res) => {
    try {
        const matches = await MatchingService.findMatchesForJob(req.params.jobId);
        res.status(200).json({
            success: true,
            count: matches.length,
            data: matches
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};