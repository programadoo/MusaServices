import express from 'express';
import { createPayment, nowPaymentsWebhook } from '../controllers/paymentController.js';
import authenticateToken from '../middlewares/authMiddleware.js';
import { apiLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

/**
 * RUTA: POST /api/credits/buy
 * DESCRIPCIÓN: Crea una orden de pago en NowPayments.
 * PROTECCIÓN: Requiere Token (Usuario logueado) + Rate Limit.
 */
router.post('/buy', apiLimiter, authenticateToken, createPayment);

/**
 * RUTA: POST /api/credits/webhooks/nowpayments
 * DESCRIPCIÓN: Recibe la confirmación de pago exitoso desde NowPayments.
 * PROTECCIÓN: Firma HMAC (Validada dentro del controlador).
 * NOTA: NO lleva 'authenticateToken' porque la petición viene de un servidor externo.
 */
router.post('/nowpayments', nowPaymentsWebhook);

export default router;