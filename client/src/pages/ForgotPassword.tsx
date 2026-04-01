import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.toLowerCase().trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("🚀 Protocolo enviado. Revisa tu bandeja de entrada.", { duration: 5000 });
      } else {
        toast.error(data.error || "Error al solicitar recuperación.");
      }
    } catch (error) {
      toast.error("⚠️ Error de enlace con VillaTech Systems.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0A0A0A] px-6 py-20 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-pink-500/10 rounded-full blur-[160px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-[#111111] rounded-[3.5rem] p-10 md:p-16 border border-white/5 relative z-10"
      >
        <div className="text-center mb-14">
          <h1 className="text-2xl font-black text-white tracking-tight uppercase italic mb-2">Recuperar Llave</h1>
          <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.4em]">Emergency Access / Musa Core</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-600 ml-6 block">User Identifier</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-8 py-6 rounded-2xl bg-black border border-white/5 text-white focus:border-pink-500 outline-none transition-all font-bold text-xs"
              placeholder="EMAIL@DOMAIN.COM"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-6 bg-white text-black rounded-[2rem] font-black uppercase text-[10px] tracking-[0.4em] shadow-2xl transition-all active:scale-95
              ${loading ? "opacity-50" : "hover:bg-pink-500 hover:text-white"}`}
          >
            {loading ? "Procesando..." : "Enviar Instrucciones"}
          </button>
        </form>

        <div className="mt-10 text-center">
            <Link to="/login" className="text-[9px] font-black text-gray-600 uppercase tracking-widest hover:text-white transition-colors">
              Volver al inicio de sesión
            </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;