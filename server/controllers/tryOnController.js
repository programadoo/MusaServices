import { aiQueue } from '../config/queue.js';
import User from '../models/User.js';
import Generation from '../models/Generation.js';
import { supabase } from '../config/services.js';
import { optimizeImage } from '../utils/imageHelper.js';

export const handleTryOn = async (req, res) => {
  let user = null;
  try {
    const { personUri, garmentUri, garmentDescription, category } = req.body;
    const userId = req.user.id;

    // 1. Validaciones iniciales
    user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado." });
    if (user.credits <= 0) return res.status(403).json({ error: "Créditos insuficientes." });

    // 2. Optimización (se mantiene aquí porque es rápida y necesaria antes de encolar)
    const [pOpt, gOpt] = await Promise.all([
      optimizeImage(personUri, "Foto de persona"),
      optimizeImage(garmentUri, "Foto de prenda")
    ]);

    // 3. Descontar créditos preventivamente
    user.credits -= 1;
    await user.save();

    // 4. ENCOLAR TAREA EN BULLMQ
    // Pasamos todos los datos necesarios para que el Worker haga el resto
    const job = await aiQueue.add('tryon-job', {
      userId,
      personUri: pOpt,
      garmentUri: gOpt,
      garmentDescription,
      category
    }, {
      attempts: 2, // Si falla la API de Replicate, reintenta 1 vez
      backoff: 5000 // Espera 5 seg entre reintentos
    });

    // 5. Respuesta inmediata al cliente
    res.status(202).json({ 
      message: "Procesando en los servidores de Villatech...", 
      jobId: job.id, 
      remainingCredits: user.credits 
    });

  } catch (error) {
    console.error("Error en handleTryOn:", error);
    if (user) { 
      user.credits += 1; 
      await user.save(); 
    }
    res.status(500).json({ error: "No se pudo iniciar el proceso de IA." });
  }
};

// --- NUEVA FUNCIÓN: CONSULTAR ESTADO ---
export const getJobStatus = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await aiQueue.getJob(jobId);

    if (!job) return res.status(404).json({ error: "Tarea no encontrada." });

    const state = await job.getState(); // completed, failed, active, waiting
    const progress = job.progress;
    const result = job.returnvalue; // Aquí estará el publicUrl enviado por el Worker

    res.json({ state, progress, result });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener estado." });
  }
};

// --- HISTORIAL (Se mantiene igual) ---
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
    
    const fileNameToDelete = gen.resultImage.split('/').pop();
    await supabase.storage.from('musa-designs').remove([fileNameToDelete]);
    
    await Generation.findByIdAndDelete(id);
    res.json({ message: "Registro eliminado correctamente." });
  } catch (error) { 
    res.status(500).json({ error: "Error al eliminar el registro." }); 
  }
};