import crypto from 'crypto';
import Payment from '../models/Payment.js';
import User from '../models/User.js';
import { PAYMENTS } from '../config/constants.js';
import { nowPaymentsService } from '../services/nowPaymentsService.js';

/**
 * Inicia el flujo de compra de créditos generando una factura en NowPayments.
 * @route POST /api/credits/create-payment
 * @access Private
 */
export const createPayment = async (req, res) => {
  try {
    const { amount, creditsToBuy } = req.body;
    const userId = req.user.id;

    // 1. Validación de Negocio y Anti-Tampering
    const expectedAmount = Number((creditsToBuy * PAYMENTS.CREDIT_COST).toFixed(2));
    
    if (amount < PAYMENTS.MIN_PAYMENT) {
      return res.status(400).json({ 
        error: `Monto insuficiente. El mínimo es $${PAYMENTS.MIN_PAYMENT} USD.`,
        code: "PAYMENT_MIN_LIMIT"
      });
    }
    
    // Verificación matemática para evitar manipulación de precios en el cliente
    if (Math.abs(amount - expectedAmount) > 0.01) {
      return res.status(400).json({ 
        error: "Error de validación en el costo total de los créditos.",
        code: "INTEGRITY_CHECK_FAILED"
      });
    }

    // 2. Ejecución vía Servicio Desacoplado
    const orderData = {
      price_amount: amount,
      order_id: `MUSA_${userId.substring(0, 5)}_${Date.now()}`,
      order_description: `Compra de ${creditsToBuy} créditos - Musa AI System`,
      callback_url: `${process.env.BACKEND_URL}/api/credits/nowpayments`
    };

    const response = await nowPaymentsService.createInvoice(orderData);

    // 3. Persistencia de Intento de Pago
    const newPayment = new Payment({ 
      userId, 
      paymentId: response.payment_id, 
      amount, 
      creditsToBuy,
      status: 'waiting',
      metadata: { orderId: orderData.order_id }
    });
    await newPayment.save();

    // 4. Entrega de URL de Facturación
    res.status(201).json({ 
      invoice_url: response.invoice_url || `https://nowpayments.io/payment/?iid=${response.payment_id}`,
      paymentId: response.payment_id 
    });

  } catch (error) { 
    console.error(`[PAYMENT_ERROR] [${new Date().toISOString()}]:`, error.response?.data || error.message);
    res.status(502).json({ 
      error: "Error al generar la pasarela de pago. Intente nuevamente.",
      code: "PROVIDER_TIMEOUT"
    }); 
  }
};

/**
 * Procesa notificaciones IPN (Instant Payment Notification).
 * Implementa validación HMAC para asegurar que el origen sea NowPayments.
 */
export const nowPaymentsWebhook = async (req, res) => {
  try {
    const signature = req.headers['x-nowpayments-sig'];
    const notificationsKey = process.env.NOWPAYMENTS_IPN_SECRET;
    
    // 1. Blindaje de Seguridad: Validación HMAC
    const sortedBody = JSON.stringify(req.body, Object.keys(req.body).sort());
    const hmac = crypto.createHmac('sha512', notificationsKey);
    hmac.update(sortedBody);
    const checkSignature = hmac.digest('hex');

    if (signature !== checkSignature) {
      console.error("🚨 [ALERTA DE SEGURIDAD] Firma IPN inválida detectada.");
      return res.status(401).send('Unauthorized Signature');
    }

    // 2. Gestión de Estados del Pago
    const { payment_status, payment_id } = req.body;
    const paymentRecord = await Payment.findOne({ paymentId: payment_id });

    if (!paymentRecord) {
      return res.status(404).send('Record Not Found');
    }

    // Evitar reprocesamiento si ya está terminado
    if (['finished', 'failed', 'expired'].includes(paymentRecord.status)) {
      return res.status(200).send('Already Processed');
    }

    // 3. Máquina de Estados (Update Logic)
    switch (payment_status) {
      case 'finished':
        paymentRecord.status = 'finished';
        await paymentRecord.save();
        
        // Acreditación Atómica de Créditos
        await User.findByIdAndUpdate(paymentRecord.userId, { 
          $inc: { credits: paymentRecord.creditsToBuy } 
        });
        console.log(`✨ Créditos sumados con éxito al usuario: ${paymentRecord.userId}`);
        break;

      case 'failed':
      case 'expired':
        paymentRecord.status = payment_status;
        await paymentRecord.save();
        console.log(`❌ Pago ${payment_id} marcado como ${payment_status}`);
        break;

      case 'partially_paid':
        paymentRecord.status = 'partially_paid';
        await paymentRecord.save();
        // Aquí podrías enviar un correo automático al usuario vía Villatech Support
        break;

      default:
        console.log(`ℹ️ Pago ${payment_id} en estado: ${payment_status}`);
    }

    // NowPayments requiere un 200 OK para dejar de reintentar el webhook
    res.status(200).send('OK');

  } catch (error) {
    console.error("[CRITICAL_WEBHOOK_ERROR]:", error.message);
    res.status(500).send('Internal Server Error');
  }
};