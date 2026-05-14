import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export const Footer = () => {
  return (
    <footer className="bg-[#0A0A0A] text-white pt-24 pb-12 px-6 mt-auto border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8 mb-20">
          
          {/* Columna de Marca: Más presencia */}
          <div className="md:col-span-5 space-y-10 text-center md:text-left">
            <div className="space-y-4">
              <h3 className="text-3xl md:text-4xl font-black tracking-tighter uppercase leading-none">
                ICONIC <span className="text-pink-500 italic">CVF</span>
              </h3>
              <div className="h-[2px] w-12 bg-pink-500 mx-auto md:mx-0"></div>
            </div>
            
            <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-sm mx-auto md:mx-0 font-medium">
              Redefiniendo la intersección entre el <span className="text-white">código</span> y la <span className="text-white">costura</span>. El futuro de la moda es generativo.
            </p>

            <div className="flex justify-center md:justify-start gap-5">
              {[
                { icon: 'fa-instagram', link: '#' },
                { icon: 'fa-tiktok', link: '#' },
                { icon: 'fa-whatsapp', link: '#' }
              ].map((social, i) => (
                <motion.a 
                  key={i}
                  href={social.link}
                  whileHover={{ y: -5 }}
                  className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-pink-500 hover:border-pink-500 transition-all duration-500 group"
                >
                  <i className={`fab ${social.icon} text-lg text-gray-400 group-hover:text-white`}></i>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Enlaces de Navegación: Estilo Minimalista */}
          <div className="grid grid-cols-2 md:col-span-4 gap-12">
            <div className="space-y-8">
              <h4 className="font-black uppercase text-[10px] tracking-[0.4em] text-gray-500">Explorar</h4>
              <ul className="space-y-5 text-sm font-bold uppercase tracking-tight">
                <li><Link to="/products" className="text-gray-400 hover:text-pink-500 transition-colors">Colección</Link></li>
                <li><Link to="/about" className="text-gray-400 hover:text-pink-500 transition-colors">Sobre Nosotros</Link></li>
                <li><Link to="/musa-ai" className="text-gray-400 hover:text-pink-500 transition-colors">Tecnología IA</Link></li>
              </ul>
            </div>
            <div className="space-y-8">
              <h4 className="font-black uppercase text-[10px] tracking-[0.4em] text-gray-500">Soporte</h4>
              <ul className="space-y-5 text-sm font-bold uppercase tracking-tight">
                <li><a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">Guía de Uso</a></li>
                <li><a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">Privacidad</a></li>
                <li><a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">Contacto</a></li>
              </ul>
            </div>
          </div>

          {/* Newsletter Sutil */}
          <div className="md:col-span-3 space-y-8">
            <h4 className="font-black uppercase text-[10px] tracking-[0.4em] text-gray-500 text-center md:text-left">Insignia MUSA</h4>
            <div className="p-6 rounded-[2.5rem] bg-gradient-to-br from-white/5 to-transparent border border-white/10 text-center">
                <p className="text-[10px] font-black uppercase text-pink-500 mb-2">Motor Activo</p>
                <p className="text-xs text-gray-400 font-medium leading-tight">Acceso prioritario a nuevos modelos de IA generativa.</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Estilo Legal de Lujo */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
             <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.3em]">
               &copy; 2026 ICONIC C.V.F.
             </p>
             <div className="hidden md:block w-[1px] h-3 bg-white/10"></div>
             <p className="text-[9px] text-gray-700 font-bold uppercase tracking-widest">
               Design by Alejandro Villanueva
             </p>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[9px] font-black uppercase text-gray-500 tracking-widest">Valencia, VZLA</span>
            <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></div>
          </div>
        </div>
      </div>
    </footer>
  );
};