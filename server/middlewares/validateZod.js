import { ZodError } from 'zod';

export const validateSchema = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      // Tomamos el primer error de la lista para enviarlo al toast del frontend
      const errorMessage = error.errors[0].message;
      return res.status(400).json({ 
        error: errorMessage,
        details: error.errors.map(err => ({ field: err.path[0], message: err.message }))
      });
    }
    return res.status(500).json({ error: "Error interno de validación." });
  }
};