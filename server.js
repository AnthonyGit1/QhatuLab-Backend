const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./src/config/database');

// Load env vars - añadir el path explícito
dotenv.config({ path: './.env' });

// Verificar variables de entorno
console.log('Verificando variables de entorno:');
console.log('PORT:', process.env.PORT);
console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('REPLICATE_API_TOKEN:', process.env.REPLICATE_API_TOKEN ? 'Configurado' : 'No configurado');

// Si no hay token, terminar el proceso
if (!process.env.REPLICATE_API_TOKEN) {
    console.error('REPLICATE_API_TOKEN no está configurado. Por favor, verifica tu archivo .env');
    process.exit(1);
}

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'Bienvenido a la API de Inclusión Laboral' });
});

// Routes
const candidateRoutes = require('./src/routes/candidateRoutes');
const jobRoutes = require('./src/routes/jobRoutes');
const matchRoutes = require('./src/routes/matchRoutes');

app.use('/api/candidates', candidateRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/match', matchRoutes);

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});