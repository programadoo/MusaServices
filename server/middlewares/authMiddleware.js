import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

/**
 * Middleware de Autenticación - Musa AI (Villatech)
 * Protege las rutas privadas verificando el JWT y la integridad del usuario.
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
      // Brecha: Expiración de sesión
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          error: "Su sesión ha expirado. Por favor, inicie sesión nuevamente.", 
          code: "TOKEN_EXPIRED" 
        });
      }
      
      // Brecha: Token manipulado o firma falsa
      return res.status(403).json({ 
        error: "Acceso denegado: Firma de seguridad inválida.",
        code: "INVALID_TOKEN"
      });
    }

    // 3. Verificación de Integridad de Datos (ObjectId de MongoDB)
    // Evita ataques de inyección de IDs malformados en el payload del JWT
    if (!decoded.id || !mongoose.Types.ObjectId.isValid(decoded.id)) {
      return res.status(403).json({ 
        error: "Seguridad: El identificador de usuario es corrupto o inválido.",
        code: "MALFORMED_IDENTITY"
      });
    }

    // 4. Inyección segura de datos del usuario en la solicitud
    // Solo pasamos el ID para que los controladores busquen la info fresca en DB
    req.user = {
      id: decoded.id
    };

    next();
  });
};

export default authenticateToken;