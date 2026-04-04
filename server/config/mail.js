import nodemailer from 'nodemailer';

/**
 * CONFIGURACIÓN DE TRANSPORTE - VILLATECH/MUSA AI
 * Cambiamos a Puerto 587 (STARTTLS) para mayor compatibilidad en Render.
 */
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // false para puerto 587 (usa STARTTLS)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS  // DEBE SER LA CONTRASEÑA DE APLICACIÓN DE 16 LETRAS
  },
  tls: {
    // Crucial para evitar que el firewall de Render bloquee la negociación de certificados
    rejectUnauthorized: false,
    minVersion: 'TLSv1.2'
  }
});

export const MAIL_CONFIG = {
  from: `"Musa AI Lab" <${process.env.EMAIL_USER}>`, 
  baseUrl: process.env.BACKEND_URL || 'http://localhost:3001',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173'
};

// Verificación de conexión con timeout extendido para producción
transporter.verify((error, success) => {
  if (error) {
    console.error('🚨 [MAIL_CONFIG_ERROR]: Error de conexión SMTP:', error.message);
    console.log('💡 Checklist de Villatech:');
    console.log('1. ¿EMAIL_PASS es la clave de 16 caracteres de "Contraseñas de aplicaciones"?');
    console.log('2. ¿Verificaste que EMAIL_USER sea tu correo completo en Render?');
  } else {
    console.log('📧 [MAIL_SYSTEM]: Servidor de correos listo para despegar (Producción).');
  }
});

export default transporter;