import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import Replicate from 'replicate';
import sharp from 'sharp';
import crypto from 'crypto';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();

// --- ACTUALIZACIÓN ESTRICTA: CORS ---
// Permitimos cualquier origen para que tu móvil (IP dinámica) no sea bloqueado
app.use(cors({
  origin: "*", 
  methods: ["GET", "POST", "DELETE", "PUT"],
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));

// --- CONFIGURACIÓN DE VARIABLES DE ENTORNO ---
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const REPLICATE_TOKEN = process.env.REPLICATE_API_TOKEN;

// --- CONEXIÓN A MONGODB ATLAS ---
mongoose.connect(MONGO_URI)
  .then(() => console.log("✨ [Database] Conectado a MongoDB Atlas con éxito"))
  .catch(err => console.error("❌ [Database] Error de conexión:", err));

// --- MODELOS DE DATOS (Mongoose) ---
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

const generationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  personImage: { type: String, required: true }, 
  garmentImage: { type: String, required: true },
  resultImage: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const Generation = mongoose.model('Generation', generationSchema);

// --- CONFIGURACIÓN DE CACHÉ MUSA AI ---
const predictionCache = new Map();

// Inicialización de Replicate
const replicate = new Replicate({
  auth: REPLICATE_TOKEN,
});

// --- FUNCIONES UTILITARIAS (Mantenidas íntegras) ---
function logMemoryUsage() {
  const used = process.memoryUsage();
  console.log(`[Memoria] 🧠 RSS: ${(used.rss / 1024 / 1024).toFixed(2)} MB | Heap: ${(used.heapUsed / 1024 / 1024).toFixed(2)} MB`);
}

function generateCacheKey(personUri, garmentUri, category) {
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

// --- ENDPOINTS DE AUTENTICACIÓN ---

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "El email ya está registrado." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    await newUser.save();
    console.log(`👤 Nuevo usuario registrado: ${email}`);
    res.status(201).json({ message: "Usuario creado correctamente." });
  } catch (error) {
    console.error("Error en registro:", error.message);
    res.status(500).json({ error: "Error al registrar el usuario." });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "Usuario no encontrado." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Contraseña incorrecta." });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '24h' });

    console.log(`🔐 Sesión iniciada: ${email}`);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Error en login:", error.message);
    res.status(500).json({ error: "Error al iniciar sesión." });
  }
});

// --- ENDPOINT MUSA AI (TRY-ON) ---

app.post('/api/try-on', async (req, res) => {
  try {
    const { personUri, garmentUri, garmentDescription, category, userId } = req.body;

    if (!personUri || !garmentUri) {
      return res.status(400).json({ error: "Faltan imágenes." });
    }

    // LÓGICA DE CACHÉ RECUPERADA
    const cacheKey = generateCacheKey(personUri, garmentUri, category);
    if (predictionCache.has(cacheKey)) {
      console.log("🚀 [Caché] ¡Resultado encontrado!");
      return res.json({ image: predictionCache.get(cacheKey), cached: true });
    }

    console.log(`--- Nueva petición Musa AI para usuario ${userId}: ${garmentDescription} ---`);
    logMemoryUsage();
    
    const startTime = Date.now();

    const [personOptimized, garmentOptimized] = await Promise.all([
      optimizeImage(personUri, "Persona"),
      optimizeImage(garmentUri, "Prenda")
    ]);

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

    console.log("Esperando procesamiento de la IA...");
    const result = await replicate.wait(prediction);
    const finalImageUrl = Array.isArray(result.output) ? result.output[0] : result.output;

    // GUARDADO EN HISTORIAL
    if (userId) {
      try {
        const newGen = new Generation({
          userId,
          personImage: personOptimized,
          garmentImage: garmentOptimized,
          resultImage: finalImageUrl,
          category,
          description: garmentDescription
        });
        await newGen.save();
        console.log("✅ Generación guardada en el historial de MongoDB.");
      } catch (dbErr) {
        console.error("⚠️ Error guardando en historial:", dbErr.message);
      }
    }

    predictionCache.set(cacheKey, finalImageUrl);
    
    const totalTime = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`¡Generación completada en ${totalTime}s!`);
    
    res.json({ image: finalImageUrl, cached: false });

  } catch (error) {
    console.error("Error en Musa AI:", error.message);
    res.status(500).json({ error: "Error en la generación." });
  }
});

/**
 * ENDPOINTS DE HISTORIAL (ACTUALIZADOS)
 */

// Recuperar historial por userId
app.get('/api/history/:userId', async (req, res) => {
  try {
    const history = await Generation.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    console.error("Error obteniendo historial:", error.message);
    res.status(500).json({ error: "Error obteniendo el historial." });
  }
});

// NUEVO: Eliminar generación específica
app.delete('/api/history/:id', async (req, res) => {
  try {
    await Generation.findByIdAndDelete(req.params.id);
    console.log(`🗑️ Registro eliminado: ${req.params.id}`);
    res.json({ message: "Eliminado con éxito" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el registro." });
  }
});

// --- INICIO DEL SERVIDOR ---
const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Iconic Backend Online - Puerto ${PORT}`);
  logMemoryUsage();
});