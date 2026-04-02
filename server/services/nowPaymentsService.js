import axios from 'axios';

// URL base de la API de NowPayments
const NOWPAYMENTS_API_URL = 'https://api.nowpayments.io/v1';

/**
 * Cliente de Axios configurado para NowPayments
 * Centraliza la API Key y los headers necesarios.
 */
const nowPaymentsClient = axios.create({
  baseURL: NOWPAYMENTS_API_URL,
  headers: {
    'x-api-key': process.env.NOWPAYMENTS_API_KEY,
    'Content-Type': 'application/json'
  }
});

export const nowPaymentsService = {
  /**
   * Crea una orden de pago (Invoice) en el sistema de NowPayments.
   * @param {Object} orderData - Datos de la transacción (monto, ID de orden, etc.)
   */
  createInvoice: async (orderData) => {
    try {
      const { data } = await nowPaymentsClient.post('/payment', {
        price_amount: orderData.price_amount,
        price_currency: "usd",
        pay_currency: "usdttrc20", // Forzamos USDT por red TRC20 para Musa AI
        order_id: orderData.order_id,
        order_description: orderData.order_description,
        ipn_callback_url: orderData.callback_url
      });

      return data;
    } catch (error) {
      // Re-lanzamos el error para que el controlador lo capture y maneje el log/máscara
      throw error;
    }
  },

  /**
   * (Opcional) Método para verificar el estado de un pago manualmente
   */
  getPaymentStatus: async (paymentId) => {
    const { data } = await nowPaymentsClient.get(`/payment/${paymentId}`);
    return data;
  }
};