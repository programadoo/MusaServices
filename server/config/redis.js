import { Redis } from 'ioredis';

/**
 * CONFIGURACIÓN DE REDIS PRINCIPAL - MUSA AI
 * Versión optimizada para la red interna de Render (Sin TLS).
 */

const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

const redisClient = new Redis(redisUrl, {
    // Obligatorio para que BullMQ gestione sus propias colas
    maxRetriesPerRequest: null,
    
    // Tiempo de espera para la conexión inicial (10 segundos)
    connectTimeout: 10000,
    
    // NOTA: Se eliminó el objeto 'tls'. En conexiones internas de Render 
    // no es necesario y suele causar bloqueos de conexión.
    
    retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        if (times > 10) {
            console.error('❌ [REDIS_FATAL]: Se agotaron los reintentos de conexión.');
            return null; 
        }
        return delay;
    }
});

// Eventos de monitoreo
redisClient.on('connect', () => {
    console.log('🚀 [REDIS_SYSTEM]: Conectado exitosamente');
});

redisClient.on('error', (err) => {
    console.error('❌ [REDIS_ERROR]:', err.message);
});

export default redisClient;