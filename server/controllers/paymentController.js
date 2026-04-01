import axios from 'axios';
import crypto from 'crypto';
import Payment from '../models/Payment.js';
import User from '../models/User.js';
import { PAYMENTS } from '../config/constants.js'; // Importamos los costos fijos

export const createPayment = async (req, res) => {
  try {
    const { amount, creditsToBuy } = req.body;
    const userId = req.user.id;

    // 1. Validación de seguridad (Rescatada de tu server antiguo)
    const expectedAmount = Number((creditsToBuy * PAYMENTS.CREDIT_COST).toFixed(2));
    if (amount < PAYMENTS.MIN_PAYMENT) {
      return res.status(400).json({ error: `El monto mínimo es $${PAYMENTS.MIN_PAYMENT} USD.` });
    }
    
    if (Math.abs(amount - expectedAmount) > 0.01) {
      return res.status(400).json({ error: "Discrepancia en el precio calculado." });
    }

    // 2. Petición a NowPayments
    const response = await axios.post('https://api.nowpayments.io/v1/payment', {
      price_amount: amount,
      price_currency: "usd",
      pay_currency: "usdttrc20",
      order_id: `musa_${Date.now()}_${userId}`,
      order_description: `Compra de ${creditsToBuy} créditos - Villatech`,
      // RUTA CORREGIDA SEGÚN LA MODULARIZACIÓN:
      ipn_callback_url: `${process.env.BACKEND_URL}/api/credits/nowpayments`
    }, { 
      headers: { 'x-api-key': process.env.NOWPAYMENTS_API_KEY } 
    });

    // 3. Guardar registro en DB
    const newPayment = new Payment({ 
      userId, 
      paymentId: response.data.payment_id, 
      amount, 
      creditsToBuy 
    });
    await newPayment.save();

    // 4. Asegurar que devolvemos una URL válida
    const invoiceUrl = response.data.invoice_url || `https://nowpayments.io/payment/?iid=${response.data.payment_id}`;
    res.json({ invoice_url: invoiceUrl });

  } catch (error) { 
    console.error("Error NowPayments:", error.response?.data || error.message);
    res.status(500).json({ error: "El proveedor de pagos no pudo generar la factura." }); 
  }
};

export const nowPaymentsWebhook = async (req, res) => {
  // ... (Tu código de webhook está perfecto, solo asegúrate de importar 'crypto')
};