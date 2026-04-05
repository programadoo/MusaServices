import { useEffect, useState, useContext } from 'react';
import { AuthContext } from "../shared/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

interface Generation {
  _id: string; // El ID del objeto en MongoDB sigue siendo _id
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

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchHistory = async () => {
      // Usamos user.id porque así está definido en tu AuthContext
      if (!user?.id || !auth?.token || !API_URL) {
        console.log("Musa Archive: Esperando sesión activa...");
        return;
      }

      try {
        setLoading(true);
        
        const response = await fetch(`${API_URL}/api/try-on/history/${user.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth.token}` 
          }
        });
        
        if (!response.ok) {
          if (response.status === 401) throw new Error("Sesión expirada");
          throw new Error("Error al cargar el historial");
        }
        
        const data: Generation[] = await response.json();

        // Seteamos el historial completo para pruebas en local
        setHistory(data);

      } catch (error) {
        console.error("❌ Error en Musa Archive:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user?.id, auth?.token, API_URL]); 

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Deseas eliminar este diseño de tu armario virtual?")) return;

    try {
      const response = await fetch(`${API_URL}/api/try-on/history/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${auth?.token}` // También protegemos el borrado
        }
      });

      if (response.ok) {
        setHistory(prev => prev.filter(item => item._id !== id));
      } else {
        alert("No se pudo eliminar el diseño.");
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("Error de conexión.");
    }
  };

  if (loading) return (
    <div className="flex h-96 items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Accediendo al archivo...</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <header className="mb-12 flex justify-between items-end">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-pink-500 block mb-2">Musa Archive</span>
          <h2 className="text-4xl font-black uppercase tracking-tighter italic text-white">Mis Diseños</h2>
        </div>
        <div className="pb-1">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            {history.length} Objetos Guardados
          </p>
        </div>
      </header>

      {history.length === 0 ? (
        <div className="text-center py-24 bg-[#111] rounded-[3rem] border-2 border-dashed border-white/5">
          <div className="mb-6 inline-flex w-16 h-16 items-center justify-center rounded-full bg-white/5">
             <i className="fas fa-magic text-2xl text-pink-500"></i>
          </div>
          <p className="text-white font-black uppercase text-[12px] tracking-widest mb-2">Tu armario está vacío</p>
          <p className="text-gray-500 text-[10px] uppercase font-bold">Genera un outfit con Musa AI para verlo aquí</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <AnimatePresence mode='popLayout'>
            {history.map((item, index) => (
              <motion.div 
                key={item._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5, rotate: 5 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group relative aspect-[3/4] bg-neutral-900 rounded-[2rem] overflow-hidden border border-white/5"
              >
                <img 
                  src={item.resultImage} 
                  alt={item.description || "Diseño Musa"} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6 backdrop-blur-[2px]">
                  
                  <button 
                    onClick={() => handleDelete(item._id)}
                    className="absolute top-4 right-4 w-10 h-10 bg-black/40 hover:bg-red-500/80 text-white rounded-full flex items-center justify-center transition-all backdrop-blur-xl border border-white/10"
                  >
                    <i className="fas fa-trash-alt text-[12px]"></i>
                  </button>

                  <span className="text-[8px] font-black text-pink-500 uppercase tracking-widest mb-1">{item.category}</span>
                  <p className="text-white text-[11px] font-bold leading-tight mb-4 line-clamp-2">
                    {item.description || "Outfit generado por Musa AI"}
                  </p>
                  
                  <div className="flex gap-2">
                    <a 
                      href={item.resultImage} 
                      download={`musa_design_${item._id}.png`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-3 bg-white text-black rounded-xl text-[9px] font-black uppercase tracking-widest text-center hover:bg-pink-500 hover:text-white transition-all transform active:scale-95"
                    >
                      Descargar
                    </a>
                  </div>
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