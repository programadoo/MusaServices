import { sendEmail, MAIL_CONFIG } from '../config/mail.js';

/**
 * 📧 ENVÍO DE VERIFICACIÓN (Registro)
 * El link apunta al BACKEND para validar el token del usuario.
 */
export const sendVerificationEmail = async (email, name, token) => {
  const verifyUrl = `${MAIL_CONFIG.baseUrl}/api/auth/verify?token=${token}`;

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #222; padding: 40px; border-radius: 15px; background-color: #0a0a0a; color: #ffffff;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #ec4899; margin: 0; font-size: 28px; letter-spacing: 2px;">MUSA AI</h1>
        <p style="color: #666; font-size: 12px; text-transform: uppercase;">Future of Fashion</p>
      </div>
      
      <h2 style="color: #fff; font-weight: 400;">¡Bienvenido, ${name}!</h2>
      <p style="font-size: 16px; color: #ccc; line-height: 1.6;">Gracias por unirte a <strong>Musa AI</strong>. Para comenzar a usar el probador virtual, activa tu cuenta haciendo clic en el siguiente botón:</p>
      
      <div style="text-align: center; margin: 40px 0;">
        <a href="${verifyUrl}" style="background: #ec4899; color: #fff; padding: 15px 35px; text-decoration: none; border-radius: 50px; display: inline-block; font-weight: bold; font-size: 14px; box-shadow: 0 4px 15px rgba(236, 72, 153, 0.3);">
          VERIFICAR MI CUENTA
        </a>
      </div>
      
      <p style="font-size: 13px; color: #555; text-align: center; margin-top: 30px;">
        Si no creaste esta cuenta, puedes ignorar este mensaje.<br>
        <strong>Musa AI by Villatech</strong>
      </p>
    </div>
  `;

  try {
    const result = await sendEmail({
      to: email,
      subject: 'Activa tu cuenta - Musa AI 🚀',
      html: htmlContent
    });

    if (result.success) {
      console.log("🚀 [EMAIL_SYSTEM]: Verificación enviada a:", email, "| ID:", result.data.id);
      return result.data;
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error("❌ [EMAIL_ERROR]: Fallo en sendVerificationEmail:", error.message);
    throw error;
  }
};

/**
 * 🔑 ENVÍO DE RECUPERACIÓN (Forgot Password)
 * El link apunta al FRONTEND (musa-ai.uk) para el formulario de nueva clave.
 */
export const sendResetPasswordEmail = async (email, name, token) => {
  const resetUrl = `${MAIL_CONFIG.frontendUrl}/reset-password?token=${token}`;

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #222; padding: 40px; border-radius: 15px; background-color: #0a0a0a; color: #ffffff;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 2px;">MUSA <span style="color: #ec4899;">AI</span></h1>
      </div>
      
      <h2 style="color: #fff; font-weight: 400; text-align: center;">Solicitud de cambio de clave</h2>
      <p style="font-size: 16px; color: #ccc; line-height: 1.6; text-align: center;">Hola, <strong>${name}</strong>. Hemos recibido una solicitud para restablecer tu contraseña.</p>
      
      <div style="text-align: center; margin: 40px 0;">
        <a href="${resetUrl}" style="background: #ffffff; color: #000; padding: 15px 35px; text-decoration: none; border-radius: 50px; display: inline-block; font-weight: bold; font-size: 14px;">
          RESTABLECER CONTRASEÑA
        </a>
      </div>
      
      <div style="background-color: #1a1a1a; padding: 15px; border-radius: 10px; border-left: 4px solid #ec4899;">
        <p style="font-size: 13px; color: #999; margin: 0;"><strong>Importante:</strong> Este enlace expirará en 1 hora por motivos de seguridad.</p>
      </div>
      
      <p style="font-size: 11px; color: #444; text-align: center; margin-top: 40px; text-transform: uppercase; letter-spacing: 1px;">
        Musa AI Core Engine • Villatech Standard
      </p>
    </div>
  `;

  try {
    const result = await sendEmail({
      to: email,
      subject: 'Recuperar contraseña - Musa AI 🔐',
      html: htmlContent
    });

    if (result.success) {
      console.log("🔑 [EMAIL_SYSTEM]: Recuperación enviada a:", email, "| ID:", result.data.id);
      return result.data;
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error("❌ [EMAIL_ERROR]: Fallo en sendResetPasswordEmail:", error.message);
    throw error;
  }
};