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
app.use(helmet());      
app.use(compression()); 

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3001',
  process.env.FRONTEND_URL?.replace(/\/$/, "")
];

app.use(cors({
  origin: function (origin, callback) {
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

app.use(express.json({ limit: '15mb' }));

// --- 🚦 LIMITADORES DE TRÁFICO ---
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/', apiLimiter);

// --- 🚀 ENRUTADOR PRINCIPAL ---
app.use('/api/auth', authRoutes);
app.use('/api/try-on', tryOnRoutes);
app.use('/api/credits', paymentRoutes);

// --- 🟢 HEALTH CHECK ---
app.get('/', (req, res) => {
  res.status(200).json({ 
    status: "online", 
    service: "Musa AI API", 
    owner: "Villatech",
    version: "1.1.0",
    timestamp: new Date().toISOString()
  });
});

app.use((req, res) => {
  res.status(404).json({ error: "La ruta solicitada no existe en el motor de Musa." });
});

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
});

// --- 🛑 CIERRE CONTROLADO (Graceful Shutdown) ---
// Función unificada para cerrar todo correctamente
const gracefulShutdown = async (signal) => {
  console.log(`\n🔴 Señal ${signal} recibida. Finalizando Musa Engine...`);
  
  // 1. Cerramos el servidor de Express (deja de aceptar peticiones)
  server.close(async () => {
    console.log('📡 Servidor HTTP cerrado.');
    
    try {
      // 2. Cerramos la conexión a la base de datos (Sin callbacks)
      await mongoose.connection.close();
      console.log('✅ Conexión a MongoDB finalizada correctamente.');
      process.exit(0);
    } catch (err) {
      console.error('❌ Error al cerrar los servicios:', err);
      process.exit(1);
    }
  });
};

// Escuchamos SIGTERM (Render) y SIGINT (Ctrl+C en local)
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));