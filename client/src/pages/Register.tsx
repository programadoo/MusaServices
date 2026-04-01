import { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../shared/context/AuthContext";
// Comentado temporalmente para Localhost
// import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import toast from 'react-hot-toast';
import { Check, X, ShieldCheck, Zap } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Estado para validación de password (REQUISITOS PUNTO 1)
  const [passValidations, setPassValidations] = useState({
    length: false,
    upper: false,
    number: false,
    special: false
  });

  // const { executeRecaptcha } = useGoogleReCaptcha(); // Comentado
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const API_URL = import.meta.env.VITE_API_URL;

  // Lógica de validación en tiempo real
  useEffect(() => {
    setPassValidations({
      length: password.length >= 8,
      upper: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    });
  }, [password]);

  // El botón solo se activa si todo está OK
  const isFormValid = name && email && Object.values(passValidations).every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return toast.error("La clave no cumple con los protocolos de seguridad.");

    setLoading(true);

    try {
      // 1. Simulación/Ejecución de Captcha (Comentado para dev)
      /* if (!executeRecaptcha) {
        toast.error("Error de comunicación con el servicio de seguridad");
        return;
      }
      const captchaToken = await executeRecaptcha('register'); 
      */

      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            name, 
            email, 
            password, 
            // captchaToken // Se enviará cuando despliegues
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.token && data.user) {
          localStorage.setItem('token', data.token);
          auth?.login(data.user, data.token);
          toast.success("✨ Identidad verificada. Bienvenido a Musa.");
          navigate("/perfil");
        } else {
          toast.success("✅ Registro exitoso. Por favor, identifícate.");
          navigate("/login");
        }
      } else {
        toast.error(`❌ Error: ${data.error || "Datos inválidos"}`);
      }
    } catch (error) {
      toast.error("⚠️ Falla de Red: El servidor central no responde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0A0A0A] px-6 py-20 relative overflow-hidden font-sans">
      
      {/* Efectos visuales de fondo */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-600/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-[#111111] rounded-[3.5rem] shadow-2xl p-10 md:p-14 border border-white/5 relative z-10"
      >
        <div className="text-center mb-10">
          <Link to="/" className="inline-block mb-6 group">
            <h1 className="text-3xl font-black tracking-tighter uppercase text-white transition-all group-hover:tracking-widest duration-500 italic">
              MUSA <span className="text-pink-500 text-[10px] not-italic align-top tracking-[0.3em] ml-1">SYSTEM</span>
            </h1>
          </Link>
          <h2 className="text-2xl font-black text-white tracking-tight uppercase italic flex items-center justify-center gap-3">
             <ShieldCheck size={24} className="text-pink-500" /> Registro v1.1
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-500 ml-6 block">Nombre Completo</label>
            <input 
              type="text" required value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-8 py-5 rounded-2xl bg-black border border-white/5 text-white focus:border-pink-500 outline-none transition-all font-bold text-xs"
              placeholder="ALEJANDRO VILLANUEVA"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-500 ml-6 block">Correo Electrónico</label>
            <input 
              type="email" required value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-8 py-5 rounded-2xl bg-black border border-white/5 text-white focus:border-pink-500 outline-none transition-all font-bold text-xs"
              placeholder="CORREO@EJEMPLO.COM"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-500 ml-6 block">Código de Acceso</label>
            <input 
              type="password" required value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-8 py-5 rounded-2xl bg-black border transition-all outline-none font-bold text-xs ${
                password.length > 0 ? (isFormValid ? 'border-green-500/40' : 'border-pink-500/40') : 'border-white/5'
              }`}
              placeholder="••••••••"
            />
            
            {/* Requisitos visuales */}
            <div className="px-5 py-4 bg-black/40 rounded-[1.5rem] border border-white/5 grid grid-cols-2 gap-2">
              <Requirement met={passValidations.length} text="8+ Caracteres" />
              <Requirement met={passValidations.upper} text="1 Mayúscula" />
              <Requirement met={passValidations.number} text="1 Número" />
              <Requirement met={passValidations.special} text="1 Símbolo" />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading || !isFormValid}
            className={`w-full py-6 rounded-[2rem] font-black uppercase text-[10px] tracking-[0.4em] transition-all flex items-center justify-center gap-3 mt-4
              ${isFormValid && !loading ? "bg-white text-black hover:bg-pink-500 hover:text-white" : "bg-white/5 text-gray-700 cursor-not-allowed"}`}
          >
            {loading ? <Zap size={16} className="animate-spin text-pink-500" /> : "Crear Identidad"}
          </button>
        </form>

        <div className="mt-10 pt-6 border-t border-white/5 text-center">
           <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">
             ¿Ya tienes acceso? <Link to="/login" className="text-white hover:text-pink-500 underline underline-offset-8 ml-1 transition-colors">Log In</Link>
           </p>
        </div>
      </motion.div>
    </div>
  );
};

const Requirement = ({ met, text }: { met: boolean; text: string }) => (
  <div className={`flex items-center gap-2 text-[7px] font-black uppercase tracking-widest ${met ? 'text-green-500' : 'text-gray-600'}`}>
    {met ? <Check size={10} /> : <X size={10} />}
    {text}
  </div>
);

export default Register;