import React, { useState, useEffect, useRef, useContext } from 'react';
import { predictTryOn } from '../../services/aiService';
// Corregido: Ruta exacta subiendo un nivel desde shared/components a shared/context
import { EcommerceContext } from "../context/ecommerceContext"; 
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
  // Consumo del contexto (opcional si necesitas datos del carrito/usuario aquí)
  const context = useContext(EcommerceContext);
  
  const [file, setFile] = useState<File | null>(null);
  const [localPhotoUrl, setLocalPhotoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("Preparando archivos...");
  
  // Estados para el Slider de Comparación
  const [sliderPos, setSliderPos] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // --- LOCK SCROLL ---
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  // Manejar previsualización de la foto del usuario
  useEffect(() => {
    if (!file) {
      setLocalPhotoUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setLocalPhotoUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // Sistema de Mensajes y Progreso para el Cold Start
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
        { time: 0, msg: "Optimizando imágenes con Sharp..." },
        { time: 5000, msg: "Conectando con servidores GPU..." },
        { time: 15000, msg: "Despertando a la IA (Cold Start)..." },
        { time: 40000, msg: "Analizando texturas y caída..." },
        { time: 70000, msg: "Renderizando outfit final..." },
      ];

      messages.forEach(({ time, msg }) => {
        const id = setTimeout(() => setStatusMessage(msg), time);
        timeoutIds.push(id);
      });
    }

    return () => {
      clearInterval(interval);
      timeoutIds.forEach(clearTimeout);
    };
  }, [loading]);

  // Lógica del Slider Interactiva
  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isResizing || !containerRef.current) return;
    const container = containerRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;
    const x = clientX - container.left;
    const position = Math.max(0, Math.min(100, (x / container.width) * 100));
    setSliderPos(position);
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setLoading(false);
    setProgress(0);
    setStatusMessage("Preparando archivos...");
  };

  const handleProcess = async () => {
    if (!file) return; 
    setLoading(true);
    try {
      const response = await fetch(aiImage);
      if (!response.ok) throw new Error("Error al cargar imagen del producto.");
      const garmentBlob = await response.blob();
      const output = await predictTryOn(file, garmentBlob, aiDescription, aiCategory);
      setResult(output);
      setProgress(100);
    } catch (err: any) {
      console.error(err);
      alert("Error en el servidor de IA.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!result) return;
    const response = await fetch(result);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `musa-style-${productName}.png`;
    link.click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/85 backdrop-blur-md p-0 md:p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-t-[3rem] md:rounded-[3rem] w-full max-w-5xl h-full md:h-auto max-h-[100vh] md:max-h-[95vh] overflow-y-auto md:overflow-hidden shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)] relative flex flex-col md:flex-row border border-white/20">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="fixed md:absolute top-6 right-6 z-[100] w-12 h-12 flex items-center justify-center bg-white shadow-2xl rounded-full hover:rotate-90 transition-all duration-300 active:scale-90"
        >
          <i className="fas fa-times text-black text-xl"></i>
        </button>

        {/* --- PANEL IZQUIERDO: CONTROLES --- */}
        <div className="p-8 md:p-12 md:w-2/5 flex flex-col justify-center bg-white z-10 border-b md:border-b-0 md:border-r border-gray-100">
          <div className="mb-8">
            <span className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] mb-3 inline-block">MUSA v2.1 Performance</span>
            <h2 className="text-4xl font-black uppercase tracking-tighter leading-[0.9] mb-3 text-gray-900">Probador <br /> Inteligente</h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] italic">{productName}</p>
          </div>

          {!result ? (
            <div className="space-y-6">
              <div className={`group border-2 border-dashed rounded-[2.5rem] p-10 text-center relative transition-all duration-500 ${file ? 'border-pink-400 bg-pink-50/30' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'}`}>
                <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-20" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center transition-transform group-hover:scale-110 ${file ? 'bg-pink-500 text-white' : 'bg-white text-gray-300 shadow-sm'}`}>
                  <i className={`fas ${file ? 'fa-check' : 'fa-camera'} text-xl`}></i>
                </div>
                <p className="text-[12px] font-black uppercase tracking-tight text-gray-700">{file ? "¡Imagen Cargada!" : "Subir foto de cuerpo"}</p>
                <p className="text-[9px] text-gray-400 mt-2 font-bold uppercase tracking-widest">{file ? file.name : "JPG o PNG"}</p>
              </div>

              {loading ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black uppercase text-pink-500 animate-pulse">{statusMessage}</span>
                    <span className="text-xl font-black text-black">{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 p-1">
                    <div className="bg-pink-500 h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={handleProcess} 
                  disabled={!file} 
                  className="w-full bg-black text-white py-6 rounded-[1.5rem] font-black text-[12px] uppercase tracking-[0.2em] hover:bg-pink-600 disabled:bg-gray-100 disabled:text-gray-400 transition-all shadow-xl active:scale-95"
                >
                  Generar Outfits
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4 animate-in slide-in-from-left-4 duration-500">
              <button onClick={handleDownload} className="w-full bg-pink-500 text-white py-6 rounded-[1.5rem] font-black text-[12px] uppercase tracking-widest shadow-lg shadow-pink-100 hover:bg-pink-600 transition-all flex items-center justify-center gap-3">
                <i className="fas fa-download"></i> Guardar Imagen
              </button>
              <button onClick={handleReset} className="w-full border-2 border-gray-100 py-6 rounded-[1.5rem] font-black text-[12px] uppercase tracking-widest text-gray-400 hover:bg-gray-50 transition-all">
                Probar Otra Foto
              </button>
            </div>
          )}
        </div>

        {/* --- PANEL DERECHO: VISUALIZADOR --- */}
        <div className="md:w-3/5 bg-[#F9F9F9] relative flex items-center justify-center p-6 md:p-12 overflow-hidden min-h-[400px]">
          {result && localPhotoUrl ? (
            <div 
              ref={containerRef}
              className="relative w-full max-w-[400px] aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-2xl border-[8px] border-white cursor-col-resize group select-none"
              onMouseMove={handleMove}
              onTouchMove={handleMove}
              onMouseDown={() => setIsResizing(true)}
              onMouseUp={() => setIsResizing(false)}
              onMouseLeave={() => setIsResizing(false)}
              onTouchStart={() => setIsResizing(true)}
              onTouchEnd={() => setIsResizing(false)}
            >
              <img src={result} alt="Resultado" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
              <div 
                className="absolute inset-0 w-full h-full overflow-hidden border-r-2 border-white/50 z-10"
                style={{ width: `${sliderPos}%` }}
              >
                <img src={localPhotoUrl} alt="Original" className="absolute inset-0 w-[400px] h-full object-cover max-w-none pointer-events-none" />
                <div className="absolute top-6 left-6 bg-black/40 backdrop-blur-md text-white text-[8px] font-black px-3 py-1.5 rounded-full uppercase tracking-[0.2em] border border-white/20">Original</div>
              </div>
              <div className="absolute top-0 bottom-0 z-20 w-1 bg-white shadow-xl" style={{ left: `${sliderPos}%` }}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-2xl flex items-center justify-center text-xs text-black border-4 border-gray-50 group-active:scale-125 transition-transform">
                  <i className="fas fa-arrows-alt-h"></i>
                </div>
              </div>
              <div className="absolute top-6 right-6 bg-pink-500/90 backdrop-blur-md text-white text-[8px] font-black px-3 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-lg z-20">Musa AI Result</div>
            </div>
          ) : (
            <div className="text-center relative">
              <div className="relative group">
                <img src={productImage} alt="Prenda" className="w-48 h-64 md:w-56 md:h-72 object-cover rounded-[2.5rem] shadow-2xl border-4 border-white rotate-2 group-hover:rotate-0 transition-transform duration-700" />
                <div className="absolute -bottom-4 -right-4 bg-black text-white w-14 h-14 rounded-full flex items-center justify-center border-4 border-white shadow-xl animate-bounce">
                  <i className="fas fa-star text-xs"></i>
                </div>
              </div>
              <p className="mt-10 text-[9px] font-black text-gray-300 uppercase tracking-[0.5em] animate-pulse">Waiting for your image</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalTryOn;