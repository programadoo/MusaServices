import { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../shared/context/AuthContext";
import toast from 'react-hot-toast';

const CATEGORIES = [
  { id: "upper_body", label: "Superior", icon: "👕" },
  { id: "lower_body", label: "Inferior", icon: "👖" },
  { id: "dresses", label: "Vestidos", icon: "👗" },
];

const MusaAI = () => {
  const auth = useContext(AuthContext);
  const user = auth?.user;
  const token = auth?.token; // Extraemos el token para el blindaje
  const API_URL = import.meta.env.VITE_API_URL;

  const [personImage, setPersonImage] = useState<string | null>(null);
  const [garmentImage, setGarmentImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [category, setCategory] = useState("upper_body");
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validación de peso (opcional pero recomendada)
      if (file.size > 10 * 1024 * 1024) return toast.error("La imagen es demasiado pesada (Máx 10MB)");
      
      const reader = new FileReader();
      reader.onloadend = () => setter(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const generateTryOn = async () => {
    if (!personImage || !garmentImage) return toast.error("Por favor sube ambas fotos.");
    if (!token || !user?.id) return toast.error("Sesión inválida. Por favor re-ingresa al sistema.");

    setLoading(true);
    setResultImage(null);

    try {
      const response = await fetch(`${API_URL}/api/try-on`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // Inyectamos el blindaje JWT
        },
        body: JSON.stringify({
          personUri: personImage,
          garmentUri: garmentImage,
          garmentDescription: `Musa Try-On: ${category}`,
          category: category,
          userId: user.id 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const finalUrl = Array.isArray(data.image) ? data.image[0] : data.image;
        setResultImage(finalUrl);
        
        // Actualizamos los créditos en el estado global si el backend los devuelve
        if (data.remainingCredits !== undefined) {
          auth.updateCredits(data.remainingCredits);
        }
      } else {
        // Manejo de errores específicos (ej: falta de créditos)
        const errorMsg = data.error || "Error desconocido en Musa Engine";
        toast.error(`❌ Fallo en el Motor: ${errorMsg}`);
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      toast.error("Error de enlace con Musa Engine. Revisa tu conexión.");
    } finally {
      setLoading(false);
    }
  };

  const downloadResult = async () => {
    if (!resultImage) return;
    try {
      const response = await fetch(resultImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `musa-export-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      toast.error("No se pudo descargar la imagen.");
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 bg-[#0A0A0A] text-white overflow-hidden relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-pink-500/5 blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Encabezado Táctico */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-white/5 pb-10">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-pink-500 mb-4 block">
                Musa Engine / Lab v1.0
            </span>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">
                Vestidor <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 text-4xl md:text-6xl">Digital</span>
            </h1>
          </div>
          <div className="text-right">
              <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest italic">User: {user?.name || 'Guest'}</p>
              <p className="text-[11px] font-black text-pink-500 uppercase flex items-center justify-end gap-2">
                  Credits: {user?.credits ?? 0}
              </p>
          </div>
        </div>

        {/* Selector de Categoría */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 border backdrop-blur-md ${
                category === cat.id 
                ? "bg-white text-black border-white shadow-[0_0_30px_rgba(255,255,255,0.2)] scale-105" 
                : "bg-white/5 text-gray-400 border-white/5 hover:bg-white/10"
              }`}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-stretch">
          
          {/* 1. INPUT PERSONA */}
          <div className="group">
            <div className="mb-4 flex justify-between items-center px-2">
                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500">01 / Retrato</label>
                {personImage && <span className="text-[8px] text-pink-500 font-black uppercase italic animate-pulse">Ready</span>}
            </div>
            <div className={`relative aspect-[3/4] rounded-[3rem] border-2 border-dashed transition-all overflow-hidden bg-[#111] ${personImage ? 'border-pink-500/50' : 'border-white/10 hover:border-white/30'}`}>
              {personImage ? (
                <img src={personImage} className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700" alt="Persona" />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-700 space-y-4">
                  <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <i className="fas fa-camera text-xl"></i>
                  </div>
                  <p className="text-[9px] font-black uppercase tracking-widest">Cargar Retrato</p>
                </div>
              )}
              <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setPersonImage)} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
            </div>
          </div>

          {/* 2. INPUT PRENDA */}
          <div className="group">
            <div className="mb-4 flex justify-between items-center px-2">
                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500">02 / Prenda</label>
                {garmentImage && <span className="text-[8px] text-pink-500 font-black uppercase italic animate-pulse">Analyzed</span>}
            </div>
            <div className={`relative aspect-[3/4] rounded-[3rem] border-2 border-dashed transition-all overflow-hidden bg-[#111] ${garmentImage ? 'border-pink-500/50' : 'border-white/10 hover:border-white/30'}`}>
              {garmentImage ? (
                <img src={garmentImage} className="w-full h-full object-cover" alt="Prenda" />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-700 space-y-4">
                  <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <i className="fas fa-tshirt text-xl"></i>
                  </div>
                  <p className="text-[9px] font-black uppercase tracking-widest">Cargar Prenda</p>
                </div>
              )}
              <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setGarmentImage)} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
            </div>
          </div>

          {/* 3. RESULTADO */}
          <div className="flex flex-col">
            <div className="mb-4 flex justify-between items-center px-2">
                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-pink-500">03 / Resultado Musa</label>
            </div>
            <div className="relative aspect-[3/4] rounded-[3rem] bg-[#111] border border-white/5 overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)]">
              <AnimatePresence>
                {loading && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }} 
                    className="absolute inset-0 z-20 bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center"
                  >
                    <motion.div 
                        animate={{ top: ['0%', '100%', '0%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 w-full h-1 bg-pink-500/50 shadow-[0_0_20px_#ec4899] z-30"
                    />
                    <div className="w-16 h-16 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mb-6"></div>
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">Rendering Musa_v1...</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {resultImage ? (
                <motion.img 
                    initial={{ opacity: 0, scale: 1.1 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    src={resultImage} 
                    className="w-full h-full object-cover" 
                    alt="Resultado" 
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-800 p-10 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] leading-relaxed">
                        Execute the core to generate visualization
                    </p>
                </div>
              )}
            </div>

            <div className="mt-8 space-y-4 flex-1 flex flex-col justify-end">
              <button 
                onClick={generateTryOn}
                disabled={loading || !personImage || !garmentImage || (user?.credits ?? 0) <= 0}
                className="w-full py-8 bg-white text-black rounded-[2rem] font-black uppercase text-[12px] tracking-[0.5em] transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)] active:scale-95 disabled:opacity-10 hover:bg-pink-500 hover:text-white"
              >
                {loading ? "Sincronizando..." : (user?.credits ?? 0) <= 0 ? "Sin Créditos" : "RUN MUSA CORE"}
              </button>

              <AnimatePresence>
                {resultImage && !loading && (
                  <motion.button 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={downloadResult}
                    className="w-full py-4 bg-white/5 border border-white/10 text-white rounded-full font-black uppercase text-[9px] tracking-[0.3em] hover:bg-white/10 transition-all flex items-center justify-center gap-3"
                  >
                    <i className="fas fa-download"></i> Export High-Res
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusaAI;