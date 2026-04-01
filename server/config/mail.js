import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const MAIL_CONFIG = {
  // Ahora usamos la variable de entorno, con un fallback de seguridad
  from: process.env.EMAIL_FROM || 'onboarding@resend.dev', 
  baseUrl: process.env.BACKEND_URL || 'http://localhost:3001'
};

export default resend;