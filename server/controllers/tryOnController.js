import { aiQueue } from '../config/queue.js';
import User from '../models/User.js';
import Generation from '../models/Generation.js';
import { supabase } from '../config/services.js';
import { optimizeImage } from '../utils/imageHelper.js';

/**
 * 🎨 INICIA EL PROCESO DE TRY-ON
 * Encola la tarea y gestiona los créditos del usuario.
 */
export const handleTryOn = async (req, res) => {
  let user = null;
  let creditsDeducted = false;

  try {
    const { personUri, garmentUri, garmentDescription, category } = req.body;
    const userId = req.user.id;

    // 1. Validaciones de Usuario y Créditos
    user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado." });
    
    if (user.credits <= 0) {
      return res.status(403).json({ 
        error: "Créditos insuficientes.",
        code: "INSUFFICIENT_CREDITS"
      });
    }

    // 2. Optimización de imágenes (Evita saturar Redis)
    const [pOpt, gOpt] = await Promise.all([
      optimizeImage(personUri, "Foto de persona"),
      optimizeImage(garmentUri, "Foto de prenda")
    ]);

    // 3. Descuento preventivo de créditos
    user.credits -= 1;
    await user.save();
    creditsDeducted = true;

    /**
     * 4. ENCOLAR EN BULLMQ
     * FIX: Se cambia 'removeOnComplete: true' por un objeto de configuración
     * para mantener el Job en Redis el tiempo suficiente para que el Front lo lea.
     */
    const job = await aiQueue.add('tryon-job', {
      userId,
      personUri: pOpt,
      garmentUri: gOpt,
      garmentDescription,
      category
    }, {
      attempts: 3,           // 3 intentos en caso de que la API externa falle
      backoff: 5000,        // Esperar 5 segundos entre reintentos
      removeOnComplete: {
        age: 3600,          // Mantener el resultado en Redis por 1 hora
        count: 100          // O mantener los últimos 100 trabajos completados
      },
      removeOnFail: {
        age: 86400          // Mantener errores por 24h para auditoría
      }
    });

    // 5. Respuesta Exitosa (202 Accepted)
    res.status(202).json({ 
      message: "Procesando en Musa Engine...", 
      jobId: job.id, 
      remainingCredits: user.credits 
    });

  } catch (error) {
    console.error("🚨 [ERROR_TRYON_CONTROLLER]:", error);
    
    // Rollback de créditos si algo falló antes de entrar a la cola
    if (user && creditsDeducted) { 
      user.credits += 1; 
      await user.save(); 
    }

    res.status(500).json({ 
      error: "No se pudo iniciar el motor de IA.",
      code: "AI_ENGINE_INIT_FAILURE"
    });
  }
};

/**
 * 🔍 CONSULTA EL ESTADO DEL JOB
 * Devuelve el progreso y el resultado final.
 */
export const getJobStatus = async (req, res) => {
  try {
    const { jobId } = req.params;
    
    // Obtenemos el job de la cola aiQueue
    const job = await aiQueue.getJob(jobId);

    // Si el job no existe, devolvemos 404 (ahora tardará más en expirar gracias al fix anterior)
    if (!job) {
      return res.status(404).json({ error: "Tarea no encontrada o expirada en el servidor." });
    }

    const state = await job.getState(); // completed, failed, active, waiting
    const progress = job.progress || 0;
    const rawResult = job.returnvalue; // El valor que devuelve el Worker

    /**
     * FIX DE TIPADO:
     * Estandarizamos el resultado para que el Frontend siempre reciba un objeto { imageUrl }.
     * Esto soluciona la "línea roja" de TypeScript en el Modal.
     */
    let result = null;
    if (state === 'completed' && rawResult) {
      result = typeof rawResult === 'string' ? { imageUrl: rawResult } : rawResult;
    }

    res.json({ 
      state, 
      progress, 
      result,
      error: state === 'failed' ? job.failedReason : null
    });
  } catch (error) {
    console.error("❌ Error al obtener estado del Job:", error);
    res.status(500).json({ error: "Error al consultar el servidor de colas." });
  }
};

/**
 * 📜 HISTORIAL DE DISEÑOS
 */
export const getHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    if (req.user.id !== userId) return res.status(403).json({ error: "No autorizado." });

    const history = await Generation.find({ userId })
      .select('-__v')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(history);
  } catch (error) { 
    res.status(500).json({ error: "Error al recuperar el historial." }); 
  }
};

/**
 * 🗑️ ELIMINAR DISEÑO
 */
export const deleteHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const gen = await Generation.findById(id);

    if (!gen || gen.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: "No autorizado." });
    }
    
    const fileNameToDelete = gen.resultImage.split('/').pop();
    await supabase.storage.from('musa-designs').remove([fileNameToDelete]);
    await Generation.findByIdAndDelete(id);
    
    res.json({ message: "Diseño eliminado con éxito." });
  } catch (error) { 
    console.error("Error en eliminación:", error);
    res.status(500).json({ error: "Error al eliminar el registro." }); 
  }
};