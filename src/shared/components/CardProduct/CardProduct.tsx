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
    <div className="group relative bg-[#111111] rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-pink-500/30 transition-all duration-700 shadow-2xl">
      
      {/* Contenedor de Imagen con Overlay Gradiente */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#1A1A1A]">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[20%] group-hover:grayscale-0"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-800">
            <i className="fas fa-tshirt text-5xl"></i>
          </div>
        )}
        
        {/* Badge de IA con estilo Neon */}
        <div className="absolute top-5 left-5 bg-black/60 backdrop-blur-xl px-4 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse"></div>
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white">IA Ready</span>
        </div>

        {/* Overlay sutil al hacer hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-60"></div>
      </div>

      {/* Información del Producto */}
      <div className="p-7 space-y-6">
        <div className="text-center md:text-left">
          <h3 className="text-white text-lg font-black uppercase tracking-tighter leading-tight group-hover:text-pink-500 transition-colors duration-500">
            {name}
          </h3>
          <p className="text-pink-500/80 text-sm font-bold mt-1 tracking-widest italic">
            ${price.toLocaleString()}
          </p>
        </div>
        
        <div className="flex flex-col gap-3">
          {/* Botón Detalles: Minimalista Dark */}
          <button
            onClick={redirect}
            className="w-full py-4 rounded-2xl border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-500"
          >
            Ver Detalles
          </button>
          
          {/* Botón Probar: El Call to Action de MUSA */}
          <button 
            onClick={(e) => {
                e.stopPropagation();
                onTryOn();
            }} 
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-700 text-white font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-lg shadow-pink-900/20 hover:scale-[1.02] active:scale-95 transition-all duration-500"
          >
            <i className="fas fa-magic text-xs"></i>
            <span>Musa Try-On</span>
          </button>
        </div>
      </div>

      {/* Glow Efecto Background al hacer Hover */}
      <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-pink-500/10 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
    </div>
  );
};

export default CardProduct;