import { Redis } from 'ioredis';

/**
 * CONFIGURACIÓN DE REDIS PRINCIPAL - MUSA AI
 * Unificado con ioredis para compatibilidad total con BullMQ en Render.
 */

const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

// Detectamos si es el entorno de Render (usualmente las URLs contienen 'red-')
const isProduction = redisUrl.includes('red-');

const redisClient = new Redis(redisUrl, {
    // Configuración vital para evitar conflictos con colas de BullMQ
    maxRetriesPerRequest: null,
    
    // Seguridad TLS: Obligatorio para servicios Key Value en Render
    tls: isProduction ? { rejectUnauthorized: false } : undefined,
    
    // Estrategia de reintento inteligente para no tumbar el servidor
    retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        if (times > 10) {
            console.error('❌ [REDIS_FATAL]: Se agotaron los reintentos de conexión.');
            return null; // Deja de reintentar para no saturar el log
        }
        return delay;
    }
});

// Monitoreo de conexión
redisClient.on('connect', () => {
    console.log(`🚀 [REDIS_SYSTEM]: Conectado exitosamente en modo ${isProduction ? 'PRODUCCIÓN' : 'LOCAL'}`);
});

redisClient.on('error', (err) => {
    // Si el error menciona localhost en producción, algo anda mal con la variable de entorno
    if (err.message.includes('ECONNREFUSED') && isProduction) {
        console.error('❌ [REDIS_ERROR]: Error de conexión. Verifica la REDIS_URL en Render.');
    } else {
        console.error('❌ [REDIS_ERROR]:', err.message);
    }
});

export default redisClient;