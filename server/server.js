import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression'; 
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import { apiLimiter, authLimiter } from './middlewares/rateLimiter.js'; 
import './workers/aiWorker.js'; 

// --- 🛣️ IMPORTACIÓN DE RUTAS ---
import authRoutes from './routes/authRoutes.js';
import tryOnRoutes from './routes/tryOnRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

const app = express();

// --- 🗄️ CONEXIÓN A BASE DE DATOS ---
connectDB();

// --- 🛡️ MIDDLEWARES DE SEGURIDAD Y RENDIMIENTO ---
app.use(helmet());      // Protege cabeceras contra ataques comunes
app.use(compression()); // Comprime payloads (vital para imágenes en Base64)

// Configuración de CORS con normalización de URLs
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3001',
  process.env.FRONTEND_URL?.replace(/\/$/, "") // Elimina barra final si existe
];

app.use(cors({
  origin: function (origin, callback) {
    // Permitir peticiones sin origen (como Postman o Server-to-Server) 
    // y validar orígenes permitidos normalizando la barra final
    const normalizedOrigin = origin ? origin.replace(/\/$/, "") : null;
    
    if (!origin || allowedOrigins.includes(normalizedOrigin)) {
      callback(null, true);
    } else {
      callback(new Error('🚫 Bloqueado por políticas de seguridad de Villatech (CORS)'));
    }
  },
  methods: ["GET", "POST", "DELETE", "PUT"],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'x-nowpayments-sig']
}));

// Límite de carga para procesar imágenes en Base64
app.use(express.json({ limit: '15mb' }));

// --- 🚦 LIMITADORES DE TRÁFICO (Anti-DoS) ---
app.use('/api/auth/login', authLimiter);    // Protege contra fuerza bruta en login
app.use('/api/auth/register', authLimiter); // Evita spam de creación de cuentas
app.use('/api/', apiLimiter);               // Límite general para el resto de la API

// --- 🚀 ENRUTADOR PRINCIPAL ---
app.use('/api/auth', authRoutes);
app.use('/api/try-on', tryOnRoutes);
app.use('/api/credits', paymentRoutes);

// --- 🟢 HEALTH CHECK (Para Render/UptimeRobot) ---
app.get('/', (req, res) => {
  res.status(200).json({ 
    status: "online", 
    service: "Musa AI API", 
    owner: "Villatech",
    version: "1.1.0",
    timestamp: new Date().toISOString()
  });
});

// --- ❌ MANEJO DE RUTAS NO ENCONTRADAS ---
app.use((req, res) => {
  res.status(404).json({ error: "La ruta solicitada no existe en el motor de Musa." });
});

// --- 🚨 MANEJO GLOBAL DE ERRORES ---
// Evita que el servidor se caiga y oculta detalles técnicos al cliente
app.use((err, req, res, next) => {
  console.error(`[SYSTEM_ERROR] [${new Date().toISOString()}]:`, err.stack);

  if (err.message === '🚫 Bloqueado por políticas de seguridad de Villatech (CORS)') {
    return res.status(403).json({ error: err.message });
  }

  res.status(err.status || 500).json({
    error: "Error interno en el servidor de Musa AI.",
    code: "INTERNAL_SERVER_ERROR"
  });
});

// --- 🏁 INICIO DEL SERVIDOR ---
const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  console.log(`🚀 MUSA ENGINE OPERACIONAL - Puerto: ${PORT}`);
  console.log(`🌍 Origen permitido: ${process.env.FRONTEND_URL}`);
});

// --- 🛑 CIERRE CONTROLADO (Graceful Shutdown) ---
process.on('SIGTERM', () => {
  console.log('🛑 Señal SIGTERM recibida. Finalizando procesos de Musa...');
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log('📡 Conexiones de base de datos cerradas. Apagado seguro.');
      process.exit(0);
    });
  });
});