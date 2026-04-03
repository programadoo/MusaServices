import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, unique: true, required: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  credits: { type: Number, default: 0, min: 0 }, 

  // Configuración explícita para evitar errores de búsqueda
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String, index: true }, // Indexamos para búsquedas rápidas
  
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);