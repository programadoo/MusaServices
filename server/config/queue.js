import { Queue } from 'bullmq';
import redisClient from './redis.js'; // Reutilizamos tu conexión existente

// Definimos la configuración de conexión para BullMQ
const connection = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
};

// Creamos la cola para tareas de IA (Generación de imágenes/texto)
export const aiQueue = new Queue('ai-tasks', { connection });

console.log('📦 Cola BullMQ inicializada en Musa AI');