import React, { useState, useEffect, useRef, useContext } from 'react';
// Importamos las nuevas funciones del servicio actualizado
import { startTryOnJob, checkJobStatus } from '../../services/aiService';
import { AuthContext } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import toast from 'react-hot-toast';

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

  // --- ESTADOS DE PROCESAMIENTO ---
  const [file, setFile] = useState<File | null>(null);
  const [localPhotoUrl, setLocalPhotoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("Esperando archivo...");
  
  // --- ESTADOS DEL COMPARADOR VISUAL ---
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  // Bloqueo de scroll al abrir modal
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  // Preview de la foto cargada
  useEffect(() => {
    if (!file) { setLocalPhotoUrl(null); return; }
    const url = URL.createObjectURL(file);
    setLocalPhotoUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleMove = (e: any) => {
    if (!containerRef.current) return;
    const container = containerRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const x = clientX - container.left;
    const position = Math.max(0, Math.min(100, (x / container.width) * 100));
    setSliderPos(position);
  };

  /**
   * LÓGICA PRINCIPAL: PROCESAMIENTO CON POLLING
   */
  const handleProcess = async () => {
    if (!file) return;
    if (!user?.id) {
      toast.error("⚠️ Error: Debes iniciar sesión.");
      return;
    }

    setLoading(true);
    setProgress(10);
    setStatusMessage("Enviando a Musa Engine...");

    let pollingInterval: ReturnType<typeof setInterval>;

    try {
      // 1. Obtener el blob de la prenda (la imagen de Villatech/Musa)
      const garmentResponse = await fetch(aiImage);
      const garmentBlob = await garmentResponse.blob();

      // 2. Iniciar el Job en el Backend (BullMQ)
      const { jobId, remainingCredits } = await startTryOnJob(
        file, 
        garmentBlob, 
        aiDescription, 
        aiCategory, 
        user.id
      );

      // Actualizar créditos en la UI inmediatamente
      if (remainingCredits !== undefined) auth?.updateCredits(remainingCredits);
      
      setStatusMessage("En cola de procesamiento...");
      setProgress(25);

      // 3. Iniciar Polling (Preguntar cada 3 segundos)
      pollingInterval = setInterval(async () => {
        try {
          const status = await checkJobStatus(jobId);

          if (status.state === 'completed' && status.result) {
            clearInterval(pollingInterval);
            setResult(status.result.imageUrl);
            setProgress(100);
            setStatusMessage("Simulación completada");
            setLoading(false);
            toast.success("¡Imagen generada con éxito!");
          } 
          else if (status.state === 'failed') {
            clearInterval(pollingInterval);
            throw new Error(status.error || "La IA falló al procesar.");
          } 
          else if (status.state === 'active') {
            setStatusMessage("Musa AI está renderizando...");
            setProgress((prev) => (prev < 90 ? prev + 5 : prev));
          }
          // Si está en 'waiting', simplemente esperamos al siguiente ciclo
        } catch (pollError: any) {
          clearInterval(pollingInterval);
          setLoading(false);
          toast.error(pollError.message);
        }
      }, 3000);

    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Error en el motor");
      setStatusMessage("Fallo en el motor");
      setProgress(0);
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[2000] flex items-start md:items-center justify-center bg-black/95 backdrop-blur-xl overflow-y-auto p-0 md:p-6">
        
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="relative bg-[#0A0A0A] w-full max-w-6xl min-h-screen md:min-h-0 md:h-auto md:max-h-[95vh] md:rounded-[3rem] overflow-hidden border-x md:border border-white/10 flex flex-col md:flex-row shadow-2xl pt-16 md:pt-0"
        >
          
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 md:top-6 md:right-6 z-[100] w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 border border-white/10 rounded-full transition-all backdrop-blur-md active:scale-90"
          >
            <i className="fas fa-times text-white text-lg md:text-xl"></i>
          </button>

          {/* --- PANEL VISUALIZADOR --- */}
          <div className="w-full md:w-[60%] bg-[#080808] relative flex items-center justify-center p-6 sm:p-10 md:p-20 order-1 md:order-2 min-h-[450px] md:min-h-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-pink-500/10 via-transparent to-transparent opacity-60"></div>

            <div className="relative w-full aspect-[3/4] max-w-[320px] sm:max-w-[400px] md:max-w-[450px] rounded-3xl md:rounded-[3rem] overflow-hidden shadow-2xl border border-white/10 z-10 bg-[#111]">
                
                {result && localPhotoUrl ? (
                    <div 
                        ref={containerRef}
                        className="relative w-full h-full cursor-col-resize group"
                        onMouseMove={handleMove}
                        onTouchMove={handleMove}
                    >
                        <img src={result} alt="Musa AI" className="absolute inset-0 w-full h-full object-cover" />
                        
                        <motion.div 
                            className="absolute inset-0 w-full h-full overflow-hidden border-r border-white/30 z-10"
                            style={{ width: `${sliderPos}%` }}
                        >
                            <img src={localPhotoUrl} alt="Original" className="absolute inset-0 w-[320px] sm:w-[400px] md:w-[450px] h-full object-cover max-w-none grayscale-[0.4]" />
                        </motion.div>

                        <div className="absolute top-0 bottom-0 z-20 w-px bg-white/60" style={{ left: `${sliderPos}%` }}>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center text-black shadow-xl">
                              <i className="fas fa-arrows-alt-h text-sm"></i>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-[#151515]">
                        <motion.div animate={{ rotate: [1, -1, 1] }} transition={{ duration: 5, repeat: Infinity }}>
                          <img src={productImage} alt="Prenda" className="w-44 h-56 md:w-56 md:h-72 object-cover rounded-[2rem] shadow-2xl border border-white/5 brightness-75" />
                        </motion.div>
                        <p className="mt-8 text-[9px] font-black text-gray-700 uppercase tracking-[0.5em] text-center">Neural Canvas Ready</p>
                    </div>
                )}
            </div>
          </div>

          {/* --- PANEL CONTROLES --- */}
          <div className="w-full md:w-[40%] p-8 sm:p-12 md:p-16 flex flex-col justify-center bg-[#111] border-t md:border-t-0 md:border-r border-white/5 order-2 md:order-1">
            <div className="mb-10 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 mb-6">
                <span className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-pulse"></span>
                <span className="text-[9px] font-black text-pink-500 uppercase tracking-widest">Musa Engine v1.0</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none text-white mb-4">
                Virtual <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">Try-On</span>
              </h2>
              <div className="flex flex-wrap items-center justify-center md:justify-between gap-4">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest italic">{productName}</p>
                  <div className="text-pink-500 text-[10px] font-black border border-pink-500/30 px-3 py-1.5 rounded-full bg-pink-500/5">
                     {user?.credits ?? 0} CRÉDITOS
                  </div>
              </div>
            </div>

            {!result ? (
              <div className="space-y-6 md:space-y-8">
                <div className={`group border-2 border-dashed rounded-[2.5rem] p-10 md:p-12 text-center relative transition-all duration-700 
                  ${file ? 'border-pink-500/50 bg-pink-500/5' : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]'}`}>
                  <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-20" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                  <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl mx-auto mb-4 flex items-center justify-center transition-all duration-700 
                    ${file ? 'bg-pink-500 shadow-lg' : 'bg-white/5 text-gray-600'}`}>
                    <i className={`fas ${file ? 'fa-check' : 'fa-portrait'} text-2xl text-white`}></i>
                  </div>
                  <p className="text-[11px] font-black uppercase tracking-widest text-white">{file ? "Retrato Cargado" : "Toca para cargar foto"}</p>
                </div>

                {loading ? (
                  <div className="space-y-4 md:space-y-6 bg-white/5 p-6 rounded-3xl border border-white/10">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-black uppercase text-pink-500 tracking-widest animate-pulse">{statusMessage}</span>
                      <span className="text-2xl font-black text-white">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                      <motion.div className="bg-pink-500 h-full shadow-[0_0_15px_rgba(236,72,153,0.5)]" initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={handleProcess} 
                    disabled={!file || (user?.credits || 0) <= 0} 
                    className="w-full bg-white text-black py-5 md:py-6 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-pink-500 hover:text-white disabled:opacity-20 transition-all active:scale-95 shadow-xl"
                  >
                    { (user?.credits || 0) <= 0 ? "Sin Créditos" : "Procesar Simulación" }
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <button onClick={() => {
                  const link = document.createElement('a');
                  link.href = result;
                  link.download = `musa-fit-${productName}.png`;
                  link.click();
                }} className="w-full bg-pink-500 text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-lg hover:bg-pink-600 transition-all flex items-center justify-center gap-3">
                  <i className="fas fa-download"></i> Guardar Resultado
                </button>
                <button onClick={() => { setFile(null); setResult(null); setProgress(0); setStatusMessage("Iniciando motor..."); }} className="w-full bg-white/5 border border-white/10 py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest text-gray-400 hover:bg-white/10 transition-all">
                  Nuevo Intento
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ModalTryOn;