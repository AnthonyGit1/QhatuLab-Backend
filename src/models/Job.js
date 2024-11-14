const mongoose = require('mongoose');
const { 
    TIPOS_DISCAPACIDAD, 
    MODALIDADES_TRABAJO, 
    TIPOS_CONTRATO, 
    NIVELES_EDUCACION, 
    RANGOS_SALARIO,
    HABILIDADES,
    AREAS_TRABAJO,
    REGIONES_PERU 
} = require('../utils/constants');

const jobSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: [true, 'El título del puesto es requerido']
    },
    empresa: {
        nombre: {
            type: String,
            required: [true, 'El nombre de la empresa es requerido']
        },
        descripcion: String
    },
    descripcion: {
        type: String,
        required: [true, 'La descripción del puesto es requerida']
    },
    requisitos: {
        habilidades: [{
            type: String,
            enum: HABILIDADES
        }],
        educacion: {
            nivel: {
                type: String,
                enum: NIVELES_EDUCACION,
                required: true
            }
        },
        experienciaMinima: {
            type: Number,
            default: 0
        },
        tiposDiscapacidadAceptados: [{
            type: String,
            enum: TIPOS_DISCAPACIDAD,
            required: true
        }]
    },
    condicionesLaborales: {
        modalidad: {
            type: String,
            enum: MODALIDADES_TRABAJO,
            required: true
        },
        tipoContrato: {
            type: String,
            enum: TIPOS_CONTRATO,
            required: true
        },
        ubicacion: {
            region: {
                type: String,
                enum: REGIONES_PERU,
                required: true
            },
            provincia: {
                type: String,
                required: true
            },
            distrito: {
                type: String,
                required: true
            }
        },
        rangoSalarial: {
            type: String,
            enum: RANGOS_SALARIO,
            required: true
        }
    },
    area: {
        type: String,
        enum: AREAS_TRABAJO,
        required: true
    },
    beneficios: [String],
    accesibilidad: {
        tieneAdaptaciones: {
            type: Boolean,
            default: false
        },
        descripcionAdaptaciones: String
    },
    activo: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Job', jobSchema);