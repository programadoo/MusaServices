import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { EcommerceContext } from "../shared/context/EcommerceContext";
import { AuthContext } from "../shared/context/AuthContext"; 
import { Product } from "../shared/models/product.modul";
import CardProduct from "../shared/components/CardProduct/CardProduct";
import { ModalTryOn } from "../shared/components/ModalTryOn";
import { motion } from "framer-motion";
import "../assets/styles/style.css";

const Home = () => {
  const context = useContext(EcommerceContext) as any;
  const { isAuthenticated } = useContext(AuthContext) || {}; 
  
  const navigate = useNavigate();
  const location = useLocation();
  
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

  const handleTryOnSecurity = (product: Product) => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location } });
      return;
    }
    setSelectedProduct(product);
  };

  return (
    <div className="bg-[#0A0A0A] min-h-screen w-full"> 
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full pt-32 pb-16 md:pt-48 md:pb-32 bg-[#0A0A0A] overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full"></div>

        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 md:gap-16 items-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -40 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.8 }}
            className="space-y-8 text-center md:text-left order-2 md:order-1"
          >
            <div className="flex items-center justify-center md:justify-start gap-3">
              <span className="w-12 h-[1px] bg-pink-500 hidden md:block"></span>
              <span className="inline-block px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-500 text-[10px] font-black uppercase tracking-[0.3em]">
                The Future of Fashion IA
              </span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl md:text-[110px] font-black leading-[0.9] tracking-tighter text-white uppercase">
              Vístete <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 animate-gradient-x">
                Digital
              </span>
            </h1>
            
            <p className="text-base md:text-lg text-gray-400 max-w-md mx-auto md:mx-0 leading-relaxed font-medium italic">
              "No es solo ropa, es el algoritmo de tu identidad." Experimenta  vestir digitalmente con el motor de Musa v1.0.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/products" className="group relative inline-block overflow-hidden bg-white text-black px-12 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest text-center transition-all duration-500 hover:scale-105">
                <span className="relative z-10">Comprar Ahora</span>
                <div className="absolute inset-0 bg-pink-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              </Link>
              
              <a href="#tendencias" className="inline-block px-12 py-5 rounded-2xl border border-white/10 text-white font-black uppercase text-[10px] tracking-widest text-center hover:bg-white/5 transition-all">
                Ver Tendencias
              </a>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} 
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative h-[400px] md:h-[700px] order-1 md:order-2 group"
          >
            <div className="absolute -inset-4 border border-white/5 rounded-[3.5rem] pointer-events-none"></div>
            
            <div className="w-full h-full bg-[#111111] rounded-[3rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] relative">
              <img 
                src="src/assets/images/imagen_home.jpg" 
                alt="Editorial" 
                className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" 
              />
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute bottom-8 left-8 right-8 bg-black/40 backdrop-blur-2xl px-6 py-5 rounded-3xl border border-white/10 flex items-center justify-between z-10"
              >
                <div className="flex items-center gap-4">
                  <div className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
                  </div>
                  <div>
                    <p className="text-[8px] font-black uppercase tracking-widest text-pink-500">Status</p>
                    <p className="text-[12px] font-black text-white uppercase">MUSA ENGINE ACTIVE</p>
                  </div>
                </div>
                <div className="hidden sm:block text-right">
                  <p className="text-[8px] font-black uppercase tracking-widest text-gray-500">Processing</p>
                  <p className="text-[10px] font-mono text-gray-300">v1.0.42_STABLE</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. CARACTERÍSTICAS */}
      <section id="tendencias" className="w-full py-24 bg-[#0A0A0A] relative border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Minimalismo", desc: "La esencia de lo puro procesado por redes neuronales.", icon: "fa-star", color: "text-pink-500", glow: "group-hover:shadow-pink-500/10" },
              { title: "Eco-Generative", desc: "Fibras orgánicas bajo demanda, residuo cero.", icon: "fa-leaf", color: "text-blue-500", glow: "group-hover:shadow-blue-500/10" },
              { title: "Neural Fitting", desc: "Precisión milimétrica mediante escaneo virtual.", icon: "fa-magic", color: "text-purple-500", glow: "group-hover:shadow-purple-500/10" }
            ].map((item, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -10 }}
                className={`group p-10 rounded-[3rem] bg-[#111111] border border-white/5 hover:border-white/10 transition-all duration-500 relative overflow-hidden ${item.glow} hover:shadow-2xl`}
              >
                <div className={`w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center mb-8 transition-colors duration-500 group-hover:bg-white/[0.08]`}>
                  <i className={`fas ${item.icon} text-xl ${item.color}`}></i>
                </div>
                
                <h3 className="text-xl font-black mb-4 uppercase tracking-tighter text-white">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm font-medium italic">
                  {item.desc}
                </p>

                <div className={`absolute -right-4 -bottom-4 w-24 h-24 bg-current opacity-[0.02] group-hover:opacity-[0.05] transition-opacity rounded-full ${item.color}`}></div>
              </motion.div>
            ))}
        </div>
      </section>

      {/* 3. PRODUCT GRID: CAMBIO A grid-cols-1 PARA MOBILE */}
      <section id="coleccion" className="w-full bg-[#0A0A0A] py-24 md:py-32 scroll-mt-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-[1px] w-8 bg-pink-500"></div>
                <span className="text-pink-500 font-black tracking-[0.4em] text-[10px] uppercase">
                  Curaduría Digital
                </span>
              </div>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase text-white leading-none">
                The <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">Drop</span>
              </h2>
              <p className="text-gray-500 font-medium max-w-sm text-sm md:text-base italic">
                Piezas exclusivas seleccionadas por nuestro motor de IA para tu estilo único.
              </p>
            </div>
            
            <Link to="/products" className="group flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-white">
              <span className="border-b border-white/20 pb-1 group-hover:border-pink-500 group-hover:text-pink-500 transition-all duration-500">
                Explorar Todo
              </span>
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-pink-500 group-hover:border-pink-500 transition-all duration-500">
                <i className="fas fa-arrow-right text-xs"></i>
              </div>
            </Link>
          </div>
          
          {/* APLICADO: grid-cols-1 para mobile y grid-cols-2/4 para pantallas grandes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
            {arrProducts.length === 0 ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse flex flex-col gap-6">
                  <div className="bg-white/5 rounded-[2.5rem] w-full aspect-[3/4] border border-white/5"></div>
                  <div className="space-y-3">
                    <div className="bg-white/5 h-3 w-3/4 rounded-full mx-auto"></div>
                    <div className="bg-white/5 h-3 w-1/2 rounded-full mx-auto"></div>
                  </div>
                </div>
              ))
            ) : (
              arrProducts.slice(0, 4).map((product, index) => (
                <motion.div 
                  key={product.id || index} 
                  initial={{ opacity: 0, y: 30 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <div className="relative p-2 md:p-3 rounded-[3.5rem] bg-white/[0.02] border border-white/5 group-hover:bg-white/[0.04] group-hover:border-white/10 transition-all duration-700">
                    <CardProduct
                      id={product.id || index}
                      name={product.name}
                      price={product.price}
                      image={product.image}
                      productData={product} 
                      onTryOn={() => handleTryOnSecurity(product)} 
                    />
                  </div>
                </motion.div>
              ))
            )}
          </div>

          <div className="mt-20 flex justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-[1px] h-12 bg-gradient-to-b from-pink-500 to-transparent"></div>
              <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.5em]">Scroll to Discover</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SECCIÓN TESTIMONIOS */}
      <section className="w-full py-24 md:py-32 bg-[#0A0A0A] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative mb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="space-y-4">
                <motion.span 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  className="text-pink-500 font-black tracking-[0.4em] text-xs uppercase"
                >
                  Voces de Musa
                </motion.span>
                <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-none text-white uppercase">
                  The <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-gray-400 to-gray-600">Community</span>
                </h2>
              </div>
              
              <div className="flex flex-col items-start md:items-end gap-4">
                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-2xl">
                  <span className="text-3xl font-black text-white italic">4,9</span>
                  <div className="flex flex-col">
                    <div className="flex text-pink-500 text-[10px] gap-0.5">
                      {[...Array(5)].map((_, i) => <i key={i} className="fas fa-star"></i>)}
                    </div>
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Global Rating</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                name: "María González", 
                text: "La calidad de los tejidos es espectacular, superó todas mis expectativas en cada detalle.", 
                img: "src/assets/images/p1.jpg",
                tag: "@mery_g",
                highlight: "Espectacular"
              },
              { 
                name: "Ana Rodríguez", 
                text: "El probador virtual es magia pura. Compré sabiendo exactamente cómo me vería.", 
                img: "src/assets/images/p3.jpg",
                tag: "@ana_style",
                highlight: "Magia Pura"
              },
              { 
                name: "Mario Martínez", 
                text: "Increíble variedad de estilos, la IA acertó perfectamente con mi talla en un solo intento.", 
                img: "src/assets/images/p2.jpg",
                tag: "@mario_mtz",
                highlight: "Precisión"
              }
            ].map((review, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="group relative bg-[#111111] p-10 md:p-12 rounded-[3rem] border border-white/5 hover:border-pink-500/30 transition-all duration-700 shadow-2xl"
              >
                <div className="absolute top-10 right-10 opacity-10 group-hover:opacity-100 group-hover:text-pink-500 transition-all duration-700">
                  <i className="fas fa-quote-right text-4xl"></i>
                </div>

                <div className="relative z-10 flex flex-col h-full">
                  <div className="mb-8">
                    <span className="text-[10px] font-black text-pink-500 uppercase tracking-widest border border-pink-500/20 px-3 py-1 rounded-full bg-pink-500/5">
                      {review.highlight}
                    </span>
                  </div>

                  <p className="text-gray-300 text-xl md:text-2xl font-light leading-snug mb-12 italic">
                    "{review.text}"
                  </p>

                  <div className="mt-auto flex items-center gap-5">
                    <img src={review.img} alt={review.name} className="w-14 h-14 rounded-full object-cover border-2 border-[#111111]" />
                    <div>
                      <h4 className="font-black text-white text-base uppercase tracking-tight group-hover:text-pink-500 transition-colors">
                        {review.name}
                      </h4>
                      <p className="text-gray-500 text-[11px] font-bold tracking-[0.2em] uppercase">{review.tag}</p>
                    </div>
                  </div>
                </div>
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