import { Worker } from 'bullmq';
import { Redis } from 'ioredis';
import { supabase } from '../config/services.js';
import Generation from '../models/Generation.js';
import User from '../models/User.js';
import axios from 'axios';
import * as fal from '@fal-ai/serverless-client';

const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
const connection = new Redis(redisUrl, {
    maxRetriesPerRequest: null, 
    connectTimeout: 10000,      
});

const aiWorker = new Worker('ai-tasks', async (job) => {
    const { personUri, garmentUri, garmentDescription, category, userId } = job.data;

    try {
        console.log(`🎨 [WORKER]: Iniciando Musa Engine v1.6 para usuario: ${userId}`);

        // 1. IDENTIFICACIÓN DE PRENDA
        let finalCategory = category ? category.toLowerCase().trim() : 'upper_body';
        const dressKeywords = ['vestido', 'dress', 'completo', 'largo', 'enterizo'];
        const isDress = (garmentDescription && dressKeywords.some(k => garmentDescription.toLowerCase().includes(k))) || 
                        ['dress', 'dresses', 'full_body', 'one-piece'].includes(finalCategory);

        let result;

        if (isDress) {
            console.log(`👗 [WORKER]: Ejecutando Fashn v1.6 (Modo Cuerpo Completo)`);
            // Usamos el endpoint específico que me pasaste
            result = await fal.subscribe("fal-ai/fashn/tryon/v1.6", {
                input: { 
                    human_image_url: personUri, 
                    garment_image_url: garmentUri, 
                    category: "one-piece" // Categoría obligatoria para vestidos en v1.6
                }
            });
        } else {
            // Mapeo de categorías para prendas normales
            const fashnCategory = (finalCategory === 'lower_body' || finalCategory === 'pantalones') ? "bottoms" : "tops";
            console.log(`👕 [WORKER]: Ejecutando Fashn v1.6 para ${fashnCategory}`);
            
            result = await fal.subscribe("fal-ai/fashn/tryon/v1.6", {
                input: { 
                    human_image_url: personUri, 
                    garment_image_url: garmentUri, 
                    category: fashnCategory 
                }
            });
        }

        const falImageUrl = result.image.url;

        // 2. PROCESAMIENTO Y STORAGE (Supabase)
        const imgRes = await axios.get(falImageUrl, { responseType: 'arraybuffer' });
        const fileName = `musa_${userId}_${Date.now()}.png`;
        
        const { error: uploadError } = await supabase.storage
            .from('musa-designs')
            .upload(fileName, Buffer.from(imgRes.data), { contentType: 'image/png' });

        if (uploadError) throw new Error(`Error en Supabase: ${uploadError.message}`);

        const { data: { publicUrl } } = supabase.storage
            .from('musa-designs')
            .getPublicUrl(fileName);

        // 3. PERSISTENCIA (MongoDB)
        const newGen = new Generation({ 
            userId, 
            personImage: personUri, 
            garmentImage: garmentUri, 
            resultImage: publicUrl, 
            category: isDress ? 'dresses' : finalCategory, 
            description: garmentDescription 
        });
        await newGen.save();

        console.log(`✅ [WORKER]: Generación v1.6 exitosa para Job ${job.id}`);
        return { imageUrl: publicUrl };

    } catch (error) {
        console.error(`❌ [WORKER_ERROR] (Job ${job.id}):`, error.message);
        if (userId) await User.findByIdAndUpdate(userId, { $inc: { credits: 1 } });
        throw error; 
    }
}, { connection });

// --- MONITOREO DE EVENTOS ---
aiWorker.on('active', (job) => console.log(`🚀 [WORKER]: Job ${job.id} en marcha`));
aiWorker.on('completed', (job) => console.log(`✨ [WORKER]: Job ${job.id} finalizado con éxito`));
aiWorker.on('error', (err) => console.error('🔥 [WORKER_FATAL]:', err.message));

export default aiWorker;