import { replicate, supabase } from '../config/services.js';
import User from '../models/User.js';
import Generation from '../models/Generation.js';
import { optimizeImage } from '../utils/imageHelper.js'; // La crearemos en el siguiente paso
import { performance } from 'perf_hooks';
import axios from 'axios';

export const handleTryOn = async (req, res) => {
  let user = null;
  let fileName = null; 
  try {
    const { personUri, garmentUri, garmentDescription, category } = req.body;
    const userId = req.user.id;

    user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado." });
    if (user.credits <= 0) return res.status(403).json({ error: "Créditos insuficientes." });

    const [pOpt, gOpt] = await Promise.all([
      optimizeImage(personUri, "Foto de persona"),
      optimizeImage(garmentUri, "Foto de prenda")
    ]);

    user.credits -= 1;
    await user.save();

    const prediction = await replicate.predictions.create({
      version: "0513734a452173b8173e907e3a59d19a36266e55b48528559432bd21c7d7e985",
      input: { human_img: pOpt, garm_img: gOpt, garment_des: garmentDescription, category, is_checked: true }
    });

    const result = await replicate.wait(prediction);
    const replicateUrl = Array.isArray(result.output) ? result.output[0] : result.output;

    const imgRes = await axios.get(replicateUrl, { responseType: 'arraybuffer' });
    fileName = `musa_${userId}_${Date.now()}.png`;
    
    await supabase.storage.from('musa-designs').upload(fileName, Buffer.from(imgRes.data), { contentType: 'image/png' });
    const { data: { publicUrl } } = supabase.storage.from('musa-designs').getPublicUrl(fileName);

    const newGen = new Generation({ 
      userId, personImage: pOpt, garmentImage: gOpt, resultImage: publicUrl, category, description: garmentDescription 
    });
    await newGen.save();

    res.json({ image: publicUrl, remainingCredits: user.credits });
  } catch (error) {
    if (user) { user.credits += 1; await user.save(); }
    res.status(500).json({ error: "Fallo en el motor de IA." });
  }
};

export const getHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    if (req.user.id !== userId) return res.status(403).json({ error: "Acceso denegado." });
    const history = await Generation.find({ userId }).sort({ createdAt: -1 }).limit(50);
    res.json(history);
  } catch (error) { 
    res.status(500).json({ error: "No se pudo recuperar el historial." }); 
  }
};

export const deleteHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const gen = await Generation.findById(id);
    if (!gen || gen.userId.toString() !== req.user.id) return res.status(403).json({ error: "No autorizado." });
    
    // Eliminamos la imagen de Supabase para no ocupar espacio basura
    const fileNameToDelete = gen.resultImage.split('/').pop();
    await supabase.storage.from('musa-designs').remove([fileNameToDelete]);
    
    // Eliminamos el registro de MongoDB
    await Generation.findByIdAndDelete(id);
    res.json({ message: "Registro eliminado correctamente." });
  } catch (error) { 
    res.status(500).json({ error: "Error al eliminar el registro." }); 
  }
};