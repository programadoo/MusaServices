import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression'; // Mejora de rendimiento
import mongoose from 'mongoose';
import connectDB from './config/db.js';

// --- 🛣️ IMPORTACIÓN DE RUTAS ---
import authRoutes from './routes/authRoutes.js';
import tryOnRoutes from './routes/tryOnRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

const app = express();

// --- 🛡️ MIDDLEWARES DE SEGURIDAD Y RENDIMIENTO ---
app.use(helmet());      // Protege cabeceras HTTP
app.use(compression()); // Comprime respuestas para mayor velocidad

// Configuración de CORS Profesional (Villatech Standard)
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3001',
  process.env.FRONTEND_URL 
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('🚫 Bloqueado por políticas de seguridad de Villatech (CORS)'));
    }
  },
  methods: ["GET", "POST", "DELETE", "PUT"],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'x-nowpayments-sig']
}));

// Límite de carga para procesar imágenes en Base64 sin caídas
app.use(express.json({ limit: '15mb' }));

// --- 🗄️ CONEXIÓN A BASE DE DATOS ---
connectDB();

// --- 🚀 ENRUTADOR PRINCIPAL ---
// Centralizamos todas las rutas bajo prefijos lógicos
app.use('/api/auth', authRoutes);      // Registro, Login, Perfil
app.use('/api/try-on', tryOnRoutes);   // Generación IA, Historial, Borrado
app.use('/api/credits', paymentRoutes); // Pagos y Webhooks de NowPayments

// --- 🟢 HEALTH CHECK ---
// Ruta raíz para que Render/Railway sepa que el servicio está activo
app.get('/', (req, res) => {
  res.status(200).json({ 
    status: "online", 
    service: "Musa AI API", 
    owner: "Villatech",
    version: "1.1.0" 
  });
});

// --- ❌ MANEJO DE RUTAS NO ENCONTRADAS ---
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada en el servidor de Musa." });
});

// --- 🏁 INICIO DEL SERVIDOR ---
const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  console.log(`🚀 MUSA AI MODULAR - Operando en puerto ${PORT}`);
});

// --- 🛑 GRACEFUL SHUTDOWN ---
// Asegura que no queden conexiones colgadas al reiniciar o apagar el servidor
process.on('SIGTERM', () => {
  console.log('🛑 Señal SIGTERM recibida. Cerrando conexiones...');
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log('📡 Conexión a MongoDB cerrada exitosamente.');
      process.exit(0);
    });
  });
});