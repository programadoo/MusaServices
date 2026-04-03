import { aiQueue } from '../config/queue.js';
import User from '../models/User.js';
import Generation from '../models/Generation.js';
import { supabase } from '../config/services.js';
import { optimizeImage } from '../utils/imageHelper.js';

/**
 * Inicia el proceso de Try-On encolando la tarea en BullMQ.
 * @route POST /api/try-on
 * @access Private
 */
export const handleTryOn = async (req, res) => {
  let user = null;
  let creditsDeducted = false;

  try {
    const { personUri, garmentUri, garmentDescription, category } = req.body;
    const userId = req.user.id;

    // 1. Validaciones de Negocio
    user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado." });
    
    if (user.credits <= 0) {
      return res.status(403).json({ 
        error: "Créditos insuficientes para generar la imagen.",
        code: "INSUFFICIENT_CREDITS"
      });
    }

    // 2. Optimización Pre-Vuelo (Necesaria para no saturar Redis/Worker)
    const [pOpt, gOpt] = await Promise.all([
      optimizeImage(personUri, "Foto de persona"),
      optimizeImage(garmentUri, "Foto de prenda")
    ]);

    // 3. Acreditación Atómica Preventiva
    // Descontamos antes de encolar para evitar ataques de doble gasto
    user.credits -= 1;
    await user.save();
    creditsDeducted = true;

    // 4. Encolar en el ecosistema BullMQ
    const job = await aiQueue.add('tryon-job', {
      userId,
      personUri: pOpt,
      garmentUri: gOpt,
      garmentDescription,
      category
    }, {
      attempts: 2,           // Si falla la API de Replicate, el Worker reintenta
      backoff: 5000,         // 5 segundos entre reintentos
      removeOnComplete: true // Limpiar Redis al terminar (mantiene la memoria optimizada)
    });

    // 5. Respuesta 202 (Accepted)
    res.status(202).json({ 
      message: "Procesando en los servidores de Villatech...", 
      jobId: job.id, 
      remainingCredits: user.credits 
    });

  } catch (error) {
    console.error("🚨 [ERROR_TRYON_CONTROLLER]:", error);
    
    // Rollback de créditos si el encolamiento falló
    if (user && creditsDeducted) { 
      user.credits += 1; 
      await user.save(); 
    }

    res.status(500).json({ 
      error: "No se pudo iniciar el motor de IA. Intente más tarde.",
      code: "AI_ENGINE_INIT_FAILURE"
    });
  }
};

/**
 * Consulta el progreso y estado de una tarea específica.
 * @route GET /api/try-on/status/:jobId
 */
export const getJobStatus = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await aiQueue.getJob(jobId);

    if (!job) return res.status(404).json({ error: "Tarea no encontrada o expirada." });

    const state = await job.getState(); // completed, failed, active, waiting
    const progress = job.progress;
    const result = job.returnvalue; // Aquí llega la URL de Supabase desde el Worker
    const failedReason = job.failedReason;

    res.json({ 
      state, 
      progress, 
      result,
      error: state === 'failed' ? failedReason : null
    });
  } catch (error) {
    console.error("Error al obtener estado del Job:", error);
    res.status(500).json({ error: "Error al consultar el servidor de colas." });
  }
};

/**
 * Recupera el historial de diseños generados del usuario.
 * @route GET /api/try-on/history/:userId
 */
export const getHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Protección de privacidad
    if (req.user.id !== userId) return res.status(403).json({ error: "Acceso denegado." });

    // Seguridad: Excluimos el campo __v interno de MongoDB
    const history = await Generation.find({ userId })
      .select('-__v')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(history);
  } catch (error) { 
    res.status(500).json({ error: "Error al recuperar el historial de Musa AI." }); 
  }
};

/**
 * Elimina un registro del historial y su imagen asociada en Supabase.
 * @route DELETE /api/try-on/history/:id
 */
export const deleteHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const gen = await Generation.findById(id);

    if (!gen || gen.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: "No autorizado para eliminar este recurso." });
    }
    
    // 1. Extraer nombre de archivo para borrar en Supabase
    const fileNameToDelete = gen.resultImage.split('/').pop();
    await supabase.storage.from('musa-designs').remove([fileNameToDelete]);
    
    // 2. Eliminar de la base de datos
    await Generation.findByIdAndDelete(id);
    
    res.json({ message: "Diseño eliminado con éxito." });
  } catch (error) { 
    console.error("Error en eliminación:", error);
    res.status(500).json({ error: "Error al limpiar el registro." }); 
  }
};