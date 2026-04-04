import nodemailer from 'nodemailer';

/**
 * CONFIGURACIÓN DE TRANSPORTE - MUSA AI (VILLATECH)
 * Optimizado para despliegue en Render con IPv4 forzado y Timeouts extendidos.
 */
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // STARTTLS
  family: 4,     // Obliga a usar IPv4 para evitar el error ENETUNREACH
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS 
  },
  // Timeouts preventivos para redes inestables en la nube
  connectionTimeout: 10000, // 10 segundos para conectar
  greetingTimeout: 10000,   // 10 segundos para esperar el saludo de Gmail
  tls: {
    // Evita bloqueos por certificados no reconocidos en el entorno de Render
    rejectUnauthorized: false,
    minVersion: 'TLSv1.2'
  }
});

export const MAIL_CONFIG = {
  // Asegúrate de que EMAIL_USER sea alejandro.personal29@gmail.com en Render
  from: `"Musa AI Lab" <${process.env.EMAIL_USER}>`, 
  baseUrl: process.env.BACKEND_URL || 'http://localhost:3001',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173'
};

// Verificación de conexión con logs claros para depuración
transporter.verify((error) => {
  if (error) {
    console.error('🚨 [MAIL_CONFIG_ERROR]: Fallo en la conexión SMTP:', error.message);
    console.log('💡 Tip de Villatech: Verifica que la "App Password" sea de 16 caracteres y no tenga espacios.');
  } else {
    console.log('📧 [MAIL_SYSTEM]: Servidor de correos listo para despegar (IPv4 forzado).');
  }
});

export default transporter;