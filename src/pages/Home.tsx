import { useContext, useEffect, useState } from "react";
import { EcommerceContext } from "../shared/context/ecommerceContext";
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
    <div className="min-h-screen bg-[#F8F8F8] text-gray-900 overflow-x-hidden font-sans">
      
      {/* 1. NAVBAR COMPLETO - Ajustado padding en móvil */}
      <nav className="fixed w-full z-[100] top-0 left-0 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center overflow-hidden">
                <img src="src/assets/images/logo_proyecto.jpeg" alt="L" className="object-cover" />
            </div>
            <a href="/" className="text-xl md:text-2xl font-black tracking-tighter">
              ICONIC <span className="text-pink-500 text-sm align-top">C.V.F</span>
            </a>
          </div>
          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-8 text-[11px] font-bold uppercase tracking-[0.2em]">
              <a href="/" className="hover:text-pink-500 transition-colors">Colecciones</a>
              <a href="/" className="hover:text-pink-500 transition-colors">Tendencias</a>
            </div>
            <a href="/" className="px-5 py-2 md:px-6 md:py-2.5 bg-black text-white rounded-full hover:bg-gray-800 transition-all text-xs font-bold uppercase tracking-widest">
              Explorar
            </a>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION - Ajustado orden y tamaños en móvil */}
      <section className="relative pt-32 pb-16 md:pt-48 md:pb-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 md:gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="space-y-6 md:space-y-8 text-center md:text-left order-2 md:order-1"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-pink-50 text-pink-600 text-[10px] font-black uppercase tracking-[0.2em]">
              Nueva Era de Moda IA
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-8xl font-black leading-[1] md:leading-[0.85] tracking-tighter text-gray-900">
              Vístete <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Digital</span>
            </h1>
            <p className="text-base md:text-lg text-gray-500 max-w-md mx-auto md:mx-0 leading-relaxed font-medium">
              Fusionamos la alta costura con inteligencia artificial generativa. Experimenta el futuro hoy.
            </p>
            <button className="w-full md:w-auto bg-black text-white px-10 py-5 rounded-full font-bold hover:scale-105 transition-transform shadow-2xl uppercase text-xs tracking-widest">
                Comprar Ahora
            </button>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="relative h-[300px] md:h-[600px] bg-gray-100 rounded-[2.5rem] md:rounded-[3rem] overflow-hidden shadow-2xl order-1 md:order-2"
          >
              <img src="src/assets/images/moda1.jpg" alt="Editorial" className="w-full h-full object-cover" />
          </motion.div>
        </div>
      </section>

      {/* 3. CARACTERÍSTICAS - Padding corregido para móvil */}
      <section className="py-16 md:py-24 bg-white border-t border-gray-50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
            {[
              { title: "Minimalismo", desc: "La esencia de lo puro en cada costura.", icon: "fa-star", color: "bg-pink-50 text-pink-500" },
              { title: "Esencia Natural", desc: "Fibras orgánicas certificadas.", icon: "fa-leaf", color: "bg-blue-50 text-blue-500" },
              { title: "Smart Fitting", desc: "Ajuste perfecto mediante IA.", icon: "fa-magic", color: "bg-purple-50 text-purple-500" }
            ].map((item, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -10 }}
                className="group p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 hover:border-pink-100 hover:shadow-2xl transition-all duration-500"
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

      {/* 4. PRODUCT GRID - AHORA 2 COLUMNAS EN MÓVIL */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-6">
        <div className="mb-10 md:mb-16 border-l-4 border-pink-500 pl-6">
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase">Nuestra Colección</h2>
          <p className="text-gray-400 font-medium mt-2 text-sm md:text-base">Selección exclusiva de temporada</p>
        </div>
        {/* grid-cols-2 en móvil para que no sea una lista infinita */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-10">
          {arrProducts.map((product, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }}
            >
              <CardProduct
                name={product.name}
                price={product.price}
                image={product.image}
                onTryOn={() => setSelectedProduct(product)}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. RESEÑAS - Adaptado a móvil */}
      <section className="py-16 md:py-24 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12 md:mb-20">
            <span className="text-pink-500 font-black text-[10px] uppercase tracking-[0.3em] block mb-4">Testimonios</span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter">La voz de nuestra comunidad</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              { name: "María González", text: "La calidad de los tejidos es espectacular, superó todas mis expectativas reales.", img: "src/assets/images/p1.jpg" },
              { name: "Ana Rodríguez", text: "El servicio al cliente es excepcional y la entrega fue rapidísima. ¡Increíble!", img: "src/assets/images/p3.jpg" },
              { name: "Mario Martínez", text: "Increíble variedad de estilos, siempre encuentro lo que busco.", img: "src/assets/images/p2.jpg" }
            ].map((review, i) => (
              <motion.div 
                key={i} 
                whileHover={{ scale: 1.02 }}
                className="bg-[#F9F9F9] p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 flex flex-col items-center text-center shadow-sm"
              >
                <div className="flex text-yellow-400 mb-6 text-[10px] md:text-xs">
                  {[...Array(5)].map((_, i) => <i key={i} className="fas fa-star mx-0.5"></i>)}
                </div>
                <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-8 font-medium">"{review.text}"</p>
                <img src={review.img} alt={review.name} className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover border-4 border-white shadow-md mb-4" />
                <h4 className="font-bold text-gray-900 text-sm md:text-base">{review.name}</h4>
                <span className="text-pink-500 text-[9px] font-black uppercase tracking-widest">Cliente Verificada</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FOOTER - Estructura corregida para móvil */}
      <footer className="bg-[#0A0A0A] text-white pt-16 pb-12 md:pt-24 md:pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 mb-16 md:mb-20">
            <div className="md:col-span-5 space-y-6 md:space-y-8 text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-black tracking-tighter uppercase">Iconic <span className="text-pink-500">C.V.F</span></h3>
              <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-sm mx-auto md:mx-0">
                Redefiniendo el e-commerce de moda a través de la tecnología y la sostenibilidad.
              </p>
              <div className="flex justify-center md:justify-start gap-4">
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center hover:bg-pink-500 transition-all cursor-pointer">
                    <i className="fab fa-instagram text-xl"></i>
                </div>
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center hover:bg-pink-500 transition-all cursor-pointer">
                    <i className="fab fa-tiktok text-xl"></i>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:col-span-7 gap-8">
                <div>
                  <h4 className="font-black uppercase text-[11px] tracking-[0.2em] text-pink-500 mb-6 md:mb-8">Empresa</h4>
                  <ul className="space-y-4 text-gray-400 font-medium text-xs md:text-sm">
                    <li><a href="/" className="hover:text-white transition-colors">Sobre Nosotros</a></li>
                    <li><a href="/" className="hover:text-white transition-colors">Contacto</a></li>
                    <li><a href="/" className="hover:text-white transition-colors">Sostenibilidad</a></li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-black uppercase text-[11px] tracking-[0.2em] text-pink-500 mb-6 md:mb-8">Soporte</h4>
                  <ul className="space-y-4 text-gray-400 font-medium text-xs md:text-sm">
                    <li><a href="/" className="hover:text-white transition-colors">Guía de Tallas</a></li>
                    <li><a href="/" className="hover:text-white transition-colors">Envíos</a></li>
                    <li><a href="/" className="hover:text-white transition-colors">Privacidad</a></li>
                  </ul>
                </div>
            </div>
          </div>
          
          <div className="pt-12 border-t border-white/5 text-center">
            <p className="text-[9px] md:text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em]">
              &copy; 2026 ICONIC C.V.F. TODOS LOS DERECHOS RESERVADOS.
            </p>
          </div>
        </div>
      </footer>

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

export default Home;