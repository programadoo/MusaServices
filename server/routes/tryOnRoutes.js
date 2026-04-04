import express from 'express';
import { 
  handleTryOn, 
  getJobStatus, 
  getHistory, 
  deleteHistory 
} from '../controllers/tryOnController.js';
import authenticateToken from '../middlewares/authMiddleware.js';
import { apiLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

/**
 * 🎨 RUTA 1: INICIAR PROCESO (POST)
 * Encola la tarea en BullMQ y descuenta créditos.
 * Protegida por Rate Limiter para evitar spam a la API de Replicate.
 */
router.post('/', apiLimiter, authenticateToken, handleTryOn);

/**
 * 🔍 RUTA 2: POLLING DE ESTADO (GET)
 * El Frontend debe enviar el JWT en el Header: { Authorization: 'Bearer [token]' }
 * Se llama cada 3 segundos hasta que el job sea 'completed' o 'failed'.
 */
router.get('/status/:jobId', authenticateToken, getJobStatus);

/**
 * 📜 RUTA 3: HISTORIAL (GET)
 * Recupera todos los diseños generados por un usuario específico.
 */
router.get('/history/:userId', authenticateToken, getHistory);

/**
 * 🗑️ RUTA 4: ELIMINAR (DELETE)
 * Borra un registro del historial de la base de datos.
 */
router.delete('/history/:id', authenticateToken, deleteHistory);

export default router;