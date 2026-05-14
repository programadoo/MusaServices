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
        console.log(`🎨 [WORKER]: Ejecutando Musa Engine v1.6 (Schema Estricto) para Job ${job.id}`);

        // 1. MAPEÓ DE CATEGORÍAS SEGÚN EL ESQUEMA PROPORCIONADO
        let finalCategory = category ? category.toLowerCase().trim() : 'auto';
        const dressKeywords = ['vestido', 'dress', 'completo', 'largo', 'enterizo'];
        const isDress = (garmentDescription && dressKeywords.some(k => garmentDescription.toLowerCase().includes(k))) || 
                        ['dress', 'dresses', 'full_body', 'one-piece', 'one-pieces'].includes(finalCategory);

        let falCategory = "tops";
        if (isDress) {
            falCategory = "one-pieces"; // Exactamente como dice tu esquema
        } else if (['lower_body', 'pantalones', 'bottoms'].includes(finalCategory)) {
            falCategory = "bottoms";
        }

        // 2. INFERENCIA CON EL ESQUEMA EXACTO (Fashn v1.6)
        const result = await fal.subscribe("fal-ai/fashn/tryon/v1.6", {
            input: { 
                model_image: personUri,    // Según esquema: model_image
                garment_image: garmentUri, // Según esquema: garment_image
                category: falCategory,     // tops, bottoms, one-pieces, auto
                mode: "balanced",
                garment_photo_type: "auto",
                num_samples: 1,
                segmentation_free: true,
                output_format: "png"
            }
        });

        // 3. EXTRACCIÓN DE URL SEGÚN EL ESQUEMA DE SALIDA
        // El esquema dice que devuelve un objeto con una lista "images"
        if (!result.images || result.images.length === 0) {
            throw new Error("No se generaron imágenes en la respuesta de Fal.ai");
        }
        const falImageUrl = result.images[0].url;

        // 4. PROCESAMIENTO Y STORAGE (Axios -> Supabase)
        const imgRes = await axios.get(falImageUrl, { responseType: 'arraybuffer' });
        const fileName = `musa_${userId}_${Date.now()}.png`;
        
        const { error: uploadError } = await supabase.storage
            .from('musa-designs')
            .upload(fileName, Buffer.from(imgRes.data), { contentType: 'image/png' });

        if (uploadError) throw new Error(`Error en Supabase: ${uploadError.message}`);

        const { data: { publicUrl } } = supabase.storage.from('musa-designs').getPublicUrl(fileName);

        // 5. PERSISTENCIA (MongoDB)
        const newGen = new Generation({ 
            userId, 
            personImage: personUri, 
            garmentImage: garmentUri, 
            resultImage: publicUrl, 
            category: falCategory, 
            description: garmentDescription 
        });
        await newGen.save();

        console.log(`✅ [WORKER]: Generación exitosa para Job ${job.id}`);
        return { imageUrl: publicUrl };

    } catch (error) {
        console.error(`❌ [WORKER_ERROR] Job ${job.id}:`, error.message);
        if (userId) await User.findByIdAndUpdate(userId, { $inc: { credits: 1 } });
        throw error; 
    }
}, { connection });

// Monitoreo
aiWorker.on('active', (job) => console.log(`🚀 [WORKER]: Iniciando Job ${job.id}`));
aiWorker.on('completed', (job) => console.log(`✨ [WORKER]: Job ${job.id} finalizado`));

export default aiWorker;