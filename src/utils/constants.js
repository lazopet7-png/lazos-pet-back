module.exports = {
  // 📊 PLANES Y LÍMITES
  PLANS: {
    BASICO: {
      name: 'basico',
      limits: {
        fotos: parseInt(process.env.BASIC_MAX_PHOTOS) || 50,
        videos: parseInt(process.env.BASIC_MAX_VIDEOS) || 10,
        almacenamiento: (parseInt(process.env.BASIC_MAX_STORAGE_MB) || 500) * 1024 * 1024, // bytes
        biografia: 5000,
        secciones: parseInt(process.env.BASIC_MAX_SECTIONS) || 5
      }
    },
    PREMIUM: {
      name: 'premium',
      limits: {
        fotos: parseInt(process.env.PREMIUM_MAX_PHOTOS) || 100,
        videos: parseInt(process.env.PREMIUM_MAX_VIDEOS) || 20,
        almacenamiento: (parseInt(process.env.PREMIUM_MAX_STORAGE_MB) || 1024) * 1024 * 1024, // bytes
        biografia: 10000,
        secciones: parseInt(process.env.PREMIUM_MAX_SECTIONS) || 10
      }
    }
  },

  // 📱 TIPOS DE QR
  QR_TYPES: {
    PROFILE: 'profile',
    EVENT: 'event',
    GALLERY: 'gallery'
  },

  // 📋 SECCIONES DISPONIBLES PARA DASHBOARD
  SECCIONES_DISPONIBLES: [
    'biografia',
    'galeria_fotos',
    'videos_memoriales',
    'cronologia',
    'testimonios',
    'logros',
    'hobbies',
    'frases_celebres',
    'datos_curiosos',
    'condolencias'
  ],

  // 📄 FORMATOS DE ARCHIVO PERMITIDOS
  FORMATOS_PERMITIDOS: {
    fotos: ['jpg', 'jpeg', 'png', 'webp'],
    videos: ['mp4'],
    audio: ['mp3', 'wav', 'ogg', 'm4a']
  },

  // 📏 LÍMITES DE ARCHIVO
  FILE_LIMITS: {
    FOTO_MAX_SIZE: (parseInt(process.env.MAX_PHOTO_SIZE_MB) || 5) * 1024 * 1024, // 5MB
    VIDEO_MAX_SIZE: (parseInt(process.env.MAX_FILE_SIZE_MB) || 100) * 1024 * 1024, // 100MB
    AUDIO_MAX_SIZE: (parseInt(process.env.MAX_AUDIO_SIZE_MB) || 20) * 1024 * 1024, // 20MB
    QR_IMAGE_SIZE: parseInt(process.env.QR_IMAGE_SIZE) || 512,
    QR_IMAGE_QUALITY: parseFloat(process.env.QR_IMAGE_QUALITY) || 0.92
  },

  // 🔐 CONFIGURACIÓN DE SEGURIDAD
  SECURITY: {
    BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS) || 12,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
    RATE_LIMIT_WINDOW: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 min
    RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
  },

  // 🌐 URLs
  URLS: {
    FRONTEND: process.env.FRONTEND_URL || 'http://localhost:5173',
    QR_BASE: process.env.QR_BASE_URL || 'http://localhost:5173/memorial'
  },

  // 📊 ESTADOS DE PROCESAMIENTO
  PROCESSING_STATUS: {
    PENDING: 'procesando',
    COMPLETED: 'completado',
    ERROR: 'error'
  },

  // 🎨 CONFIGURACIÓN DE DASHBOARD
  DASHBOARD_THEMES: {
    CLASICO: 'clasico',
    MODERNO: 'moderno',
    ELEGANTE: 'elegante'
  },

  // 📝 MENSAJES DE RESPUESTA
  MESSAGES: {
    SUCCESS: {
      USER_CREATED: 'Usuario registrado exitosamente',
      LOGIN_SUCCESS: 'Login exitoso',
      PROFILE_CREATED: 'Memorial creado exitosamente',
      QR_GENERATED: 'Código QR generado exitosamente',
      PROFILE_UPDATED: 'Memorial actualizado',
      PROFILE_DELETED: 'Memorial eliminado'
    },
    ERROR: {
      USER_EXISTS: 'El email ya está registrado',
      INVALID_CREDENTIALS: 'Credenciales inválidas',
      USER_NOT_FOUND: 'Usuario no encontrado',
      PROFILE_NOT_FOUND: 'Memorial no encontrado',
      QR_NOT_FOUND: 'Código QR no válido',
      UNAUTHORIZED: 'No autorizado',
      INVALID_FILE_TYPE: 'Tipo de archivo no permitido',
      FILE_TOO_LARGE: 'Archivo demasiado grande',
      PLAN_LIMIT_REACHED: 'Límite del plan alcanzado'
    }
  }
};
