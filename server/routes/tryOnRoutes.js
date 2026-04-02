import express from 'express';
import { 
  handleTryOn, 
  getJobStatus, // <-- Importamos la nueva función
  getHistory, 
  deleteHistory 
} from '../controllers/tryOnController.js';
import authenticateToken from '../middlewares/authMiddleware.js';
import { apiLimiter, authLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

// 1. Iniciar el proceso de Try-On (Encola la tarea en BullMQ)
router.post('/', apiLimiter, authenticateToken, handleTryOn);

// 2. NUEVA RUTA: Consultar el estado de la generación (Polling)
// El frontend llamará aquí cada 3 segundos usando el jobId recibido en el POST
router.get('/status/:jobId', authenticateToken, getJobStatus);

// 3. Historial del usuario
router.get('/history/:userId', authenticateToken, getHistory);

// 4. Eliminar un registro del historial
router.delete('/history/:id', authenticateToken, deleteHistory);

export default router;