const Replicate = require('replicate');

// Verificar token
if (!process.env.REPLICATE_API_TOKEN) {
    throw new Error('REPLICATE_API_TOKEN no está configurado en el archivo .env');
}

// Configuración de Replicate
const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN
});

// Configuración del modelo
const LLAMA_MODEL = "replicate/llama-2-70b-chat:2796ee9483c3fd7aa2e171d38f4ca12251a30609463dcfd4cd76703f22e96cdf";

// Función helper para realizar predicciones
async function generatePrediction(prompt, systemPrompt = "") {
    try {
        const output = await replicate.run(
            LLAMA_MODEL,
            {
                input: {
                    prompt,
                    max_tokens: 1000,
                    temperature: 0.7,
                    system_prompt: systemPrompt
                }
            }
        );
        return output;
    } catch (error) {
        console.error('Error en predicción:', error);
        throw error;
    }
}

module.exports = {
    replicate,
    generatePrediction,
    LLAMA_MODEL
};