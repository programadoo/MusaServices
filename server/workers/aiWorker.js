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
        console.log(`🎨 [WORKER]: Procesando Try-On para usuario: ${userId} (Job: ${job.id})`);

        let finalCategory = category ? category.toLowerCase().trim() : 'upper_body';
        const dressKeywords = ['vestido', 'dress', 'completo', 'largo', 'enterizo'];
        const isDress = (garmentDescription && dressKeywords.some(k => garmentDescription.toLowerCase().includes(k))) || 
                        ['dress', 'dresses', 'full_body'].includes(finalCategory);

        let result;

        if (isDress) {
            console.log(`👗 [WORKER]: Vestido detectado. Usando fashn-vton (Full Body).`);
            // FASHN-VTON es el mejor para vestidos en Fal.ai
            result = await fal.subscribe("fal-ai/fashn-vton", {
                input: { 
                    human_image_url: personUri, 
                    garment_image_url: garmentUri, 
                    category: "all" // En fashn-vton 'all' es para cuerpo completo
                }
            });
        } else {
            // IDM-VTON para camisas o pantalones (es más barato y rápido)
            const idmCategory = (finalCategory === 'lower_body' || finalCategory === 'pantalones') ? "Lower body" : "Upper body";
            console.log(`👕 [WORKER]: Usando IDM-VTON para ${idmCategory}.`);
            
            result = await fal.subscribe("fal-ai/idm-vton", {
                input: { 
                    human_image_url: personUri, 
                    garment_image_url: garmentUri, 
                    description: garmentDescription || "clothing item", 
                    category: idmCategory 
                }
            });
        }

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

        console.log(`✅ [WORKER]: Generación exitosa para Job ${job.id}`);
        return { imageUrl: publicUrl };

    } catch (error) {
        console.error(`❌ [WORKER_ERROR] (Job ${job.id}):`, error.message);
        if (userId) await User.findByIdAndUpdate(userId, { $inc: { credits: 1 } });
        throw error; 
    }
}, { connection });

export default aiWorker;