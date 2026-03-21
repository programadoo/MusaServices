import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { EcommerceContext } from "../../context/ecommerceContext";

interface ProductProps {
  name: string;
  price: number;
  image?: string;
  onTryOn: () => void;
}

const CardProduct = ({ name, price, image, onTryOn }: ProductProps) => {
  const navigate = useNavigate();
  const context = useContext(EcommerceContext) as any;
  const { handleSelectedState } = context;

  const redirect = () => {
    handleSelectedState(name);
    navigate("/info");
  };

  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-pink-200 transition-all duration-500 hover:shadow-2xl hover:shadow-pink-100/50">
      {/* Contenedor de Imagen */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-300">
            <i className="fas fa-tshirt text-4xl"></i>
          </div>
        )}
        
        {/* Badge Flotante */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-pink-600 shadow-sm border border-white/50">
          IA Ready
        </div>
      </div>

      {/* Info y Acciones */}
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-1">{name}</h3>
        <p className="text-sm text-gray-500 mb-6 font-medium">${price.toLocaleString()}</p>
        
        <div className="flex flex-col gap-3">
          <button
            onClick={redirect}
            className="w-full py-3 rounded-full border border-gray-900 text-gray-900 font-bold text-sm hover:bg-gray-900 hover:text-white transition-all duration-300"
          >
            Detalles
          </button>
          
          {/* Botón Probar Estilo Optimizado */}
          <button 
            onClick={onTryOn} 
            className="w-full py-3 rounded-full bg-pink-500 text-white font-bold text-[11px] uppercase tracking-widest hover:bg-pink-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-pink-200"
          >
            <i className="fas fa-magic text-[10px]"></i>
            <span className="whitespace-nowrap">Probar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardProduct;