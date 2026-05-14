import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EcommerceContext } from "../context/EcommerceContext";
import { AuthContext } from "../context/AuthContext"; 
import { motion, AnimatePresence } from "framer-motion";
import imgLogo from "../../assets/images/logofinal.png";
// SE ELIMINÓ EL IMPORT DE IMGLOGO PARA EVITAR ERRORES DE RUTA EN RENDER

export const Navbar = () => {
  const context = useContext(EcommerceContext) as any;
  const auth = useContext(AuthContext); 
  const navigate = useNavigate();

  const { openCart, cart = [] } = context;
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    auth?.logout();
    setIsMenuOpen(false);
    navigate("/login");
  };

  const cartItemsCount = cart.reduce((acc: number, item: any) => acc + item.qty, 0);

  return (
    <>
      <nav className={`fixed w-full z-[100] top-0 left-0 transition-all duration-500 ${
        isScrolled || isMenuOpen 
          ? "bg-black/70 backdrop-blur-2xl border-b border-white/5 py-3" 
          : "bg-transparent py-6"
      }`}>
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex justify-between items-center">
          
          {/* 1. LOGO MUSA CORE */}
          <div className="flex items-center gap-4 shrink-0 group">
            <Link to="/" className="flex items-center gap-4">
              <div className="w-11 h-11 bg-gradient-to-tr from-pink-600 to-purple-700 rounded-2xl flex items-center justify-center overflow-hidden shadow-lg shadow-pink-500/20 group-hover:scale-110 transition-transform duration-500">
                {/* Cargamos directamente desde la carpeta public */}
                <img 
                  src={imgLogo}
                  alt="Musa Logo" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://via.placeholder.com/150?text=M";
                  }}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-[-0.05em] uppercase text-white leading-none">ICONIC CVF</span>
              </div>
            </Link>
          </div>

          {/* 2. NAVEGACIÓN DESKTOP */}
          <div className="hidden md:flex items-center gap-1 bg-white/5 backdrop-blur-md border border-white/10 px-2 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em]">
            <Link to="/products" className="px-6 py-2.5 text-gray-300 hover:text-white transition-all rounded-xl hover:bg-white/5">Colecciones</Link>
            <Link to="/musa-ai" className="px-6 py-2.5 text-pink-500 hover:text-pink-400 transition-all bg-pink-500/10 rounded-xl border border-pink-500/20">Musa AI ✨</Link>
          </div>
          
          {/* 3. ACCIONES */}
          <div className="flex items-center gap-3">
            <button onClick={openCart} className="relative w-11 h-11 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl hover:bg-pink-500 hover:border-pink-500 transition-all duration-500 text-white">
              <i className="fas fa-shopping-bag text-sm"></i>
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-black text-[9px] font-black w-5 h-5 rounded-lg flex items-center justify-center shadow-lg animate-bounce">{cartItemsCount}</span>
              )}
            </button>

            <div className="hidden md:flex items-center gap-3 ml-2">
              {auth?.isAuthenticated ? (
                <div className="flex items-center gap-3 bg-white/5 p-1 rounded-2xl border border-white/10">
                  <Link to="/perfil" className="w-9 h-9 bg-gradient-to-tr from-pink-500 to-purple-600 text-white rounded-xl flex items-center justify-center text-xs font-black shadow-lg">
                    {auth.user?.name.charAt(0).toUpperCase()}
                  </Link>
                  <button onClick={handleLogout} className="pr-3 text-gray-500 hover:text-red-500 transition-colors text-sm"><i className="fas fa-power-off"></i></button>
                </div>
              ) : (
                <Link to="/login" className="px-8 py-3.5 bg-white text-black rounded-2xl hover:bg-pink-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest shadow-xl shadow-white/5">Sign In</Link>
              )}
            </div>

            <button onClick={() => setIsMenuOpen(true)} className="md:hidden w-11 h-11 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl text-white hover:bg-pink-500 transition-all">
              <i className="fas fa-bars-staggered"></i>
            </button>
          </div>
        </div>
      </nav>

      {/* MENÚ LATERAL MOBILE */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMenuOpen(false)} className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[120] md:hidden" />
            
            <motion.div 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 right-0 w-[85%] max-w-sm bg-[#0D0D0D] border-l border-white/5 z-[130] shadow-2xl md:hidden flex flex-col p-8 pt-24"
            >
              <button onClick={() => setIsMenuOpen(false)} className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center bg-white/5 rounded-2xl text-white border border-white/10"><i className="fas fa-times text-xl"></i></button>

              <div className="flex flex-col h-full">
                <div className="space-y-3 mb-10">
                  <p className="text-[10px] font-black text-pink-500 uppercase tracking-[0.5em] mb-6 pl-2">Explorar</p>
                  
                  <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 active:scale-95 transition-all group">
                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-white/10 transition-colors">
                      <i className="fas fa-home text-gray-400 group-hover:text-white transition-colors"></i>
                    </div>
                    <span className="text-2xl font-black uppercase tracking-tighter text-white group-hover:text-pink-500">Inicio</span>
                  </Link>

                  <Link to="/products" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 active:scale-95 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-white/10 transition-colors">
                        <i className="fas fa-th-large text-gray-400 group-hover:text-white transition-colors"></i>
                      </div>
                      <span className="text-2xl font-black uppercase tracking-tighter text-white group-hover:text-pink-500">Colecciones</span>
                    </div>
                    <i className="fas fa-chevron-right text-gray-600 group-hover:text-pink-500 pr-2"></i>
                  </Link>

                  <Link to="/musa-ai" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between p-4 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-2xl border border-pink-500/20 active:scale-95 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-pink-500/10 rounded-xl flex items-center justify-center">
                        <i className="fas fa-wand-magic-sparkles text-pink-500"></i>
                      </div>
                      <span className="text-2xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">Musa AI ✨</span>
                    </div>
                  </Link>
                </div>

                <div className="h-[1px] w-full bg-white/5 mb-10" />

                <div className="mt-auto md:mt-0">
                  {auth?.isAuthenticated ? (
                    <div className="space-y-4">
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.5em] mb-4 pl-2">Mi Cuenta</p>
                      
                      <Link 
                        to="/perfil" 
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-4 bg-white/5 p-6 rounded-[2rem] border border-white/10 relative overflow-hidden group active:bg-white/10 transition-colors"
                      >
                        <div className="relative z-10 w-14 h-14 bg-gradient-to-tr from-pink-500 to-purple-600 text-white rounded-2xl flex items-center justify-center text-xl font-black shadow-lg">
                          {auth.user?.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="relative z-10 flex flex-col">
                          <p className="text-[10px] font-black text-pink-500 uppercase tracking-widest">Ver Perfil</p>
                          <p className="text-xl font-black uppercase text-white truncate max-w-[150px]">{auth.user?.name.split(' ')[0]}</p>
                        </div>
                        <i className="fas fa-arrow-right absolute right-6 text-gray-700 group-hover:text-white group-hover:translate-x-1 transition-all"></i>
                        <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/5 blur-3xl rounded-full"></div>
                      </Link>

                      <button onClick={handleLogout} className="w-full py-5 text-red-400 text-[10px] font-black uppercase tracking-[0.3em] bg-red-500/5 border border-red-500/10 rounded-2xl hover:bg-red-500/10 active:scale-95 transition-all flex items-center justify-center gap-3">
                        <i className="fas fa-power-off"></i> Cerrar Sesión
                      </button>
                    </div>
                  ) : (
                    <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block w-full py-6 bg-white text-black text-center rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] hover:bg-pink-500 hover:text-white transition-all duration-500 shadow-xl shadow-white/5">
                      Entrar al Futuro
                    </Link>
                  )}
                </div>

                <div className="mt-10 text-center opacity-30">
                  <p className="text-[9px] font-black text-white uppercase tracking-[0.5em]">Musa Engine v1.0.42</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};