import { Queue } from 'bullmq';
import { Redis } from 'ioredis';

/**
 * CONFIGURACIÓN DE COLA BULLMQ - MUSA AI
 * Sincronizado para conexión interna en Render (Sin TLS).
 */

const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

// Creamos la conexión de forma explícita
const connection = new Redis(redisUrl, {
    // REQUERIDO: BullMQ necesita gestionar sus propios reintentos
    maxRetriesPerRequest: null,
    // Margen de 10 segundos para evitar el ETIMEDOUT
    connectTimeout: 10000,
    // NOTA: Se eliminó el bloque TLS para evitar conflictos en la red de Render
});

// Inicializamos la cola de tareas para la IA
export const aiQueue = new Queue('ai-tasks', { 
    connection,
    defaultJobOptions: {
        attempts: 3, // Reintenta 3 veces si la IA falla
        backoff: {
            type: 'exponential',
            delay: 1000,
        },
        removeOnComplete: true, // Limpia Redis al terminar para ahorrar espacio
    }
});

// --- DIAGNÓSTICOS DE LA COLA ---
console.log("🔍 [QUEUE_CHECK]: Diagnóstico de conexión...");

connection.on('connect', () => {
    console.log('✅ [BULLMQ]: Conexión establecida con éxito en la cola.');
});

connection.on('error', (err) => {
    console.error('❌ [BULLMQ_ERROR]: Fallo en la conexión de la cola:', err.message);
});

console.log('📦 [SYSTEM]: Cola "ai-tasks" inicializada en Musa AI');