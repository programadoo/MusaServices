const mongoose = require("mongoose");

const GenerationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true, // 1. Mejora el rendimiento de búsqueda
  },
  personImage: {
    type: String,
    required: true,
    trim: true,
  },
  garmentImage: {
    type: String,
    required: true,
    trim: true,
  },
  resultImage: {
    type: String, 
    required: true,
    trim: true, // Aquí guardaremos la URL de Supabase
  },
  category: {
    type: String,
    enum: ["tops", "bottoms", "dresses"],
    default: "tops",
  },
  // Opcional: Podrías añadir la descripción para que el usuario 
  // recuerde qué prompt usó en esa generación
  description: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Generation", GenerationSchema);