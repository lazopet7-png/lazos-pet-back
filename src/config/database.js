// 🗄️ CONFIGURACIÓN MEJORADA DE BASE DE DATOS
// src/config/database.js
// ===================================

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('🔄 Conectando a MongoDB...');
    
    // Configuración optimizada para MongoDB Atlas (corregida)
    const options = {
      // Mantener los datos de Pets aislados aunque la URI no incluya una base.
      dbName: process.env.MONGODB_DB_NAME || 'lazos-pet',

      // Timeouts más largos
      serverSelectionTimeoutMS: 20000, // 20 segundos
      socketTimeoutMS: 45000,          // 45 segundos
      connectTimeoutMS: 20000,         // 20 segundos
      
      // Configuración de familia de IP (fuerza IPv4)
      family: 4,
      
      // Configuración de heartbeat
      heartbeatFrequencyMS: 10000,
      
      // Configuración de reintento y pool
      retryWrites: true,
      maxPoolSize: 10,
      minPoolSize: 5,
    };
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, options);
    
    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
    console.log(`📊 Base de datos: ${conn.connection.name}`);
    console.log(`🚀 Configuración: Timeouts 20s + IPv4 (optimizada para servidor completo)`);
    
    // Event listeners mejorados para monitorear la conexión
    mongoose.connection.on('error', (err) => {
      console.error('❌ Error de MongoDB:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB desconectado');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconectado');
    });
    
    mongoose.connection.on('connecting', () => {
      console.log('🔗 Conectando a MongoDB...');
    });
    
    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('📴 MongoDB desconectado debido a terminación de app');
      process.exit(0);
    });
    
    return conn;
    
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error.message);
    console.log('💡 Sugerencia: Verifica que 0.0.0.0/0 esté en IP Access List de Atlas');
    
    // No terminar el proceso en desarrollo para permitir reconexión
    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 Modo desarrollo: servidor continuará sin BD');
      return null;
    } else {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
