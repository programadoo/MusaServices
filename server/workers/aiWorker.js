import { Worker } from 'bullmq';
import { Redis } from 'ioredis'; // Importamos Redis para manejar la URL de Render
import { replicate, supabase } from '../config/services.js';
import Generation from '../models/Generation.js';
import User from '../models/User.js';
import axios from 'axios';

// --- CONFIGURACIÓN DE CONEXIÓN ROBUSTA ---
const redisUrl = process.env.REDIS_URL;

const connection = redisUrl 
  ? new Redis(redisUrl, {
      maxRetriesPerRequest: null,
      // Mantenemos la lógica sin TLS que probamos en redis.js para la red interna
      connectTimeout: 10000, 
    })
  : new Redis({
      host: '127.0.0.1',
      port: 6379,
      maxRetriesPerRequest: null
    });

const aiWorker = new Worker('ai-tasks', async (job) => {
    const { personUri, garmentUri, garmentDescription, category, userId } = job.data;

    try {
        console.log(`🎨 [WORKER]: Iniciando Try-On para usuario ${userId} (Job: ${job.id})`);

        // 1. Replicate (AI Inference)
        const prediction = await replicate.predictions.create({
            version: "0513734a452173b8173e907e3a59d19a36266e55b48528559432bd21c7d7e985",
            input: { 
                human_img: personUri, 
                garm_img: garmentUri, 
                garment_des: garmentDescription, 
                category, 
                is_checked: true 
            }
        });

        const result = await replicate.wait(prediction);
        const replicateUrl = Array.isArray(result.output) ? result.output[0] : result.output;

        // 2. Procesamiento de imagen (Axios + Supabase)
        const imgRes = await axios.get(replicateUrl, { responseType: 'arraybuffer' });
        const fileName = `musa_${userId}_${Date.now()}.png`;
        
        const { error: uploadError } = await supabase.storage
            .from('musa-designs')
            .upload(fileName, Buffer.from(imgRes.data), { contentType: 'image/png' });

        if (uploadError) throw new Error(`Error Supabase: ${uploadError.message}`);

        const { data: { publicUrl } } = supabase.storage
            .from('musa-designs')
            .getPublicUrl(fileName);

        // 3. Persistencia en MongoDB
        const newGen = new Generation({ 
            userId, 
            personImage: personUri, 
            garmentImage: garmentUri, 
            resultImage: publicUrl, 
            category, 
            description: garmentDescription 
        });
        await newGen.save();

        console.log(`✅ [WORKER]: Generación completada con éxito para Job ${job.id}`);
        return { imageUrl: publicUrl };

    } catch (error) {
        console.error(`❌ [WORKER_ERROR] (Job ${job.id}):`, error.message);
        
        // Reembolso de créditos en caso de fallo crítico
        await User.findByIdAndUpdate(userId, { $inc: { credits: 1 } });
        throw error; 
    }
}, { connection });

// Manejadores de eventos globales del Worker para debug en Render
aiWorker.on('active', (job) => console.log(`🚀 Job ${job.id} ha comenzado`));
aiWorker.on('completed', (job) => console.log(`✨ Job ${job.id} finalizado`));
aiWorker.on('error', (err) => console.error('🔥 Error crítico en el Worker:', err.message));

export default aiWorker;