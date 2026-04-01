import express from 'express';
import { 
  register, 
  login, 
  verifyEmail, 
  forgotPassword, 
  resetPassword,
  deleteAccount 
} from '../controllers/authController.js';
import { validateSchema } from '../middlewares/validateZod.js';
import { authLimiter } from '../middlewares/rateLimiter.js';
import { registerSchema, loginSchema } from '../schemas/authSchema.js';

// Importamos tu middleware (usa el nombre que prefieras, aquí le pongo verifyToken)
import verifyToken from '../middlewares/authMiddleware.js'; 

const router = express.Router();

// --- 🔐 REGISTRO Y LOGIN ---
router.post('/register', authLimiter, validateSchema(registerSchema), register);
router.post('/login', authLimiter, validateSchema(loginSchema), login);

// --- 📧 VERIFICACIÓN DE CUENTA ---
router.get('/verify', verifyEmail);

// --- 🔑 RECUPERACIÓN DE CONTRASEÑA ---
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password', resetPassword);

// --- 🛡️ GESTIÓN DE CUENTA (RUTA PROTEGIDA) ---
// Ahora 'req.user.id' estará disponible en deleteAccount gracias a tu middleware
router.delete('/delete-account', verifyToken, deleteAccount);

export default router;