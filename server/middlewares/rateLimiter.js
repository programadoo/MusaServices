import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import redisClient from '../config/redis.js';

/**
 * CONFIGURACIÓN DE RATE LIMITERS - MUSA ENGINE (VILLATECH STANDARD)
 * Implementación profesional con ioredis para persistencia distribuida.
 * Este middleware protege la API contra ataques de fuerza bruta y saturación.
 */

// --- 1. LÍMITE GENERAL PARA LA API ---
export const apiLimiter = rateLimit({
  store: new RedisStore({
    /**
     * IMPORTANTE: ioredis usa .call() para ejecutar comandos directos.
     * El operador spread (...) es vital para desestructurar los argumentos.
     */
    sendCommand: (...args) => redisClient.call(...args),
    prefix: 'musa_api:',
  }),
  windowMs: 15 * 60 * 1000, // Ventana de 15 minutos
  max: 100, // Límite de 100 peticiones por IP
  message: { 
    error: "Demasiadas peticiones. Intenta de nuevo en 15 minutos." 
  },
  standardHeaders: true, // Retorna info de límite en los headers 'RateLimit-*'
  legacyHeaders: false, // Desactiva los headers 'X-RateLimit-*' antiguos
});

// --- 2. LÍMITE ESTRICTO PARA AUTH (SEGURIDAD DE VILLATECH) ---
export const authLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redisClient.call(...args),
    prefix: 'musa_auth:',
  }),
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 20, // Solo 20 intentos de login/registro permitidos
  message: { 
    error: "Demasiados intentos de acceso. Seguridad de Villatech activada. IP bloqueada temporalmente." 
  },
  standardHeaders: true,
  legacyHeaders: false,
});