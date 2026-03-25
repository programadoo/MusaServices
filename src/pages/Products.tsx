import { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { EcommerceContext } from "../shared/context/EcommerceContext";
import { AuthContext } from "../shared/context/AuthContext";
import CardProduct from "../shared/components/CardProduct/CardProduct";
import { ModalTryOn } from "../shared/components/ModalTryOn";
import { motion, AnimatePresence } from "framer-motion";

const Products = () => {
  const context = useContext(EcommerceContext) as any;
  const { isAuthenticated } = useContext(AuthContext) || {}; 
  
  const navigate = useNavigate();
  const location = useLocation();

  const allProducts = context?.initState || [];
  
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const handleTryOnSecurity = (product: any) => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location } });
      return;
    }
    setSelectedProduct(product);
  };

  const filteredProducts = allProducts.filter((p: any) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-32 pb-20 px-6 font-sans text-white">
      <div className="max-w-7xl mx-auto">
        
        {/* CABECERA EDITORIAL */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-20">
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <span className="w-12 h-[1px] bg-pink-500"></span>
              <p className="text-pink-500 font-black uppercase tracking-[0.4em] text-[9px]">Musa Archive v1.0</p>
            </motion.div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none">
              Catálogo
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            {/* BUSCADOR ESTILO GLASS */}
            <div className="relative group flex-1 md:w-80">
              <i className="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-pink-500 transition-colors"></i>
              <input 
                type="text"
                placeholder="BUSCAR EN EL ARCHIVO..."
                className="w-full pl-14 pr-6 py-5 bg-white/[0.03] border border-white/10 rounded-2xl text-[10px] font-black tracking-[0.2em] focus:border-pink-500/50 focus:ring-0 outline-none transition-all placeholder:text-gray-600 uppercase"
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
              />
            </div>

            {/* SELECTOR DE CATEGORÍA CUSTOM */}
            <div className="relative md:w-64">
                <select 
                  className="w-full pl-6 pr-12 py-5 bg-white/[0.03] border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] outline-none appearance-none cursor-pointer hover:bg-white/[0.06] transition-colors"
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  value={categoryFilter}
                >
                  <option value="all" className="bg-[#111111]">Todas las piezas</option>
                  <option value="upper_body" className="bg-[#111111]">Tops / Upper</option>
                  <option value="lower_body" className="bg-[#111111]">Pants / Lower</option>
                  <option value="dresses" className="bg-[#111111]">Dresses</option>
                </select>
                <i className="fas fa-chevron-down absolute right-6 top-1/2 -translate-y-1/2 text-pink-500 pointer-events-none text-[10px]"></i>
            </div>
          </div>
        </header>

        {/* CONTADOR DE RESULTADOS SUTIL */}
        <div className="mb-10 flex items-center gap-4">
          <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
            Mostrando {filteredProducts.length} resultados
          </span>
          <div className="h-[1px] flex-1 bg-white/5"></div>
        </div>

        {/* GRID DE PRODUCTOS */}
        {filteredProducts.length > 0 ? (
          <motion.div layout className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product: any, index: number) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  key={product.id}
                  className="group relative"
                >
                  <div className="p-2 md:p-3 rounded-[3rem] bg-white/[0.02] border border-white/5 group-hover:bg-white/[0.04] group-hover:border-pink-500/20 transition-all duration-700">
                    <CardProduct
                      id={product.id}
                      name={product.name}
                      price={product.price}
                      image={product.image}
                      productData={product}
                      onTryOn={() => handleTryOnSecurity(product)} 
                    />
                    
                    {/* Indicador de Categoría en Hover */}
                    <div className="absolute bottom-10 left-10 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                      <span className="text-[8px] font-black text-white/40 uppercase tracking-[0.3em] bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                        {product.category?.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* EMPTY STATE REDISEÑADO */
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-40 text-center flex flex-col items-center justify-center border border-dashed border-white/5 rounded-[4rem]"
          >
            <div className="relative w-24 h-24 mb-10">
               <div className="absolute inset-0 bg-pink-500/20 blur-3xl rounded-full animate-pulse"></div>
               <div className="relative w-full h-full bg-[#111111] border border-white/5 rounded-full flex items-center justify-center">
                  <i className="fas fa-search-minus text-gray-700 text-3xl"></i>
               </div>
            </div>
            <h3 className="text-xl font-black uppercase tracking-[0.3em] text-white mb-4">Sin coincidencias</h3>
            <p className="text-gray-500 font-medium italic mb-10 max-w-xs">
              No hemos encontrado piezas que coincidan con los parámetros de búsqueda en el motor actual.
            </p>
            <button 
                onClick={() => {setSearchTerm(""); setCategoryFilter("all")}}
                className="px-10 py-4 bg-white text-black rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-pink-500 hover:text-white transition-all"
            >
                Restablecer Filtros
            </button>
          </motion.div>
        )}
      </div>

      {/* MODAL MUSA */}
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