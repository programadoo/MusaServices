import 'dotenv/config'; // Esta es la forma moderna de cargar el .env con ES Modules
import express from 'express';
import cors from 'cors';
import Replicate from 'replicate';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Inicialización de Replicate usando la variable de entorno
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN, 
});

app.post('/api/try-on', async (req, res) => {
  try {
    const { personUri, garmentUri, garmentDescription, category } = req.body;

    // Validación básica para evitar errores de "undefined"
    if (!personUri || !garmentUri) {
      return res.status(400).json({ error: "Faltan imágenes (persona o prenda)" });
    }

    console.log(`Iniciando predicción para: ${garmentDescription} (${category})...`);

    const prediction = await replicate.predictions.create({
      // Es buena idea mover también la versión al .env si planeas probar otros modelos
      version: "0513734a452173b8173e907e3a59d19a36266e55b48528559432bd21c7d7e985",
      input: {
        human_img: personUri,
        garm_img: garmentUri,
        garment_des: garmentDescription,
        category: category, 
        is_checked: true
      }
    });

    console.log("Esperando a que la IA procese la imagen...");

    // Esperamos el resultado (Replicate wait tiene un timeout por defecto, está bien así)
    const result = await replicate.wait(prediction);

    console.log("¡Generación completada!");
    
    res.json({ image: result.output });

  } catch (error) {
    console.error("Error en el servidor de Musa:", error.message);
    res.status(500).json({ error: "Hubo un problema al procesar la imagen con la IA." });
  }
});

// Usamos una variable de entorno para el puerto o el 3001 por defecto
const PORT = process.env.PORT || 3001;

app.listen(PORT, '0.0.0.0', () => {
  console.log(` Servidor de Musa corriendo en el puerto ${PORT}`);
  console.log(`Cargando API Token: ${process.env.REPLICATE_API_TOKEN ? "OK " : "ERROR "}`);
});