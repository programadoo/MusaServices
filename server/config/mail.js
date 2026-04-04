import nodemailer from 'nodemailer';

/**
 * CONFIGURACIÓN DE TRANSPORTE - MUSA AI (VILLATECH)
 * Actualizado a Puerto 465 (SSL) para máxima velocidad y estabilidad en Render.
 */
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,         // Cambiamos a SSL directo
  secure: true,       // Obligatorio para puerto 465
  family: 4,          // Forzamos IPv4 (mantiene la solución al error ENETUNREACH)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS 
  },
  // Aumentamos los timeouts significativamente para que Render no tire la toalla
  connectionTimeout: 20000, // 20 segundos
  greetingTimeout: 20000,   // 20 segundos
  socketTimeout: 25000,     // 25 segundos
  tls: {
    // Evita bloqueos por certificados en la infraestructura de la nube
    rejectUnauthorized: false,
    minVersion: 'TLSv1.2'
  }
});

export const MAIL_CONFIG = {
  // Nota: EMAIL_USER debe ser alejandro.personal29@gmail.com
  from: `"Musa AI Lab" <${process.env.EMAIL_USER}>`, 
  baseUrl: process.env.BACKEND_URL || 'http://localhost:3001',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173'
};

// Verificación detallada para el log de Render
transporter.verify((error) => {
  if (error) {
    console.error('🚨 [MAIL_CONFIG_ERROR]: Fallo definitivo en la conexión SMTP:', error.message);
    console.log('💡 Tip de Villatech: Si dice Timeout en 465, revisa que tu App Password de 16 caracteres no tenga espacios.');
  } else {
    console.log('📧 [MAIL_SYSTEM]: Servidor de correos conectado con éxito vía SSL (Puerto 465).');
  }
});

export default transporter;