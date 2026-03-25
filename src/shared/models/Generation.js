const mongoose = require("mongoose");

const GenerationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Referencia a tu modelo de Usuario
    required: true,
  },
  personImage: {
    type: String, // URL de la foto que subió el usuario
    required: true,
  },
  garmentImage: {
    type: String, // URL de la prenda elegida
    required: true,
  },
  resultImage: {
    type: String, // URL final devuelta por Replicate
    required: true,
  },
  category: {
    type: String,
    enum: ["tops", "bottoms", "dresses"],
    default: "tops",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Generation", GenerationSchema);