import express from 'express';
import { handleTryOn, getHistory, deleteHistory } from '../controllers/tryOnController.js';
import authenticateToken from '../middlewares/authMiddleware.js';
import { apiLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

router.post('/', apiLimiter, authenticateToken, handleTryOn);
router.get('/history/:userId', authenticateToken, getHistory);
router.delete('/history/:id', authenticateToken, deleteHistory);

export default router;