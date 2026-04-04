import nodemailer from 'nodemailer';

/**
 * CONFIGURACIÓN DE TRANSPORTE - VILLATECH STANDARD
 * Utilizamos Nodemailer para bypass de costos de dominio iniciales.
 * Requiere EMAIL_USER y EMAIL_PASS (App Password) en el .env
 */
const transporter = nodemailer.createTransport({
  service: 'gmail', // Puedes cambiarlo por 'outlook', 'hotmail', etc.
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS  // Contraseña de aplicación de 16 caracteres
  }
});

export const MAIL_CONFIG = {
  // El 'from' debe ser el mismo correo autenticado para evitar bloqueos de Gmail
  from: `"Musa AI Lab" <${process.env.EMAIL_USER}>`, 
  
  // URL del backend para los enlaces de verificación
  baseUrl: process.env.BACKEND_URL || 'http://localhost:3001',
  
  // URL del frontend para los enlaces de recuperación de contraseña
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173'
};

// Verificación de conexión en el arranque (Opcional pero recomendado para Debug)
transporter.verify((error, success) => {
  if (error) {
    console.error('🚨 [MAIL_CONFIG_ERROR]: Error de conexión SMTP:', error.message);
  } else {
    console.log('📧 [MAIL_SYSTEM]: Servidor de correos listo para despegar.');
  }
});

export default transporter;