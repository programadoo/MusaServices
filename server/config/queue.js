import { Queue } from 'bullmq';
import { Redis } from 'ioredis';

const redisUrl = process.env.REDIS_URL;

// Creamos la conexión de forma explícita para evitar que BullMQ use el default
const connection = redisUrl 
  ? new Redis(redisUrl, {
      maxRetriesPerRequest: null,
      // Esto es clave para Render:
      tls: redisUrl.includes('red-') ? { rejectUnauthorized: false } : undefined 
    })
  : new Redis({
      host: '127.0.0.1',
      port: 6379,
      maxRetriesPerRequest: null
    });

export const aiQueue = new Queue('ai-tasks', { connection });

console.log("🔍 Diagnóstico de Redis:");
console.log("- Fuente:", redisUrl ? "Variable REDIS_URL detectada" : "Usando Localhost");
if (redisUrl) console.log("- URL Parcial:", redisUrl.substring(0, 15) + "...");

connection.on('connect', () => console.log('✅ ioredis: Conexión establecida con éxito.'));
connection.on('error', (err) => console.error('❌ ioredis: Error de conexión:', err.message));

console.log('📦 Cola BullMQ inicializada en Musa AI');