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
        console.log(`🎨 [WORKER]: Ejecutando Musa Engine v1.6 para usuario: ${userId}`);

        let finalCategory = category ? category.toLowerCase().trim() : 'tops';
        const dressKeywords = ['vestido', 'dress', 'completo', 'largo', 'enterizo'];
        const isDress = (garmentDescription && dressKeywords.some(k => garmentDescription.toLowerCase().includes(k))) || 
                        ['dress', 'dresses', 'full_body', 'one-piece', 'one_piece'].includes(finalCategory);

        let result;

        // Mapeo exacto de categorías para evitar el Error 422
        let falCategory = "tops";
        if (isDress) {
            falCategory = "one-piece"; // Probamos con el guion medio que es el estándar de Fashn
        } else if (finalCategory === 'lower_body' || finalCategory === 'pantalones' || finalCategory === 'bottoms') {
            falCategory = "bottoms";
        }

        console.log(`🚀 [WORKER]: Enviando a v1.6 con categoría: ${falCategory}`);

        // 1. Inferencia con esquema v1.6 estricto
        result = await fal.subscribe("fal-ai/fashn/tryon/v1.6", {
            input: { 
                human_image_url: personUri, 
                garment_image_url: garmentUri, 
                category: falCategory,
                garment_description: garmentDescription || "fashion item" // Campo extra para evitar 422
            }
        });

        const falImageUrl = result.image.url;

        // 2. Procesamiento y guardado en Supabase
        const imgRes = await axios.get(falImageUrl, { responseType: 'arraybuffer' });
        const fileName = `musa_${userId}_${Date.now()}.png`;
        
        const { error: uploadError } = await supabase.storage
            .from('musa-designs')
            .upload(fileName, Buffer.from(imgRes.data), { contentType: 'image/png' });

        if (uploadError) throw new Error(`Error en Supabase: ${uploadError.message}`);

        const { data: { publicUrl } } = supabase.storage
            .from('musa-designs')
            .getPublicUrl(fileName);

        // 3. Persistencia en MongoDB
        const newGen = new Generation({ 
            userId, 
            personImage: personUri, 
            garmentImage: garmentUri, 
            resultImage: publicUrl, 
            category: isDress ? 'dresses' : finalCategory, 
            description: garmentDescription 
        });
        await newGen.save();

        console.log(`✅ [WORKER]: Generación v1.6 exitosa.`);
        return { imageUrl: publicUrl };

    } catch (error) {
        console.error(`❌ [WORKER_ERROR] (Job ${job.id}):`, error.message);
        // Si el error es 422, el log de abajo te dirá exactamente qué campo falta
        if (error.response && error.response.data) {
            console.error(`Detalle del 422:`, JSON.stringify(error.response.data));
        }
        if (userId) await User.findByIdAndUpdate(userId, { $inc: { credits: 1 } });
        throw error; 
    }
}, { connection });

export default aiWorker;