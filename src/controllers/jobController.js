const Job = require('../models/Job');

// @desc    Crear nuevo trabajo
// @route   POST /api/jobs
// @access  Public
exports.createJob = async (req, res) => {
    try {
        const job = await Job.create(req.body);
        res.status(201).json({
            success: true,
            data: job
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Obtener todos los trabajos
// @route   GET /api/jobs
// @access  Public
exports.getJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ activo: true });
        res.status(200).json({
            success: true,
            count: jobs.length,
            data: jobs
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Obtener un trabajo
// @route   GET /api/jobs/:id
// @access  Public
exports.getJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Trabajo no encontrado'
            });
        }
        res.status(200).json({
            success: true,
            data: job
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Actualizar trabajo
// @route   PUT /api/jobs/:id
// @access  Public
exports.updateJob = async (req, res) => {
    try {
        const job = await Job.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Trabajo no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            data: job
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Desactivar trabajo
// @route   DELETE /api/jobs/:id
// @access  Public
exports.deactivateJob = async (req, res) => {
    try {
        const job = await Job.findByIdAndUpdate(
            req.params.id,
            { activo: false },
            {
                new: true,
                runValidators: true
            }
        );

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Trabajo no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            data: job
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};