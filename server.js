const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importar configuraciones
const connectDB = require('./src/config/database');

const app = express();

// Conectar a la base de datos (sin crashear si falla)
connectDB().catch(err => {
  console.log('⚠️  Servidor iniciado sin BD. Conéctate después.');
});

// Middlewares básicos
app.use(cors({
  origin: [
    'http://localhost:5173',      // Para desarrollo local
    'http://localhost:5174',      // Para desarrollo local - puerto alternativo
    'http://192.168.1.34:5173',   // Para acceso desde red local (móvil)
    'http://192.168.1.34:5174',   // Para acceso desde red local - puerto alternativo
    process.env.FRONTEND_URL,     // URL del .env
    'https://sistema.pets.lazosdevida.com'
  ].filter(Boolean), // Filtrar valores undefined
  credentials: true
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir archivos estáticos (uploads)
app.use('/uploads', express.static('uploads'));

// Middleware de logging
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.originalUrl} - ${new Date().toISOString()}`);
  next();
});

// Ruta básica de prueba
app.get('/', (req, res) => {
  res.json({ 
    message: '🐾 Lazos de Vida Pets API funcionando!',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/health',
      api: '/api',
      auth: '/api/auth'
    }
  });
});

// Ruta de salud
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString(),
    service: 'Lazos de Vida Pets API',
    environment: process.env.NODE_ENV || 'development',
    database: 'Conectado'
  });
});

// Rutas principales de la API
const routes = require('./src/routes');
app.use('/api', routes);

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
    path: req.originalUrl
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`💚 Salud: http://localhost:${PORT}/health`);
  console.log(`🔐 Auth: http://localhost:${PORT}/api/auth`);
  console.log('🔄 Presiona Ctrl+C para detener');
});

module.exports = app;
