import nodemailer from 'nodemailer';

/**
 * CONFIGURACIÓN DE TRANSPORTE - MUSA AI (RECURSO FINAL)
 * Usamos la IP directa de Gmail para saltarnos el bloqueo de IPv6 en Render.
 */
const transporter = nodemailer.createTransport({
  // Esta es una de las IPs oficiales de smtp.gmail.com (IPv4)
  host: '64.233.186.108', 
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS 
  },
  connectionTimeout: 30000, // 30 segundos
  greetingTimeout: 30000,
  tls: {
    // Es vital poner el servername aquí para que el certificado SSL de Google siga siendo válido
    servername: 'smtp.gmail.com',
    rejectUnauthorized: false
  }
});

export const MAIL_CONFIG = {
  from: `"Musa AI Lab" <${process.env.EMAIL_USER}>`, 
  baseUrl: process.env.BACKEND_URL || 'https://musaservices.onrender.com',
  frontendUrl: process.env.FRONTEND_URL || 'https://lumen-shop.onrender.com'
};

transporter.verify((error) => {
  if (error) {
    console.error('🚨 [MAIL_FATAL_ERROR]: Falló incluso con IP directa:', error.message);
  } else {
    console.log('📧 [MAIL_SYSTEM]: ¡CONECTADO! Saltamos el muro de IPv6 con éxito.');
  }
});

export default transporter;