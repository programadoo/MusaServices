import { useContext, useState } from "react";
import { EcommerceContext } from "../shared/context/ecommerceContext";
import CardProduct from "../shared/components/CardProduct/CardProduct";
import { ModalTryOn } from "../shared/components/ModalTryOn";
import { motion, AnimatePresence } from "framer-motion";

/**
 * COMPONENTE: Products
 * Muestra el catálogo completo con filtros de búsqueda y categoría.
 */
const Products = () => {
  const context = useContext(EcommerceContext) as any;
  const allProducts = context?.initState || [];
  
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // LÓGICA DE FILTRADO REACTIVO
  const filteredProducts = allProducts.filter((p: any) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white pt-32 pb-20 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* CABECERA Y BUSCADOR */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <h1 className="text-6xl font-black tracking-tighter uppercase text-gray-900">Catálogo</h1>
            <div className="flex items-center gap-3 mt-2">
                <span className="w-8 h-[2px] bg-pink-500"></span>
                <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-[10px]">Musa Engine Ready</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            {/* BUSCADOR */}
            <div className="relative group">
              <i className="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-pink-500 transition-colors"></i>
              <input 
                type="text"
                placeholder="BUSCAR PRENDA..."
                className="pl-12 pr-6 py-4 bg-gray-50 border-none rounded-2xl w-full md:w-80 text-[10px] font-black tracking-widest focus:ring-2 focus:ring-pink-500 outline-none transition-all placeholder:text-gray-300"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* FILTRO CATEGORÍA */}
            <div className="relative">
                <select 
                className="pl-6 pr-12 py-4 bg-gray-50 border-none rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none appearance-none cursor-pointer hover:bg-gray-100 transition-colors w-full"
                onChange={(e) => setCategoryFilter(e.target.value)}
                value={categoryFilter}
                >
                <option value="all">Todas las piezas</option>
                <option value="upper_body">Tops / Upper</option>
                <option value="lower_body">Pants / Lower</option>
                <option value="dresses">Dresses</option>
                </select>
                <i className="fas fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[10px]"></i>
            </div>
          </div>
        </header>

        {/* GRID DE PRODUCTOS */}
        {filteredProducts.length > 0 ? (
          <motion.div layout className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product: any) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  key={product.id}
                >
                  <CardProduct
                    id={product.id}              /* CRÍTICO: Envía el ID para la URL */
                    name={product.name}
                    price={product.price}
                    image={product.image}
                    productData={product}        /* CRÍTICO: Envía el objeto para el detalle */
                    onTryOn={() => setSelectedProduct(product)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="py-40 text-center flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <i className="fas fa-ghost text-gray-200 text-3xl"></i>
            </div>
            <p className="text-gray-300 font-black uppercase tracking-[0.5em] text-xs">No se hallaron coincidencias</p>
            <button 
                onClick={() => {setSearchTerm(""); setCategoryFilter("all")}}
                className="mt-6 text-pink-500 font-black uppercase text-[10px] tracking-widest underline underline-offset-8"
            >
                Restablecer Filtros
            </button>
          </div>
        )}
      </div>

      {/* MODAL MUSA (SINCRONIZADO) */}
      <ModalTryOn 
        isOpen={!!selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
        productImage={selectedProduct?.image || ""} 
        productName={selectedProduct?.name || ""} 
        aiImage={selectedProduct?.aiImage || ""}
        aiDescription={selectedProduct?.aiDescription || ""} 
        aiCategory={selectedProduct?.aiCategory || "dresses"} 
      />
    </div>
  );
};

export default Products;