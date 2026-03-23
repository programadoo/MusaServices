import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-[#0A0A0A] text-white pt-16 pb-12 md:pt-24 md:pb-12 px-6 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 mb-16 md:mb-20">
          <div className="md:col-span-5 space-y-6 md:space-y-8 text-center md:text-left">
            <h3 className="text-2xl md:text-3xl font-black tracking-tighter uppercase">Iconic <span className="text-pink-500">C.V.F</span></h3>
            <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-sm mx-auto md:mx-0">
              Redefiniendo el e-commerce de moda a través de la inteligencia artificial y la innovación tecnológica.
            </p>
            <div className="flex justify-center md:justify-start gap-4">
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center hover:bg-pink-500 hover:scale-110 transition-all cursor-pointer">
                <i className="fab fa-instagram text-xl"></i>
              </div>
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center hover:bg-pink-500 hover:scale-110 transition-all cursor-pointer">
                <i className="fab fa-tiktok text-xl"></i>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:col-span-7 gap-8 text-center md:text-left">
              <div>
                <h4 className="font-black uppercase text-[11px] tracking-[0.2em] text-pink-500 mb-6 md:mb-8">Empresa</h4>
                <ul className="space-y-4 text-gray-400 font-medium text-xs md:text-sm">
                  <li><Link to="/about" className="hover:text-white transition-colors">Sobre Nosotros</Link></li>
                  <li><Link to="/musa-ai" className="hover:text-white transition-colors">Tecnología Musa</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-black uppercase text-[11px] tracking-[0.2em] text-pink-500 mb-6 md:mb-8">Soporte</h4>
                <ul className="space-y-4 text-gray-400 font-medium text-xs md:text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">Guía IA</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Privacidad</a></li>
                </ul>
              </div>
          </div>
        </div>
        <div className="pt-12 border-t border-white/10 text-center flex flex-col items-center justify-center gap-4">
          <p className="text-[9px] md:text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em]">
            &copy; 2026 ICONIC C.V.F. TODOS LOS DERECHOS RESERVADOS.
          </p>
          <p className="text-[8px] text-gray-700 font-black uppercase tracking-widest">Powered by Musa Engine</p>
        </div>
      </div>
    </footer>
  );
};