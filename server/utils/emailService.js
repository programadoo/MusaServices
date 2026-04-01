import resend, { MAIL_CONFIG } from '../config/mail.js';

/**
 * 📧 ENVÍO DE VERIFICACIÓN (Registro)
 * Este link VA AL BACKEND (3001) para que el servidor 
 * marque al usuario como verificado y luego lo redirija.
 */
export const sendVerificationEmail = async (email, name, token) => {
  const verifyUrl = `${MAIL_CONFIG.baseUrl}/api/auth/verify?token=${token}`;

  try {
    const { data, error } = await resend.emails.send({
      from: MAIL_CONFIG.from,
      to: [email],
      subject: 'Confirmación de cuenta - Musa AI',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #f0f0f0; padding: 20px; border-radius: 10px; background-color: #ffffff;">
          <h2 style="color: #000;">¡Hola, ${name}!</h2>
          <p style="font-size: 16px; color: #333;">Gracias por unirte a <strong>Musa AI</strong>. Activa tu cuenta haciendo clic abajo:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verifyUrl}" style="background: #000; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
              Verificar mi cuenta
            </a>
          </div>
          <p style="font-size: 11px; color: #aaa; text-align: center;">Musa AI by Villatech</p>
        </div>
      `
    });

    if (error) throw error;
    console.log("🚀 Email de verificación enviado:", data.id);
    return data;
  } catch (error) {
    console.error("❌ Error en sendVerificationEmail:", error.message);
    throw error;
  }
};

/**
 * 🔑 ENVÍO DE RECUPERACIÓN (Forgot Password)
 * IMPORTANTE: Este link DEBE IR AL FRONTEND (5173) 
 * para que el usuario vea el formulario de "Nueva Contraseña".
 */
export const sendResetPasswordEmail = async (email, name, token) => {
  // CAMBIO CRÍTICO AQUÍ: Usamos FRONTEND_URL en lugar de baseUrl (Backend)
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const resetUrl = `${frontendUrl}/reset-password?token=${token}`;

  try {
    const { data, error } = await resend.emails.send({
      from: MAIL_CONFIG.from,
      to: [email],
      subject: 'Recuperar contraseña - Musa AI',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #f0f0f0; padding: 20px; border-radius: 10px; background-color: #ffffff;">
          <h2 style="color: #333;">Solicitud de cambio de contraseña</h2>
          <p style="font-size: 16px; color: #333;">Hola, <strong>${name}</strong>.</p>
          <p style="font-size: 16px; color: #333;">Haz clic abajo para restablecer tu clave. <strong>Expira en 1 hora.</strong></p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background: #e63946; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
              Restablecer contraseña
            </a>
          </div>
          <hr style="border: none; border-top: 1px solid #eee; margin-top: 20px;">
          <p style="font-size: 11px; color: #aaa; text-align: center;">Musa AI by Villatech</p>
        </div>
      `
    });

    if (error) throw error;
    console.log("🔑 Email de recuperación enviado:", data.id);
    return data;
  } catch (error) {
    console.error("❌ Error enviando email de reset:", error.message);
    throw error;
  }
};