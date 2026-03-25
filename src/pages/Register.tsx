import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("✨ ¡Cuenta creada con éxito! Bienvenid@ a la vanguardia.");
        navigate("/login");
      } else {
        alert(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error al conectar con el servidor:", error);
      alert("Falla de conexión con el servidor central.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0A0A0A] px-6 py-20 relative overflow-hidden">
      
      {/* GLOW DE FONDO AMBIENTAL */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-600/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md w-full bg-[#111111] rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] p-10 md:p-14 border border-white/5 relative z-10"
      >
        <div className="text-center mb-12">
          <Link to="/" className="inline-block mb-8 group">
            <h1 className="text-3xl font-black tracking-tighter uppercase text-white transition-all group-hover:tracking-widest duration-500 italic">
              MUSA <span className="text-pink-500 text-[10px] not-italic align-top tracking-[0.3em] ml-1">JOIN</span>
            </h1>
          </Link>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white tracking-tight uppercase">Crear Cuenta</h2>
            <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.4em] flex items-center justify-center gap-2">
                <span className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></span>
                Protocolo de Registro Activo
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* CAMPO: NOMBRE */}
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 ml-6 block">Full Identity</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-8 py-5 rounded-2xl bg-black border border-white/5 text-white focus:border-pink-500 focus:ring-4 focus:ring-pink-500/5 outline-none transition-all font-bold text-xs placeholder:text-gray-800"
              placeholder="ALEJANDRO VILLANUEVA"
            />
          </div>

          {/* CAMPO: EMAIL */}
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 ml-6 block">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-8 py-5 rounded-2xl bg-black border border-white/5 text-white focus:border-pink-500 focus:ring-4 focus:ring-pink-500/5 outline-none transition-all font-bold text-xs placeholder:text-gray-800"
              placeholder="TU@EMAIL.COM"
            />
          </div>

          {/* CAMPO: PASSWORD */}
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 ml-6 block">Access Code</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-8 py-5 rounded-2xl bg-black border border-white/5 text-white focus:border-pink-500 focus:ring-4 focus:ring-pink-500/5 outline-none transition-all font-bold text-xs placeholder:text-gray-800"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-6 bg-white text-black rounded-[2rem] font-black uppercase text-[10px] tracking-[0.4em] shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3 mt-8
              ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-pink-500 hover:text-white hover:shadow-pink-500/40"}`}
          >
            {loading ? <i className="fas fa-circle-notch animate-spin"></i> : "Inicializar Registro"}
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-white/5 text-center">
          <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">
            ¿Ya eres miembro? <Link to="/login" className="text-white hover:text-pink-500 ml-2 font-black transition-colors underline underline-offset-8">Identificarse</Link>
          </p>
        </div>
      </motion.div>

      {/* ELEMENTO DECORATIVO DE VERSIÓN */}
      <div className="fixed bottom-8 right-8 pointer-events-none opacity-20">
          <p className="text-[10px] text-white font-black uppercase tracking-[0.5em] rotate-90 origin-right">MUSA_SYSTEM_v1.0</p>
      </div>
    </div>
  );
};

export default Register;