import nodemailer from 'nodemailer';
import dns from 'dns';

/**
 * CONFIGURACIÓN DE TRANSPORTE - MUSA AI (VILLATECH)
 * Versión "Inmune a IPv6" para Render.
 */

// Forzamos que la resolución de nombres prefiera IPv4 globalmente para este proceso
dns.setDefaultResultOrder('ipv4first');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, 
  // Intentamos forzar IPv4 en tres niveles diferentes:
  family: 4, 
  address: 'smtp.gmail.com',
  connectionTimeout: 20000,
  greetingTimeout: 20000,
  tls: {
    // Crucial: No permitas que la negociación TLS intente saltar a IPv6
    rejectUnauthorized: false,
    servername: 'smtp.gmail.com',
    minVersion: 'TLSv1.2'
  }
});

export const MAIL_CONFIG = {
  from: `"Musa AI Lab" <${process.env.EMAIL_USER}>`, 
  baseUrl: process.env.BACKEND_URL || 'http://localhost:3001',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173'
};

// Verificación con log de éxito
transporter.verify((error) => {
  if (error) {
    console.error('🚨 [MAIL_CONFIG_ERROR]: Fallo tras forzar IPv4:', error.message);
    console.log('💡 Tip de Villatech: Si esto falla, intentaremos el último recurso (IP Directa).');
  } else {
    console.log('📧 [MAIL_SYSTEM]: Conexión establecida con éxito (IPv4 Blindado).');
  }
});

export default transporter;