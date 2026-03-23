import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { EcommerceContext } from "../shared/context/EcommerceContext";
import { Product } from "../shared/models/product.modul";
import CardProduct from "../shared/components/CardProduct/CardProduct";
import { ModalTryOn } from "../shared/components/ModalTryOn";
import { motion } from "framer-motion";
import "../assets/styles/style.css";

const Home = () => {
  const context = useContext(EcommerceContext) as any;
  const arrProducts: Product[] = context?.initState || [];
  
  const [, setReloadFlag] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) setReloadFlag((prev) => !prev);
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F8F8] text-gray-900 overflow-x-hidden font-sans scroll-smooth">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-16 md:pt-48 md:pb-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 md:gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="space-y-6 md:space-y-8 text-center md:text-left order-2 md:order-1"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-pink-50 text-pink-600 text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">
              Nueva Era de Moda IA
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-8xl font-black leading-[1] md:leading-[0.85] tracking-tighter text-gray-900">
              Vístete <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Digital</span>
            </h1>
            <p className="text-base md:text-lg text-gray-500 max-w-md mx-auto md:mx-0 leading-relaxed font-medium">
              Fusionamos la alta costura con inteligencia artificial generativa. Experimenta el futuro hoy en ICONIC C.V.F.
            </p>
            <Link to="/products" className="inline-block w-full md:w-auto bg-black text-white px-10 py-5 rounded-full font-bold hover:bg-gray-800 hover:scale-105 transition-all shadow-2xl uppercase text-xs tracking-widest text-center">
                Comprar Ahora
            </Link>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="relative h-[300px] md:h-[600px] bg-gray-100 rounded-[2.5rem] md:rounded-[3rem] overflow-hidden shadow-2xl order-1 md:order-2 group"
          >
              <img src="src/assets/images/moda1.jpg" alt="Editorial" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="absolute bottom-6 left-6 md:left-8 bg-white/90 backdrop-blur-md px-5 py-3 rounded-2xl shadow-2xl border border-white/40 flex items-center gap-4 z-10"
              >
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
                </div>
                <div>
                  <p className="text-[8px] font-black uppercase tracking-widest text-gray-500">Motor de IA Activo</p>
                  <p className="text-[11px] font-black text-black uppercase tracking-tighter">Powered by MUSA</p>
                </div>
              </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 2. CARACTERÍSTICAS */}
      <section id="tendencias" className="py-16 md:py-24 bg-white border-t border-gray-50 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
            {[
              { title: "Minimalismo", desc: "La esencia de lo puro en cada costura.", icon: "fa-star", color: "bg-pink-50 text-pink-500" },
              { title: "Esencia Natural", desc: "Fibras orgánicas certificadas.", icon: "fa-leaf", color: "bg-blue-50 text-blue-500" },
              { title: "Smart Fitting", desc: "Ajuste perfecto mediante IA.", icon: "fa-magic", color: "bg-purple-50 text-purple-500" }
            ].map((item, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -10 }}
                className="group p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 hover:border-pink-100 hover:shadow-2xl transition-all duration-500 bg-white"
              >
                <div className={`w-12 h-12 md:w-14 md:h-14 ${item.color} rounded-2xl flex items-center justify-center mb-6 text-lg md:text-xl`}>
                  <i className={`fas ${item.icon}`}></i>
                </div>
                <h3 className="text-lg md:text-xl font-black mb-3 uppercase tracking-tight">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm font-medium">{item.desc}</p>
              </motion.div>
            ))}
        </div>
      </section>

      {/* 3. PRODUCT GRID */}
      <section id="coleccion" className="py-16 md:py-24 max-w-7xl mx-auto px-6 scroll-mt-24">
        <div className="mb-10 md:mb-16 border-l-4 border-pink-500 pl-6 flex justify-between items-end">
          <div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase">Nuestra Colección</h2>
            <p className="text-gray-400 font-medium mt-2 text-sm md:text-base">Selección exclusiva lista para probar</p>
          </div>
          <Link to="/products" className="text-[10px] font-black uppercase tracking-widest text-pink-500 hover:translate-x-2 transition-transform">
            Ver todo <i className="fas fa-arrow-right ml-2"></i>
          </Link>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-10">
          {arrProducts.length === 0 ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse flex flex-col gap-4">
                <div className="bg-gray-200 rounded-[2rem] w-full aspect-[3/4]"></div>
                <div className="bg-gray-200 h-4 w-3/4 rounded mx-auto"></div>
              </div>
            ))
          ) : (
            arrProducts.slice(0, 4).map((product, index) => (
              <motion.div 
                key={product.id || index} 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <CardProduct
                  id={product.id || index}
                  name={product.name}
                  price={product.price}
                  image={product.image}
                  productData={product} 
                  onTryOn={() => setSelectedProduct(product)}
                />
              </motion.div>
            ))
          )}
        </div>
      </section>

      {/* 4. RESEÑAS */}
      <section className="py-16 md:py-24 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12 md:mb-20">
            <span className="text-pink-500 font-black text-[10px] uppercase tracking-[0.3em] block mb-4">Testimonios</span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter">La voz de la comunidad</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              { name: "María González", text: "La calidad de los tejidos es espectacular, superó todas mis expectativas reales.", img: "src/assets/images/p1.jpg" },
              { name: "Ana Rodríguez", text: "El probador virtual es magia pura. Compré sabiendo exactamente cómo me quedaría.", img: "src/assets/images/p3.jpg" },
              { name: "Mario Martínez", text: "Increíble variedad de estilos, la IA acertó perfectamente con mis medidas.", img: "src/assets/images/p2.jpg" }
            ].map((review, i) => (
              <motion.div 
                key={i} 
                whileHover={{ scale: 1.02 }}
                className="bg-[#F9F9F9] p-8 md:p-10 rounded-[2.5rem] border border-gray-100 flex flex-col items-center text-center shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="flex text-yellow-400 mb-6 text-[10px] md:text-xs">
                  {[...Array(5)].map((_, i) => <i key={i} className="fas fa-star mx-0.5"></i>)}
                </div>
                <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-8 font-medium">"{review.text}"</p>
                <img src={review.img} alt={review.name} className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover border-4 border-white shadow-md mb-4" />
                <h4 className="font-bold text-gray-900 text-sm md:text-base">{review.name}</h4>
                <span className="text-pink-500 text-[9px] font-black uppercase tracking-widest">Cliente Verificado</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* MODAL TRY-ON */}
      <ModalTryOn 
        isOpen={!!selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
        productImage={selectedProduct?.image || ""} 
        productName={selectedProduct?.name || ""} 
        aiImage={selectedProduct?.aiImage || ""}
        aiDescription={selectedProduct?.aiDescription || ""} 
        aiCategory={(selectedProduct as any)?.aiCategory || "dresses"} 
      />
    </div>
  );
};

export default Home;