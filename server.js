import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import Replicate from 'replicate';
import sharp from 'sharp';
import crypto from 'crypto'; // Para generar identificadores únicos (hashes)

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// --- CONFIGURACIÓN DE CACHÉ ---
// Usamos un Map para guardar: llave (combinación de fotos) -> valor (resultado de la IA)
const predictionCache = new Map();

// Inicialización de Replicate
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

/**
 * Función para monitorear el uso de RAM en tiempo real
 */
function logMemoryUsage() {
  const used = process.memoryUsage();
  console.log(`[Memoria] 🧠 RSS: ${(used.rss / 1024 / 1024).toFixed(2)} MB | Heap: ${(used.heapUsed / 1024 / 1024).toFixed(2)} MB`);
}

/**
 * Genera una "huella digital" única para la combinación de imágenes
 */
function generateCacheKey(personUri, garmentUri, category) {
  // Solo tomamos una parte del base64 para que el hash sea rápido
  const combinedData = personUri.substring(0, 500) + garmentUri.substring(0, 500) + category;
  return crypto.createHash('md5').update(combinedData).digest('hex');
}

async function optimizeImage(base64String, label) {
  try {
    if (!base64String || !base64String.includes('base64')) return base64String;
    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, 'base64');

    const optimizedBuffer = await sharp(buffer)
      .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toBuffer();

    return `data:image/jpeg;base64,${optimizedBuffer.toString('base64')}`;
  } catch (error) {
    console.error(`Error optimizando ${label}:`, error.message);
    return base64String;
  }
}

app.post('/api/try-on', async (req, res) => {
  try {
    const { personUri, garmentUri, garmentDescription, category } = req.body;

    if (!personUri || !garmentUri) {
      return res.status(400).json({ error: "Faltan imágenes." });
    }

    // 1. VERIFICAR CACHÉ
    const cacheKey = generateCacheKey(personUri, garmentUri, category);
    if (predictionCache.has(cacheKey)) {
      console.log("🚀 [Caché] ¡Resultado encontrado! Devolviendo respuesta instantánea...");
      return res.json({ image: predictionCache.get(cacheKey), cached: true });
    }

    console.log(`--- Nueva petición: ${garmentDescription} ---`);
    logMemoryUsage(); // Ver cuánta RAM tenemos antes de Sharp
    
    const startTime = Date.now();

    // 2. OPTIMIZAR
    const [personOptimized, garmentOptimized] = await Promise.all([
      optimizeImage(personUri, "Persona"),
      optimizeImage(garmentUri, "Prenda")
    ]);

    logMemoryUsage(); // Ver cuánta RAM consumió Sharp

    // 3. REPLICATE
    const prediction = await replicate.predictions.create({
      version: "0513734a452173b8173e907e3a59d19a36266e55b48528559432bd21c7d7e985",
      input: {
        human_img: personOptimized,
        garm_img: garmentOptimized,
        garment_des: garmentDescription,
        category: category, 
        is_checked: true
      }
    });

    console.log("Esperando procesamiento de la IA (Cold Start puede tardar)...");
    const result = await replicate.wait(prediction);

    // 4. GUARDAR EN CACHÉ
    predictionCache.set(cacheKey, result.output);
    console.log("💾 [Caché] Resultado guardado para futuras peticiones.");

    const totalTime = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`¡Generación completada en ${totalTime}s!`);
    logMemoryUsage();
    
    res.json({ image: result.output, cached: false });

  } catch (error) {
    console.error("Error en el servidor:", error.message);
    res.status(500).json({ error: "Error en la generación." });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Musa Backend Online - Puerto ${PORT}`);
  logMemoryUsage();
});