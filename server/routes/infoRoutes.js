import express from 'express';
const router = express.Router();

// Estas rutas suelen ser simples, puedes poner la lógica aquí 
// o llevarla a un infoController.js si crece mucho.
router.get('/products', (req, res) => res.json({ message: "Lista de productos" }));
router.get('/info', (req, res) => res.json({ version: "1.1", owner: "Villatech" }));

export default router;