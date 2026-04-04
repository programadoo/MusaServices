import { useState, useContext, useEffect } from "react";
import { useNavigate, Link, useLocation, useSearchParams } from "react-router-dom"; // Añadido useSearchParams
import { motion } from "framer-motion";
import { AuthContext } from "../shared/context/AuthContext";
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams(); // Hook para leer parámetros de URL
  const auth = useContext(AuthContext);
  const API_URL = import.meta.env.VITE_API_URL;

  // --- NUEVA LÓGICA: DETECTAR VERIFICACIÓN EXITOSA ---
  useEffect(() => {
    if (searchParams.get('verified') === 'true') {
      toast.success("✅ Cuenta Verificada con Éxito. Protocolo de acceso habilitado.", {
        duration: 5000,
        style: {
          borderRadius: '20px',
          background: '#111',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.1)',
          fontSize: '12px',
          fontWeight: 'bold'
        }
      });
      
      // Limpiamos el parámetro de la URL para que no reaparezca el toast al recargar
      searchParams.delete('verified');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // Redirección si ya está autenticado
  useEffect(() => {
    if (auth?.isAuthenticated) {
      navigate("/perfil", { replace: true });
    }
  }, [auth?.isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      localStorage.removeItem('token');

      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        auth?.login(data.user, data.token);
        
        const origin = (location.state as any)?.from?.pathname || "/perfil";
        navigate(origin, { replace: true });
      } else {
        // Manejo específico si la cuenta no está verificada (Error 403 que pusimos en el Backend)
        if (response.status === 403 && data.code === "EMAIL_NOT_VERIFIED") {
          toast.error("⚠️ Acceso Restringido: Debes verificar tu correo electrónico.", {
            icon: '📧'
          });
        } else {
          toast.error(`❌ Acceso Denegado: ${data.error || 'Verifica tus credenciales'}`);
        }
      }
    } catch (error) {
      console.error("Error crítico de conexión:", error);
      toast.error("⚠️ Error de Protocolo: No se pudo establecer conexión con VillaTech.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0A0A0A] px-6 py-20 relative overflow-hidden">
      
      {/* GLOW DE FONDO ESTRATÉGICO */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-pink-500/10 rounded-full blur-[160px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[160px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md w-full bg-[#111111] rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] p-10 md:p-16 border border-white/5 relative z-10"
      >
        {/* LOGO & TEXTO */}
        <div className="text-center mb-14">
          <Link to="/" className="inline-block mb-8 group">
            <h1 className="text-3xl font-black tracking-tighter uppercase text-white transition-all group-hover:tracking-widest duration-500">
              MUSA <span className="text-pink-500 text-[10px] align-top tracking-widest ml-1 font-black">CORE</span>
            </h1>
          </Link>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white tracking-tight uppercase italic">Bienvenido</h2>
            <div className="flex items-center justify-center gap-2">
                <span className="w-4 h-[1px] bg-pink-500"></span>
                <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.4em]">Auth Gate / Protocol v1.0</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-600 ml-6 block">User Identifier</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-8 py-6 rounded-2xl bg-black border border-white/5 text-white focus:border-pink-500 focus:ring-4 focus:ring-pink-500/5 outline-none transition-all font-bold text-xs placeholder:text-gray-800"
              placeholder="EMAIL@DOMAIN.COM"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-600 ml-6 block">Security Access</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-8 py-6 rounded-2xl bg-black border border-white/5 text-white focus:border-pink-500 focus:ring-4 focus:ring-pink-500/5 outline-none transition-all font-bold text-xs placeholder:text-gray-800"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-6 bg-white text-black rounded-[2rem] font-black uppercase text-[10px] tracking-[0.4em] shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3 mt-10
              ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-pink-500 hover:text-white hover:shadow-pink-500/40"}`}
          >
            {loading ? <i className="fas fa-circle-notch animate-spin"></i> : "Acceder al Sistema"}
          </button>
        </form>

        <div className="mt-14 pt-8 border-t border-white/5 text-center flex flex-col gap-4">
          <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">
            ¿Sin acceso? <Link to="/register" className="text-white hover:text-pink-500 ml-2 font-black transition-colors underline underline-offset-8">Solicitar Registro</Link>
          </p>
          {/* OPCIONAL: Link de recuperar contraseña */}
          <Link to="/forgot-password" className="text-[8px] font-black text-gray-700 hover:text-white uppercase tracking-widest transition-colors">
            Recuperar Llave de Acceso
          </Link>
        </div>
      </motion.div>

      {/* FOOTER DECOR */}
      <div className="fixed bottom-8 w-full text-center pointer-events-none">
          <p className="text-[8px] text-gray-800 font-black uppercase tracking-[1em]">Secure Environment / VillaTech Systems</p>
      </div>
    </div>
  );
};

export default Login;