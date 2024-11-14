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

const candidateSchema = new mongoose.Schema({
    datosPersonales: {
        nombres: {
            type: String,
            required: [true, 'Los nombres son requeridos']
        },
        apellidos: {
            type: String,
            required: [true, 'Los apellidos son requeridos']
        },
        edad: {
            type: Number,
            required: [true, 'La edad es requerida']
        },
        ubicacion: {
            region: {
                type: String,
                enum: REGIONES_PERU,
                required: [true, 'La región es requerida']
            },
            provincia: {
                type: String,
                required: [true, 'La provincia es requerida']
            },
            distrito: {
                type: String,
                required: [true, 'El distrito es requerido']
            }
        },
        email: {
            type: String,
            required: [true, 'El email es requerido'],
            unique: true,
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Por favor ingrese un email válido']
        },
        linkedin: String,
        telefono: {
            type: String,
            required: [true, 'El teléfono es requerido']
        },
        tipoDiscapacidad: {
            type: String,
            enum: TIPOS_DISCAPACIDAD,
            required: [true, 'El tipo de discapacidad es requerido']
        }
    },
    experiencia: [{
        area: {
            type: String,
            enum: AREAS_TRABAJO,
            required: true
        },
        años: {
            type: Number,
            required: true
        }
    }],
    educacion: {
        nivel: {
            type: String,
            enum: NIVELES_EDUCACION,
            required: [true, 'El nivel de educación es requerido']
        }
    },
    habilidades: [{
        type: String,
        enum: HABILIDADES
    }],
    preferenciasLaborales: {
        modalidad: {
            type: String,
            enum: MODALIDADES_TRABAJO,
            required: [true, 'La modalidad de trabajo es requerida']
        },
        tipoContrato: {
            type: String,
            enum: TIPOS_CONTRATO,
            required: [true, 'El tipo de contrato es requerido']
        },
        areasInteres: [{
            type: String,
            enum: AREAS_TRABAJO
        }],
        expectativaSalarial: {
            type: String,
            enum: RANGOS_SALARIO,
            required: [true, 'La expectativa salarial es requerida']
        }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Candidate', candidateSchema);