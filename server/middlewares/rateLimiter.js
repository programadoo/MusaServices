import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import redisClient from '../config/redis.js';

/**
 * CONFIGURACIÓN DE RATE LIMITERS - MUSA ENGINE
 * Implementación profesional con ioredis para persistencia distribuida.
 */

// --- 1. LÍMITE GENERAL PARA LA API ---
export const apiLimiter = rateLimit({
  store: new RedisStore({
    // ioredis usa .call() para ejecutar comandos directos de Redis
    sendCommand: (...args) => redisClient.call(...args),
    prefix: 'musa_api:',
  }),
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, 
  message: { 
    error: "Demasiadas peticiones. Intenta de nuevo en 15 minutos." 
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// --- 2. LÍMITE ESTRICTO PARA AUTH ---
export const authLimiter = rateLimit({
  store: new RedisStore({
    // Usamos el mismo puente .call() para la persistencia en el login
    sendCommand: (...args) => redisClient.call(...args),
    prefix: 'musa_auth:',
  }),
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 20, 
  message: { 
    error: "Demasiados intentos de acceso. Seguridad de Villatech activada. IP bloqueada temporalmente." 
  },
  standardHeaders: true,
  legacyHeaders: false,
});