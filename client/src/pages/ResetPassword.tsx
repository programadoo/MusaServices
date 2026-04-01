import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  
  const token = searchParams.get("token");

  const handleSubmit = async (e: React.FormEvent) => { // ✅ Corregido para TS
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      return toast.error("Las contraseñas no coinciden, verifica el protocolo.");
    }

    if (newPassword.length < 6) {
      return toast.error("La clave debe tener al menos 6 caracteres.");
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("✅ Protocolo de acceso actualizado. Ya puedes usar tu nueva clave.");
        setTimeout(() => navigate("/login"), 3000);
      } else {
        toast.error(`❌ Error: ${data.error || 'Token inválido o expirado'}`);
      }
    } catch (error) {
      toast.error("⚠️ Fallo de conexión con el servidor de VillaTech.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-white font-black uppercase tracking-widest text-[10px]">
        Acceso Denegado: Token de recuperación ausente.
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0A0A0A] px-6 py-20 relative overflow-hidden">
      {/* GLOW DE FONDO ESTRATÉGICO */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-pink-500/10 rounded-full blur-[160px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-[#111111] rounded-[3.5rem] p-10 md:p-16 border border-white/5 relative z-10"
      >
        <div className="text-center mb-14">
          <h1 className="text-2xl font-black text-white tracking-tight uppercase italic mb-2">Restablecer Clave</h1>
          <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.4em]">Security Override / Reset Mode</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-600 ml-6 block">Nueva Contraseña</label>
            <input 
              type="password" 
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-8 py-6 rounded-2xl bg-black border border-white/5 text-white focus:border-pink-500 outline-none transition-all font-bold text-xs"
              placeholder="••••••••"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-600 ml-6 block">Confirmar Protocolo</label>
            <input 
              type="password" 
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-8 py-6 rounded-2xl bg-black border border-white/5 text-white focus:border-pink-500 outline-none transition-all font-bold text-xs"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-6 bg-white text-black rounded-[2rem] font-black uppercase text-[10px] tracking-[0.4em] shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3
              ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-pink-500 hover:text-white"}`}
          >
            {loading ? "Actualizando..." : "Confirmar Nueva Clave"}
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

export default ResetPassword;