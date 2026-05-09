import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// 🔍 VERIFICACIÓN CRÍTICA
console.log('=== DIAGNÓSTICO ===');
console.log('PORT:', PORT);
console.log('MONGO_URI existe:', !!MONGO_URI);
console.log('MONGO_URI length:', MONGO_URI ? MONGO_URI.length : 0);
console.log('NODE_ENV:', process.env.NODE_ENV);

if (!MONGO_URI) {
  console.error('❌ ERROR FATAL: MONGO_URI no está definida en las variables de entorno');
  console.error('Variables disponibles:', Object.keys(process.env).filter(k => k.includes('MONGO') || k.includes('MONGODB')));
  process.exit(1);
}

// Muestra primeros 20 caracteres de la URI (sin contraseña)
const safeUriPreview = MONGO_URI.substring(0, MONGO_URI.indexOf('@') > 0 ? MONGO_URI.indexOf('@') : 20);
console.log('URI preview:', safeUriPreview + '...');

mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 30000, // 30 segundos timeout
  connectTimeoutMS: 30000,
})
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    console.error('Error details:', {
      name: err.name,
      message: err.message,
      code: err.code
    });
    process.exit(1);
  });