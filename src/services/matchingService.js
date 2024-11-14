const { generatePrediction } = require('../config/ai');
const Job = require('../models/Job');
const Candidate = require('../models/Candidate');

class MatchingService {
    static async calculateCompatibility(candidate, job) {
        try {
            console.log('Iniciando cálculo de compatibilidad...');
            
            const prompt = `
            Analiza la compatibilidad entre un candidato y una oferta de trabajo para personas con discapacidad y responde SOLO con un JSON válido, nada más.

            CANDIDATO:
            - Discapacidad: ${candidate.datosPersonales.tipoDiscapacidad}
            - Habilidades: ${candidate.habilidades.join(', ')}
            - Experiencia: ${JSON.stringify(candidate.experiencia)}
            - Educación: ${candidate.educacion.nivel}
            - Preferencias: 
                * Modalidad: ${candidate.preferenciasLaborales.modalidad}
                * Tipo Contrato: ${candidate.preferenciasLaborales.tipoContrato}
                * Salario Esperado: ${candidate.preferenciasLaborales.expectativaSalarial}
                * Ubicación: ${candidate.datosPersonales.ubicacion.region}

            TRABAJO:
            - Título: ${job.titulo}
            - Discapacidades aceptadas: ${job.requisitos.tiposDiscapacidadAceptados.join(', ')}
            - Habilidades requeridas: ${job.requisitos.habilidades.join(', ')}
            - Educación requerida: ${job.requisitos.educacion.nivel}
            - Experiencia mínima: ${job.requisitos.experienciaMinima} años
            - Condiciones:
                * Modalidad: ${job.condicionesLaborales.modalidad}
                * Tipo Contrato: ${job.condicionesLaborales.tipoContrato}
                * Salario: ${job.condicionesLaborales.rangoSalarial}
                * Ubicación: ${job.condicionesLaborales.ubicacion.region}

            RESPONDE SOLO CON ESTE JSON:
            {
                "score": [número del 0 al 100],
                "razones_match": [lista de razones positivas],
                "consideraciones": [lista de posibles desafíos],
                "sugerencias_adaptacion": [lista de sugerencias]
            }`;

            const systemPrompt = "Eres un experto en inclusión laboral. IMPORTANTE: Responde ÚNICAMENTE con un JSON válido, sin texto adicional ni explicaciones.";

            const output = await generatePrediction(prompt, systemPrompt);
            
            // Unir todas las partes de la respuesta
            const jsonStr = Array.isArray(output) ? output.join('') : output;
            
            // Intentar encontrar el JSON válido en la respuesta
            const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('No se encontró un JSON válido en la respuesta');
            }

            // Parsear solo la parte JSON
            const result = JSON.parse(jsonMatch[0]);
            
            // Validar que el resultado tenga la estructura esperada
            if (!result.score || !Array.isArray(result.razones_match)) {
                throw new Error('El JSON no tiene la estructura esperada');
            }

            return result;

        } catch (error) {
            console.error('Error en calculateCompatibility:', error);
            // Retornar un resultado por defecto en caso de error
            return {
                score: 50,
                razones_match: ["Evaluación por defecto debido a error en IA"],
                consideraciones: ["Se requiere revisión manual"],
                sugerencias_adaptacion: ["Contactar al equipo de RRHH para evaluación detallada"]
            };
        }
    }

    static async findMatchesForCandidate(candidateId) {
        try {
            const candidate = await Candidate.findById(candidateId);
            if (!candidate) throw new Error('Candidato no encontrado');

            // Obtener trabajos activos que cumplan con criterios básicos
            const jobs = await Job.find({
                activo: true,
                'requisitos.tiposDiscapacidadAceptados': candidate.datosPersonales.tipoDiscapacidad,
                'condicionesLaborales.modalidad': candidate.preferenciasLaborales.modalidad
            });

            console.log(`Encontrados ${jobs.length} trabajos potenciales`);

            const matches = await Promise.all(
                jobs.map(async (job) => {
                    const compatibility = await this.calculateCompatibility(candidate, job);
                    return {
                        job,
                        compatibilityScore: compatibility.score,
                        analysis: compatibility
                    };
                })
            );

            // Ordenar por puntaje de compatibilidad
            return matches.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
        } catch (error) {
            console.error('Error en findMatchesForCandidate:', error);
            throw error;
        }
    }

    static async findMatchesForJob(jobId) {
        try {
            const job = await Job.findById(jobId);
            if (!job) throw new Error('Trabajo no encontrado');

            // Obtener candidatos que cumplan con criterios básicos
            const candidates = await Candidate.find({
                'datosPersonales.tipoDiscapacidad': { $in: job.requisitos.tiposDiscapacidadAceptados },
                'preferenciasLaborales.modalidad': job.condicionesLaborales.modalidad
            });

            const matches = await Promise.all(
                candidates.map(async (candidate) => {
                    const compatibility = await this.calculateCompatibility(candidate, job);
                    return {
                        candidate,
                        compatibilityScore: compatibility?.score || 0,
                        analysis: compatibility
                    };
                })
            );

            // Ordenar por puntaje de compatibilidad
            return matches.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
        } catch (error) {
            console.error('Error en búsqueda de matches:', error);
            throw error;
        }
    }
}

module.exports = MatchingService;