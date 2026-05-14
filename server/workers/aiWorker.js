import { Worker } from 'bullmq';
import { Redis } from 'ioredis';
import { supabase } from '../config/services.js'; // Quitamos replicate de aquí
import Generation from '../models/Generation.js';
import User from '../models/User.js';
import axios from 'axios';
import * as fal from '@fal-ai/serverless-client'; // Importamos la nueva librería

/**
 * CONFIGURACIÓN DE CONEXIÓN - MUSA ENGINE
 * Unificado para evitar errores de ETIMEDOUT en la red interna de Render.
 */
const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

const connection = new Redis(redisUrl, {
    maxRetriesPerRequest: null, // Requerido por BullMQ
    connectTimeout: 10000,       // 10 segundos de margen
});

const aiWorker = new Worker('ai-tasks', async (job) => {
    const { personUri, garmentUri, garmentDescription, category, userId } = job.data;

    try {
        console.log(`🎨 [WORKER]: Procesando Try-On con Fal.ai para usuario: ${userId} (Job: ${job.id})`);

        // 1. Inferencia con Fal.ai (Usamos subscribe que es mejor para tareas en background)
        const result = await fal.subscribe("fal-ai/idm-vton", {
            input: { 
                human_image_url: personUri, 
                garment_image_url: garmentUri, 
                description: garmentDescription || "clothing item", 
                category: category || "upper_body"
            },
            logs: true,
            onQueueUpdate: (update) => {
                if (update.status === "IN_PROGRESS") {
                    console.log(`⏳ [WORKER]: Fal.ai está procesando el Job ${job.id}...`);
                }
            }
        });

        // Fal.ai devuelve la URL de la imagen generada aquí
        const falImageUrl = result.image.url;

        // 2. Procesamiento de imagen y almacenamiento en Supabase
        const imgRes = await axios.get(falImageUrl, { responseType: 'arraybuffer' });
        const fileName = `musa_${userId}_${Date.now()}.png`;
        
        const { error: uploadError } = await supabase.storage
            .from('musa-designs')
            .upload(fileName, Buffer.from(imgRes.data), { contentType: 'image/png' });

        if (uploadError) throw new Error(`Error en Supabase: ${uploadError.message}`);

        const { data: { publicUrl } } = supabase.storage
            .from('musa-designs')
            .getPublicUrl(fileName);

        // 3. Persistencia en base de datos (MongoDB)
        const newGen = new Generation({ 
            userId, 
            personImage: personUri, 
            garmentImage: garmentUri, 
            resultImage: publicUrl, 
            category, 
            description: garmentDescription 
        });
        await newGen.save();

        console.log(`✅ [WORKER]: Generación exitosa para Job ${job.id}`);
        return { imageUrl: publicUrl };

    } catch (error) {
        console.error(`❌ [WORKER_ERROR] (Job ${job.id}):`, error.message);
        
        // Reembolso preventivo de créditos en caso de fallo técnico
        if (userId) {
            await User.findByIdAndUpdate(userId, { $inc: { credits: 1 } });
        }
        throw error; 
    }
}, { connection });

// --- MONITOREO DE EVENTOS ---
aiWorker.on('active', (job) => console.log(`🚀 [WORKER]: Iniciando Job ${job.id}`));
aiWorker.on('completed', (job) => console.log(`✨ [WORKER]: Job ${job.id} finalizado con éxito`));
aiWorker.on('error', (err) => console.error('🔥 [WORKER_FATAL]: Error en la instancia del Worker:', err.message));

export default aiWorker;