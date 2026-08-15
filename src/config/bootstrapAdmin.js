const User = require('../models/User');

const bootstrapAdmin = async () => {
  if (process.env.ADMIN_BOOTSTRAP_ENABLED !== 'true') {
    return { status: 'disabled' };
  }

  const nombre = process.env.ADMIN_NAME?.trim();
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const plan = process.env.ADMIN_PLAN || 'basico';

  const missing = [
    ['ADMIN_NAME', nombre],
    ['ADMIN_EMAIL', email],
    ['ADMIN_PASSWORD', password]
  ].filter(([, value]) => !value).map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(`Configuración de admin incompleta. Faltan: ${missing.join(', ')}`);
  }

  if (password.length < 12) {
    throw new Error('ADMIN_PASSWORD debe tener al menos 12 caracteres');
  }

  if (!['basico', 'premium'].includes(plan)) {
    throw new Error('ADMIN_PLAN debe ser basico o premium');
  }

  const existingAdmin = await User.findOne({ email });

  if (existingAdmin) {
    console.log('ℹ️ El administrador inicial ya existe; no se modificó su contraseña');
    return { status: 'exists' };
  }

  await User.create({
    nombre,
    email,
    password,
    plan,
    isActive: true
  });

  console.log('✅ Administrador inicial creado correctamente');
  return { status: 'created' };
};

module.exports = bootstrapAdmin;
