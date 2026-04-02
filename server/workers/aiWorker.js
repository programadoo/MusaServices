import { Worker } from 'bullmq';
import { replicate, supabase } from '../config/services.js';
import Generation from '../models/Generation.js';
import User from '../models/User.js';
import axios from 'axios';

const connection = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
};

const aiWorker = new Worker('ai-tasks', async (job) => {
  const { personUri, garmentUri, garmentDescription, category, userId } = job.data;

  try {
    console.log(`🎨 Procesando Try-On para el usuario: ${userId}`);

    // 1. Llamada a Replicate (La parte que más tarda)
    const prediction = await replicate.predictions.create({
      version: "0513734a452173b8173e907e3a59d19a36266e55b48528559432bd21c7d7e985",
      input: { human_img: personUri, garm_img: garmentUri, garment_des: garmentDescription, category, is_checked: true }
    });

    const result = await replicate.wait(prediction);
    const replicateUrl = Array.isArray(result.output) ? result.output[0] : result.output;

    // 2. Descarga y subida a Supabase
    const imgRes = await axios.get(replicateUrl, { responseType: 'arraybuffer' });
    const fileName = `musa_${userId}_${Date.now()}.png`;
    
    await supabase.storage.from('musa-designs').upload(fileName, Buffer.from(imgRes.data), { contentType: 'image/png' });
    const { data: { publicUrl } } = supabase.storage.from('musa-designs').getPublicUrl(fileName);

    // 3. Guardar en MongoDB
    const newGen = new Generation({ 
      userId, personImage: personUri, garmentImage: garmentUri, resultImage: publicUrl, category, description: garmentDescription 
    });
    await newGen.save();

    console.log(`✅ Generación exitosa para Job ${job.id}`);
    return { imageUrl: publicUrl };

  } catch (error) {
    console.error(`❌ Error en el Worker (Job ${job.id}):`, error.message);
    
    // Devolvemos los créditos si falla (Opcional, podrías manejarlo aquí)
    await User.findByIdAndUpdate(userId, { $inc: { credits: 1 } });
    throw error; 
  }
}, { connection });

export default aiWorker;