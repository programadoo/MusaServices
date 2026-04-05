import { Resend } from 'resend';

/**
 * CONFIGURACIÓN DE CORREO - MUSA AI
 * Seguridad: Implementación vía API Key (HTTPS) para evitar bloqueos de puertos.
 * Dominio: musa-ai.uk (Validado vía DNS)
 */

const resend = new Resend(process.env.RESEND_API_KEY);

export const MAIL_CONFIG = {
  // El remitente ahora es una dirección oficial de tu dominio
  from: 'Musa AI <no-reply@musa-ai.uk>', 
  // URLs de entorno para asegurar que los enlaces en los correos sean dinámicos
  baseUrl: process.env.BACKEND_URL || 'https://musaservices.onrender.com',
  frontendUrl: process.env.FRONTEND_URL || 'https://musa-ai.uk'
};

/**
 * Función robusta para el envío de correos.
 * @param {Object} options - Destinatario, asunto y contenido HTML.
 */
export const sendEmail = async ({ to, subject, html }) => {
  try {
    const { data, error } = await resend.emails.send({
      from: MAIL_CONFIG.from,
      to: [to],
      subject: subject,
      html: html,
    });

    if (error) {
      console.error('🚨 [MAIL_ERROR]: Falló el envío a través de la API:', error.message);
      return { success: false, error: error.message };
    }

    console.log(`📧 [MAIL_SYSTEM]: Correo enviado con éxito a ${to}`);
    return { success: true, data };
  } catch (err) {
    console.error('🚨 [MAIL_CRITICAL_FAIL]: Error inesperado en el motor de correos:', err.message);
    return { success: false, error: err.message };
  }
};

// Verificación inicial del motor en los logs de Render
if (!process.env.RESEND_API_KEY) {
  console.warn('⚠️ [MAIL_WARNING]: RESEND_API_KEY no está definida. El sistema de correos no funcionará.');
} else {
  console.log('🚀 [MAIL_SYSTEM]: Motor de correos musa-ai.uk listo y protegido.');
}

export default resend;