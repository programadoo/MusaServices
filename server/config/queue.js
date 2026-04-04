import { Queue } from 'bullmq';

// En producción usamos la URL completa, en local el localhost
const connectionUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

export const aiQueue = new Queue('ai-tasks', { 
  connection: connectionUrl 
});

console.log('📦 Cola BullMQ inicializada en Musa AI');