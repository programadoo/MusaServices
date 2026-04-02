import { createClient } from 'redis';

const redisClient = createClient({
    // Si usas Docker o un servicio externo, aquí va la URL. 
    // Por defecto es redis://localhost:6373
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.error('❌ Redis Client Error', err));
redisClient.on('connect', () => console.log('🚀 Conectado a Redis en Musa Core'));

// Conectamos de inmediato
await redisClient.connect();

export default redisClient;