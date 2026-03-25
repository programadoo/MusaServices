import React, { useState, useEffect, useRef, useContext } from 'react';
import { predictTryOn } from '../../services/aiService';
import { EcommerceContext } from "../context/EcommerceContext"; 
import { AuthContext } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  productImage: string;
  aiImage: string;
  productName: string;
  aiDescription: string;
  aiCategory: "dresses" | "upper_body" | "lower_body";
}

export const ModalTryOn: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  productImage, 
  aiImage, 
  productName, 
  aiDescription, 
  aiCategory 
}) => {
  const auth = useContext(AuthContext);
  const user = auth?.user;

  const [file, setFile] = useState<File | null>(null);
  const [localPhotoUrl, setLocalPhotoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("Iniciando motor...");
  
  const [sliderPos, setSliderPos] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Bloqueo de scroll
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  // Preview de imagen local
  useEffect(() => {
    if (!file) { setLocalPhotoUrl(null); return; }
    const url = URL.createObjectURL(file);
    setLocalPhotoUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // Simulación de progreso y mensajes
  useEffect(() => {
    let interval: any;
    let timeoutIds: any[] = [];
    if (loading) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev < 30) return prev + 2;
          if (prev < 70) return prev + 0.5;
          if (prev < 98) return prev + 0.1;
          return prev;
        });
      }, 200);

      const messages = [
        { time: 0, msg: "Analizando morfología..." },
        { time: 4000, msg: "Mapeando texturas del Drop..." },
        { time: 10000, msg: "Sincronizando con Musa Engine v1.0..." },
        { time: 18000, msg: "Renderizando caída de tela..." },
      ];

      messages.forEach(({ time, msg }) => {
        const id = setTimeout(() => setStatusMessage(msg), time);
        timeoutIds.push(id);
      });
    }
    return () => { clearInterval(interval); timeoutIds.forEach(clearTimeout); };
  }, [loading]);

  const handleMove = (e: any) => {
    if (!isResizing || !containerRef.current) return;
    const container = containerRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const x = clientX - container.left;
    const position = Math.max(0, Math.min(100, (x / container.width) * 100));
    setSliderPos(position);
  };

  const handleProcess = async () => {
    if (!file || !user?.id) return;
    setLoading(true);
    try {
      const response = await fetch(aiImage);
      const garmentBlob = await response.blob();
      const output = await predictTryOn(file, garmentBlob, aiDescription, aiCategory, user.id);
      setResult(output);
      setProgress(100);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/90 backdrop-blur-xl p-0 md:p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-[#0A0A0A] w-full max-w-6xl h-full md:h-auto md:max-h-[90vh] md:rounded-[4rem] overflow-hidden border border-white/10 flex flex-col md:flex-row shadow-[0_0_100px_rgba(236,72,153,0.15)] relative"
      >
        
        {/* BOTÓN CERRAR */}
        <button 
          onClick={onClose} 
          className="absolute top-8 right-8 z-[100] w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all"
        >
          <i className="fas fa-times text-white"></i>
        </button>

        {/* --- PANEL IZQUIERDO: CONTROLES --- */}
        <div className="p-10 md:p-16 md:w-[40%] flex flex-col justify-center bg-[#111111] border-r border-white/5">
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 mb-6">
              <span className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-pulse"></span>
              <span className="text-[9px] font-black text-pink-500 uppercase tracking-widest">Neural Fitting Active</span>
            </div>
            <h2 className="text-5xl font-black uppercase tracking-tighter leading-[0.85] text-white mb-4">
              Musa <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">Virtual Try-On</span>
            </h2>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em] italic">{productName}</p>
          </div>

          {!result ? (
            <div className="space-y-8">
              <div className={`group border-2 border-dashed rounded-[3rem] p-12 text-center relative transition-all duration-700 
                ${file ? 'border-pink-500/50 bg-pink-500/5' : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]'}`}>
                <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-20" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                <div className={`w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center transition-all duration-700 
                  ${file ? 'bg-pink-500 shadow-[0_0_30px_rgba(236,72,153,0.4)]' : 'bg-white/5 text-gray-600'}`}>
                  <i className={`fas ${file ? 'fa-check' : 'fa-plus'} text-2xl text-white`}></i>
                </div>
                <p className="text-[12px] font-black uppercase tracking-widest text-white">{file ? "Imagen Procesada" : "Cargar Retrato"}</p>
                <p className="text-[9px] text-gray-600 mt-2 font-bold uppercase tracking-widest italic">{file ? file.name : "Optimizado para retratos frontales"}</p>
              </div>

              {loading ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black uppercase text-pink-500 tracking-widest animate-pulse">{statusMessage}</span>
                    <span className="text-2xl font-black text-white">{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                    <motion.div 
                      className="bg-pink-500 h-full shadow-[0_0_15px_rgba(236,72,153,0.5)]" 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <button 
                  onClick={handleProcess} 
                  disabled={!file} 
                  className="w-full bg-white text-black py-6 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-pink-500 hover:text-white disabled:opacity-20 disabled:grayscale transition-all shadow-2xl active:scale-95"
                >
                  Ejecutar Simulación
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <button onClick={() => {
                const link = document.createElement('a');
                link.href = result;
                link.download = `musa-${productName}.png`;
                link.click();
              }} className="w-full bg-pink-500 text-white py-6 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-[0_0_30px_rgba(236,72,153,0.3)] hover:bg-pink-600 transition-all flex items-center justify-center gap-4">
                <i className="fas fa-cloud-download-alt"></i> Descargar Master
              </button>
              <button onClick={() => { setFile(null); setResult(null); }} className="w-full border border-white/10 py-6 rounded-2xl font-black text-[11px] uppercase tracking-widest text-gray-500 hover:bg-white/5 transition-all">
                Nuevo Intento
              </button>
            </div>
          )}
        </div>

        {/* --- PANEL DERECHO: VISUALIZADOR --- */}
        <div className="md:w-[60%] bg-[#080808] relative flex items-center justify-center p-8 md:p-20">
          
          {/* Decoración de fondo */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-pink-500/5 via-transparent to-transparent opacity-50"></div>

          {result && localPhotoUrl ? (
            <div 
              ref={containerRef}
              className="relative w-full aspect-[3/4] max-w-[450px] rounded-[3rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.8)] border border-white/10 cursor-col-resize group"
              onMouseMove={handleMove}
              onTouchMove={handleMove}
              onMouseDown={() => setIsResizing(true)}
              onMouseUp={() => setIsResizing(false)}
              onMouseLeave={() => setIsResizing(false)}
            >
              <img src={result} alt="Musa AI" className="absolute inset-0 w-full h-full object-cover" />
              
              <motion.div 
                className="absolute inset-0 w-full h-full overflow-hidden border-r border-white/30 z-10"
                style={{ width: `${sliderPos}%` }}
              >
                <img src={localPhotoUrl} alt="Original" className="absolute inset-0 w-[450px] md:w-[500px] h-full object-cover max-w-none grayscale-[0.5]" />
                <div className="absolute top-8 left-8 bg-black/60 backdrop-blur-md text-white text-[9px] font-black px-4 py-2 rounded-xl uppercase tracking-widest border border-white/10">Input_Photo</div>
              </motion.div>

              {/* Slider Handle */}
              <div className="absolute top-0 bottom-0 z-20 w-[1px] bg-white/50" style={{ left: `${sliderPos}%` }}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-[0_0_30px_rgba(255,255,255,0.4)] flex items-center justify-center text-black group-active:scale-125 transition-transform duration-300">
                  <i className="fas fa-arrows-alt-h text-sm"></i>
                </div>
              </div>

              <div className="absolute top-8 right-8 bg-pink-500 text-white text-[9px] font-black px-4 py-2 rounded-xl uppercase tracking-widest shadow-lg z-20">Musa_Output_v1</div>
            </div>
          ) : (
            <div className="text-center relative z-10">
              <motion.div 
                animate={{ rotate: [2, -2, 2] }}
                transition={{ duration: 6, repeat: Infinity }}
                className="relative inline-block"
              >
                <img src={productImage} alt="Prenda" className="w-56 h-72 md:w-64 md:h-80 object-cover rounded-[3rem] shadow-2xl border border-white/10 brightness-75 group-hover:brightness-100 transition-all" />
                <div className="absolute -bottom-6 -right-6 bg-pink-500 text-white w-16 h-16 rounded-full flex items-center justify-center border-4 border-[#080808] shadow-xl">
                  <i className="fas fa-bolt text-lg"></i>
                </div>
              </motion.div>
              <p className="mt-12 text-[10px] font-black text-gray-700 uppercase tracking-[0.6em] animate-pulse">Esperando archivo de entrada...</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ModalTryOn;