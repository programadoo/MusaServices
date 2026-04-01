import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { EcommerceContext } from "../../context/EcommerceContext";
import { motion } from "framer-motion";

interface ProductProps {
  id: string | number;
  name: string;
  price: number;
  image?: string;
  productData: any;
  onTryOn: () => void;
}

const CardProduct = ({ id, name, price, image, productData, onTryOn }: ProductProps) => {
  const navigate = useNavigate();
  const context = useContext(EcommerceContext) as any;
  const { handleSelectedState } = context;

  const redirect = () => {
    handleSelectedState(name); 
    localStorage.setItem("productSelected", JSON.stringify(productData));
    navigate(`/info/${id}`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative bg-[#111111] rounded-[3rem] overflow-hidden border border-white/5 hover:border-pink-500/30 transition-all duration-700 shadow-2xl mb-6 md:mb-0"
    >
      
      {/* 1. Contenedor de Imagen: Ajustado para mayor impacto visual */}
      <div className="relative aspect-[4/5] md:aspect-[3/4] overflow-hidden bg-[#1A1A1A]">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110 grayscale-[10%] group-hover:grayscale-0"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-800">
            <i className="fas fa-tshirt text-6xl"></i>
          </div>
        )}
        
        {/* Badge de IA: Más minimalista */}
        <div className="absolute top-6 left-6 bg-black/40 backdrop-blur-2xl px-5 py-2 rounded-2xl border border-white/10 flex items-center gap-2.5 z-10">
          <div className="w-2 h-2 rounded-full bg-pink-500 shadow-[0_0_10px_#ec4899] animate-pulse"></div>
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white">Musa Ready</span>
        </div>

        {/* Gradiente inferior para legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-transparent opacity-80"></div>
      </div>

      {/* 2. Información del Producto: Layout mejorado para Single Column */}
      <div className="p-8 space-y-8 relative">
        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-white text-3xl md:text-xl font-black uppercase tracking-tighter leading-none group-hover:text-pink-500 transition-colors duration-500">
            {name}
          </h3>
          <div className="mt-3 flex items-center gap-3">
            <span className="text-pink-500 text-xl md:text-lg font-black tracking-widest italic">
              ${price.toLocaleString()}
            </span>
            <span className="px-3 py-1 bg-white/5 rounded-lg text-[9px] text-gray-500 font-black uppercase tracking-widest border border-white/5">New Arrival</span>
          </div>
        </div>
        
        <div className="flex flex-col gap-4">
          {/* Botón Probar: Principal en Mobile */}
          <button 
            onClick={(e) => {
                e.stopPropagation();
                onTryOn();
            }} 
            className="w-full py-5 rounded-[1.5rem] bg-gradient-to-r from-pink-600 via-purple-700 to-indigo-800 text-white font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-pink-900/20 hover:shadow-pink-500/40 active:scale-95 transition-all duration-500"
          >
            <i className="fas fa-sparkles text-sm"></i>
            <span>Probar</span>
          </button>

          {/* Botón Detalles: Secundario */}
          <button
            onClick={redirect}
            className="w-full py-5 rounded-[1.5rem] bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all duration-500"
          >
            Detalles
          </button>
        </div>
      </div>

      {/* 3. Efectos de fondo (Glow) */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 blur-[60px] rounded-full pointer-events-none"></div>
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-pink-500/10 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
    </motion.div>
  );
};

export default CardProduct;