import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from "../shared/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

interface Generation {
  _id: string;
  resultImage: string;
  garmentImage: string;
  category: string;
  description: string;
  createdAt: string;
}

const UserHistory = () => {
  const auth = useContext(AuthContext);
  const user = auth?.user;
  const [history, setHistory] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);

  // Extraemos la URL de la variable de entorno
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchHistory = async () => {
      // Si no hay usuario, ID o la URL de la API no está definida, abortamos
      if (!user || !user.id || !API_URL) return;

      try {
        setLoading(true);
        // Usamos la variable de entorno para la petición
        const response = await fetch(`${API_URL}/api/history/${user.id}`);
        
        if (!response.ok) throw new Error("Error cargando el historial");
        
        const data = await response.json();
        setHistory(data);
      } catch (error) {
        console.error("Error cargando historial:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user, user?.id, API_URL]); 

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este diseño de tu archivo?")) return;

    try {
      const response = await fetch(`${API_URL}/api/history/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setHistory(prev => prev.filter(item => item._id !== id));
      } else {
        alert("No se pudo eliminar el diseño del servidor.");
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("Error de conexión al intentar eliminar.");
    }
  };

  if (loading) return (
    <div className="flex h-96 items-center justify-center">
      <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <header className="mb-12">
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-pink-500 block mb-2">Musa Archive</span>
        <h2 className="text-4xl font-black uppercase tracking-tighter italic text-white-900">Mis Diseños</h2>
      </header>

      {history.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
          <i className="fas fa-magic text-4xl text-gray-200 mb-4"></i>
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Aún no has generado outfits con Musa AI</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <AnimatePresence>
            {history.map((item, index) => (
              <motion.div 
                key={item._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.1 }}
                className="group relative aspect-[3/4] bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-gray-100"
              >
                <img 
                  src={item.resultImage} 
                  alt={item.description} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6 backdrop-blur-sm">
                  
                  <button 
                    onClick={() => handleDelete(item._id)}
                    className="absolute top-4 right-4 w-8 h-8 bg-white/10 hover:bg-red-500 text-white rounded-full flex items-center justify-center transition-all backdrop-blur-md"
                    title="Eliminar diseño"
                  >
                    <i className="fas fa-trash-alt text-[10px]"></i>
                  </button>

                  <p className="text-[8px] font-black text-pink-400 uppercase tracking-widest mb-1">{item.category}</p>
                  <p className="text-white text-[10px] font-bold leading-tight mb-4 line-clamp-2">{item.description}</p>
                  
                  <a 
                    href={item.resultImage} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 bg-white text-black rounded-xl text-[9px] font-black uppercase tracking-tighter text-center hover:bg-pink-500 hover:text-white transition-colors"
                  >
                    Ver / Descargar
                  </a>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default UserHistory;