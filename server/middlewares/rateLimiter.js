import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import redisClient from '../config/redis.js'; // Asegúrate de haber creado este archivo

// --- 1. LÍMITE GENERAL PARA LA API ---
// Útil para evitar scraping o saturación del servidor
export const apiLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
    prefix: 'musa_api:', // Prefijo para identificar estas keys en Redis
  }),
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, 
  message: { error: "Demasiadas peticiones. Intenta de nuevo en 15 minutos." },
  standardHeaders: true,
  legacyHeaders: false,
});

// --- 2. LÍMITE ESTRICTO PARA AUTH ---
// Prevención de fuerza bruta con persistencia en Redis
export const authLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
    prefix: 'musa_auth:', // Prefijo diferente para no mezclar contadores
  }),
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 20, 
  message: { 
    error: "Demasiados intentos de acceso. Seguridad de Villatech activada. IP bloqueada temporalmente." 
  },
  standardHeaders: true,
  legacyHeaders: false,
});