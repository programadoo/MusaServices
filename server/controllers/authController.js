import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import { sendVerificationEmail, sendResetPasswordEmail } from '../utils/emailService.js';

/**
 * 📝 1. REGISTRO DE USUARIO
 */
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const emailLower = email.toLowerCase().trim();
    
    // Verificar si ya existe
    const existingUser = await User.findOne({ email: emailLower });
    if (existingUser) {
      return res.status(400).json({ error: "El correo ya está en uso." });
    }

    // Preparar credenciales y token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({ 
      name: name.trim(), 
      email: emailLower, 
      password: hashedPassword,
      credits: 5, // Créditos iniciales de cortesía
      verificationToken,
      isVerified: false 
    });
    
    // Guardar en DB
    const savedUser = await newUser.save();
    console.log(`🚀 Usuario creado: ${savedUser.email} | Token: ${verificationToken}`);

    // Enviar Email (con await para asegurar que salga antes de responder al cliente)
    try {
      await sendVerificationEmail(savedUser.email, savedUser.name, verificationToken);
    } catch (mailError) {
      console.error("⚠️ Error al enviar el correo, pero el usuario fue creado:", mailError.message);
    }

    res.status(201).json({ 
      message: "Registro exitoso. Revisa tu correo para verificar tu cuenta." 
    });
  } catch (error) { 
    console.error("❌ Error en Register:", error);
    res.status(500).json({ error: "Error interno en el servidor." }); 
  }
};

/**
 * 🔑 2. LOGIN DE USUARIO
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    
    // Validar existencia y password
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Credenciales inválidas." });
    }

    // Bloqueo si no está verificado
    if (!user.isVerified) {
      return res.status(403).json({ 
        error: "Cuenta no verificada. Revisa tu email para activar tu acceso.", 
        code: "EMAIL_NOT_VERIFIED" 
      });
    }

    // Generar JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        credits: user.credits 
      } 
    });
  } catch (error) { 
    console.error("❌ Error en Login:", error);
    res.status(500).json({ error: "Error en el sistema de acceso." }); 
  }
};

/**
 * ✅ 3. VERIFICACIÓN DE EMAIL (El link del correo llega aquí)
 */
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    console.log("🔍 Intentando verificar token:", token);

    if (!token) return res.status(400).json({ error: "Token ausente." });

    // CAMBIO MAESTRO: Usamos findOneAndUpdate para forzar la actualización directa en MongoDB
    // trim() limpia espacios en blanco que algunos navegadores agregan al copiar enlaces
    const user = await User.findOneAndUpdate(
      { verificationToken: token.trim() }, 
      { 
        $set: { isVerified: true }, 
        $unset: { verificationToken: "" } // Limpiamos el token por seguridad
      },
      { new: true } // Nos devuelve el documento actualizado
    );

    if (!user) {
      console.log("❌ No se encontró usuario con ese token o ya fue verificado.");
      return res.status(400).send(`
        <div style="font-family:sans-serif; text-align:center; margin-top:50px;">
          <h1 style="color:#e63946;">Enlace Inválido</h1>
          <p>El enlace ha expirado o ya has verificado tu cuenta anteriormente.</p>
          <a href="${process.env.FRONTEND_URL}/login">Ir al Login</a>
        </div>
      `);
    }

    console.log(`✅ Usuario verificado con éxito: ${user.email}`);

    // Redirección al frontend con flag de éxito
    res.redirect(`${process.env.FRONTEND_URL}/login?verified=true`);

  } catch (error) {
    console.error("❌ Error en verifyEmail:", error);
    res.status(500).json({ error: "Error al verificar la cuenta." });
  }
};

/**
 * 🛠️ 4. SOLICITAR RECUPERACIÓN (Forgot Password)
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    // Si el usuario existe, generamos token de reset
    if (user) {
      const resetToken = crypto.randomBytes(32).toString('hex');
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hora de validez
      await user.save();

      await sendResetPasswordEmail(user.email, user.name, resetToken);
    }

    // Siempre respondemos lo mismo por seguridad (evitar enumeración de usuarios)
    res.json({ message: "Si el correo coincide con nuestros registros, recibirás instrucciones en breve." });
  } catch (error) {
    console.error("❌ Error en forgotPassword:", error);
    res.status(500).json({ error: "Error al procesar recuperación." });
  }
};

/**
 * 🆕 5. RESETEAR CONTRASEÑA
 */
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: "El enlace ha vencido o es inválido." });
    }

    // Hashear nueva clave y limpiar tokens de reset
    user.password = await bcrypt.hash(newPassword, 12);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Contraseña actualizada exitosamente. Ya puedes iniciar sesión." });
  } catch (error) {
    console.error("❌ Error en resetPassword:", error);
    res.status(500).json({ error: "Error al restablecer contraseña." });
  }
};

/**
 * 🗑️ 6. ELIMINAR CUENTA (Zona de Peligro)
 */
export const deleteAccount = async (req, res) => {
  try {
    // El ID viene del middleware de autenticación (req.user)
    const userId = req.user.id || req.user._id;

    const userDeleted = await User.findByIdAndDelete(userId);

    if (!userDeleted) {
      return res.status(404).json({ error: "Usuario no encontrado en el sistema." });
    }

    console.log(`🗑️ Cuenta eliminada permanentemente: ${userDeleted.email}`);
    res.json({ message: "Registro eliminado exitosamente de Musa Core." });
  } catch (error) {
    console.error("❌ Error en eliminación de cuenta:", error);
    res.status(500).json({ error: "Error interno al intentar eliminar la cuenta." });
  }
};