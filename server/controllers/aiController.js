import { aiQueue } from '../config/queue.js';
import User from '../models/User.js';
import { optimizeImage } from '../utils/imageHelper.js';

export const handleTryOn = async (req, res) => {
  try {
    const { personUri, garmentUri, garmentDescription, category } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user || user.credits <= 0) {
      return res.status(403).json({ error: "Créditos insuficientes o usuario no existe." });
    }

    // Optimización previa (esto es rápido)
    const [pOpt, gOpt] = await Promise.all([
      optimizeImage(personUri, "Foto de persona"),
      optimizeImage(garmentUri, "Foto de prenda")
    ]);

    // Descontamos crédito de una vez
    user.credits -= 1;
    await user.save();

    // MANDAMOS A LA COLA DE BULLMQ
    const job = await aiQueue.add('tryon-job', {
      personUri: pOpt,
      garmentUri: gOpt,
      garmentDescription,
      category,
      userId
    }, { attempts: 2, backoff: 5000 });

    // Respondemos de inmediato
    res.status(202).json({ 
      message: "Proceso iniciado", 
      jobId: job.id, 
      remainingCredits: user.credits 
    });

  } catch (error) {
    res.status(500).json({ error: "No se pudo encolar la petición." });
  }
};