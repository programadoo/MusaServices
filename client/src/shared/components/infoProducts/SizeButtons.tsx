import { useContext } from "react";
import { EcommerceContext } from "../../context/EcommerceContext";

const SizeButtons = () => {
  const context = useContext(EcommerceContext) as any;
  // Asegúrate de usar el nombre exacto que tiene tu context (size o selectedSize)
  const { handleSize, size: contextSize } = context;

  const tallas = ["XS", "S", "M", "L", "XL"];

  return (
    /* Contenedor Grid para que no se amontonen */
    <div className="grid grid-cols-5 gap-3 w-full">
      {tallas.map((talla) => {
        const isSelected = contextSize === talla;

        return (
          <button
            key={talla} // <--- CLAVE: Esto elimina el error de la consola
            onClick={() => handleSize(talla)}
            className={`
              /* Estructura base */
              h-14 w-full rounded-2xl border font-black text-[11px] transition-all duration-300
              
              /* Estética Musa: Seleccionado vs No Seleccionado */
              ${isSelected 
                ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)] scale-95" 
                : "bg-white/5 text-gray-400 border-white/10 hover:border-white/30 hover:bg-white/10"
              }
            `}
          >
            {talla}
          </button>
        );
      })}
    </div>
  );
};

export default SizeButtons;