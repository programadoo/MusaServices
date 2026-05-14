import { Worker } from 'bullmq';
import { Redis } from 'ioredis';
import { supabase } from '../config/services.js';
import Generation from '../models/Generation.js';
import User from '../models/User.js';
import axios from 'axios';
import * as fal from '@fal-ai/serverless-client';

/**
 * CONFIGURACIÓN DE CONEXIÓN - MUSA ENGINE
 */
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
        let finalDescription = garmentDescription || "clothing item"; 
        
        const dressKeywords = ['vestido', 'dress', 'completo', 'largo', 'enterizo'];
        const isDressByDescription = garmentDescription && dressKeywords.some(keyword => garmentDescription.toLowerCase().includes(keyword));
        const isDressByCategory = finalCategory === 'dress' || finalCategory === 'dresses' || finalCategory === 'full_body';

        let result;

        // --- ENRUTADOR DINÁMICO DE MODELOS ---
        if (isDressByDescription || isDressByCategory) {
            finalCategory = 'dresses'; 
            console.log(`👗 [WORKER]: Vestido detectado. Usando OOT-Diffusion (All Body).`);
            
            // Usamos OOT-Diffusion específicamente para los vestidos
            result = await fal.subscribe("fal-ai/oot-diffusion", {
                input: { 
                    base_image_url: personUri,       // OOT usa base_image_url
                    garment_image_url: garmentUri, 
                    model_type: "full_body",         // Obliga a borrar los pantalones
                    category: "all_body",
                    nsfw_filter: true
                },
                logs: true,
                onQueueUpdate: (update) => {
                    if (update.status === "IN_PROGRESS") console.log(`⏳ [WORKER]: OOT-Diffusion procesando...`);
                }
            });
        } else {
            if (finalCategory === 'lower_body' || finalCategory === 'pantalones' || finalCategory === 'skirt') {
                 finalCategory = 'lower_body';
                 console.log(`👖 [WORKER]: Prenda inferior. Usando IDM-VTON.`);
            } else {
                finalCategory = 'upper_body';
                console.log(`👕 [WORKER]: Prenda superior. Usando IDM-VTON.`);
            }

            // Usamos IDM-VTON para el resto de la ropa
            result = await fal.subscribe("fal-ai/idm-vton", {
                input: { 
                    human_image_url: personUri,      // IDM usa human_image_url
                    garment_image_url: garmentUri, 
                    description: finalDescription, 
                    category: finalCategory 
                },
                logs: true,
                onQueueUpdate: (update) => {
                    if (update.status === "IN_PROGRESS") console.log(`⏳ [WORKER]: IDM-VTON procesando...`);
                }
            });
        }

        // Fal.ai devuelve la URL de la imagen
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
            category: finalCategory, 
            description: garmentDescription 
        });
        await newGen.save();

        console.log(`✅ [WORKER]: Generación exitosa para Job ${job.id}`);
        return { imageUrl: publicUrl };

    } catch (error) {
        console.error(`❌ [WORKER_ERROR] (Job ${job.id}):`, error.message);
        if (userId) {
            await User.findByIdAndUpdate(userId, { $inc: { credits: 1 } });
        }
        throw error; 
    }
}, { connection });

aiWorker.on('active', (job) => console.log(`🚀 [WORKER]: Iniciando Job ${job.id}`));
aiWorker.on('completed', (job) => console.log(`✨ [WORKER]: Job ${job.id} finalizado`));
aiWorker.on('error', (err) => console.error('🔥 [WORKER_FATAL]: Error:', err.message));

export default aiWorker;