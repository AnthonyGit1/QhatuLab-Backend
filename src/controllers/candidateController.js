const Candidate = require('../models/Candidate');

// @desc    Crear nuevo candidato
// @route   POST /api/candidates
// @access  Public
exports.createCandidate = async (req, res) => {
    try {
        const candidate = await Candidate.create(req.body);
        res.status(201).json({
            success: true,
            data: candidate
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Obtener todos los candidatos
// @route   GET /api/candidates
// @access  Public
exports.getCandidates = async (req, res) => {
    try {
        const candidates = await Candidate.find();
        res.status(200).json({
            success: true,
            count: candidates.length,
            data: candidates
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Obtener un candidato
// @route   GET /api/candidates/:id
// @access  Public
exports.getCandidate = async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.params.id);
        if (!candidate) {
            return res.status(404).json({
                success: false,
                message: 'Candidato no encontrado'
            });
        }
        res.status(200).json({
            success: true,
            data: candidate
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Actualizar candidato
// @route   PUT /api/candidates/:id
// @access  Public
exports.updateCandidate = async (req, res) => {
    try {
        const candidate = await Candidate.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!candidate) {
            return res.status(404).json({
                success: false,
                message: 'Candidato no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            data: candidate
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};