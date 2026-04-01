import rateLimit from 'express-rate-limit';

// Limite general para la API
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, 
  message: { error: "Demasiadas peticiones. Intenta de nuevo en 15 minutos." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Limite estricto para Auth (Prevención de fuerza bruta)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, 
  message: { error: "Demasiados intentos de acceso. Seguridad de Villatech activada." },
  standardHeaders: true,
  legacyHeaders: false,
});