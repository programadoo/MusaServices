import React, { useState, useEffect } from 'react';
import { predictTryOn } from '../../services/aiService';

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
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: any;
    if (loading) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 95 ? prev : prev + 1));
      }, 300);
    }
    return () => clearInterval(interval);
  }, [loading]);

  if (!isOpen) return null;

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setLoading(false);
    setProgress(0);
  };

  const handleProcess = async () => {
    if (!file) return alert("Por favor, sube una foto tuya.");
    setLoading(true);
    try {
      const response = await fetch(aiImage);
      if (!response.ok) throw new Error("No se pudo cargar la imagen técnica.");
      const garmentBlob = await response.blob();
      const output = await predictTryOn(file, garmentBlob, aiDescription, aiCategory);
      setResult(output);
      setProgress(100);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Error procesando con IA.");
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
    link.download = `try-on-${productName}.png`;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      {/* Contenedor principal responsive */}
      <div className="bg-white rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col md:flex-row">
        
        {/* Botón Cerrar */}
        <button onClick={onClose} className="absolute top-6 right-6 z-20 w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
          <i className="fas fa-times text-gray-600"></i>
        </button>

        {/* Panel Izquierdo: Controles */}
        <div className="p-8 md:w-1/2 border-b md:border-b-0 md:border-r border-gray-100">
          <h2 className="text-xl font-black uppercase tracking-tighter mb-1">Probador IA</h2>
          <p className="text-[10px] font-bold text-pink-500 uppercase tracking-widest mb-8">{productName}</p>

          {!result ? (
            <div className="space-y-6">
              <div className="border-2 border-dashed border-gray-200 rounded-3xl p-6 text-center bg-gray-50 hover:border-pink-300 transition-all cursor-pointer relative">
                <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                <i className="fas fa-camera text-2xl text-gray-400 mb-2"></i>
                <p className="text-[11px] font-bold text-gray-500 uppercase">{file ? file.name : "Subir tu foto"}</p>
              </div>

              {loading ? (
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase text-pink-500"><span>Procesando...</span><span>{progress}%</span></div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden"><div className="bg-pink-500 h-full transition-all duration-300" style={{ width: `${progress}%` }}></div></div>
                </div>
              ) : (
                <button onClick={handleProcess} disabled={!file} className="w-full bg-black text-white py-4 rounded-full font-black text-[11px] uppercase tracking-widest hover:bg-gray-800 disabled:bg-gray-200 transition-all">
                  Generar Estilo
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <button onClick={handleDownload} className="w-full bg-pink-500 text-white py-4 rounded-full font-black text-[11px] uppercase tracking-widest">Descargar</button>
              <button onClick={handleReset} className="w-full border border-gray-200 py-4 rounded-full font-black text-[11px] uppercase tracking-widest">Nueva Prueba</button>
            </div>
          )}
        </div>

        {/* Panel Derecho: Imagen */}
        <div className="p-8 md:w-1/2 bg-gray-50 flex items-center justify-center min-h-[300px]">
          {result ? (
            <img src={result} alt="Resultado" className="w-full h-auto rounded-2xl shadow-lg" />
          ) : (
            <div className="text-center">
              <img src={productImage} alt="Prenda" className="w-32 h-auto object-cover rounded-xl shadow-md opacity-80" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};