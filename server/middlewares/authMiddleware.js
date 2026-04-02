import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

/**
 * Middleware de Autenticación - Musa AI (Villatech)
 * Estandariza la identidad del usuario y protege rutas privadas.
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  // 1. Verificación de existencia y formato del Header (Bearer TOKEN)
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      error: "No autorizado: Formato de autenticación inválido o inexistente.",
      code: "AUTH_MISSING"
    });
  }

  const token = authHeader.split(' ')[1];

  // 2. Verificación del Token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          error: "Su sesión ha expirado. Por favor, inicie sesión nuevamente.", 
          code: "TOKEN_EXPIRED" 
        });
      }
      
      return res.status(403).json({ 
        error: "Acceso denegado: Firma de seguridad inválida.",
        code: "INVALID_TOKEN"
      });
    }

    // 3. NORMALIZACIÓN DE IDENTIDAD (El punto clave)
    // Extraemos el ID sin importar si el JWT se firmó como 'id' o '_id'
    const userId = decoded.id || decoded._id;

    // 4. Verificación de Integridad de Datos (ObjectId de MongoDB)
    // Validamos que el ID extraído sea un formato válido de MongoDB antes de tocar la DB
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(403).json({ 
        error: "Seguridad: El identificador de usuario es corrupto o inválido.",
        code: "MALFORMED_IDENTITY"
      });
    }

    // 5. Inyección segura y estandarizada en la solicitud
    // A partir de aquí, TODOS tus controladores usarán 'req.user.id'
    req.user = {
      id: userId.toString() // Nos aseguramos de que siempre sea un string
    };

    next();
  });
};

export default authenticateToken;