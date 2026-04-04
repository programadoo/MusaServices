import nodemailer from 'nodemailer';

/**
 * CONFIGURACIÓN DE TRANSPORTE - VILLATECH STANDARD (PRODUCCIÓN RENDER)
 * Ajustado para evitar errores de red IPv6 y bloqueos de TLS.
 */
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true para puerto 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS  // Tu contraseña de aplicación de 16 caracteres
  },
  tls: {
    // Esto evita errores de certificado y problemas de conexión en servidores cloud
    rejectUnauthorized: false
  }
});

export const MAIL_CONFIG = {
  // El 'from' debe ser el mismo correo autenticado para evitar bloqueos
  from: `"Musa AI Lab" <${process.env.EMAIL_USER}>`, 
  
  // URL del backend para los enlaces de verificación
  baseUrl: process.env.BACKEND_URL || 'http://localhost:3001',
  
  // URL del frontend para los enlaces de recuperación de contraseña
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173'
};

// Verificación de conexión en el arranque
transporter.verify((error, success) => {
  if (error) {
    console.error('🚨 [MAIL_CONFIG_ERROR]: Error de conexión SMTP:', error.message);
    console.log('💡 Tip: Revisa que EMAIL_USER y EMAIL_PASS estén correctos en Render Environment.');
  } else {
    console.log('📧 [MAIL_SYSTEM]: Servidor de correos listo para despegar (Producción).');
  }
});

export default transporter;