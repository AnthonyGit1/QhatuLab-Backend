require('dotenv').config();
const Replicate = require('replicate');

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN
});

async function testReplicate() {
    try {
        console.log('Token configurado:', process.env.REPLICATE_API_TOKEN ? 'Sí' : 'No');
        console.log('Probando conexión con Replicate...');
        
        // Probar con un modelo específico de Llama
        const output = await replicate.run(
            "replicate/llama-2-70b-chat:2796ee9483c3fd7aa2e171d38f4ca12251a30609463dcfd4cd76703f22e96cdf",
            {
                input: {
                    prompt: "Di hola en español",
                    max_tokens: 100,
                    temperature: 0.7,
                    system_prompt: "Eres un asistente amigable que habla español."
                }
            }
        );
        
        console.log('Respuesta de Llama:', output);
        console.log('¡Test completado con éxito!');
        
    } catch (error) {
        console.error('Error detallado:', {
            message: error.message,
            name: error.name,
            stack: error.stack
        });
    }
}

testReplicate();