import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EcommerceContext } from "../context/EcommerceContext";
import { AuthContext } from "../context/AuthContext"; 
import { motion, AnimatePresence } from "framer-motion";

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
          
          {/* 1. LOGO: Minimalista & Glow */}
          <div className="flex items-center gap-4 shrink-0 group">
            <div className="w-11 h-11 bg-gradient-to-tr from-pink-600 to-purple-700 rounded-2xl flex items-center justify-center overflow-hidden shadow-lg shadow-pink-500/20 group-hover:scale-110 transition-transform duration-500">
              <img src="src/assets/images/logo_proyecto.jpeg" alt="Logo" className="w-full h-full object-cover mix-blend-overlay opacity-80" />
            </div>
            <Link to="/" className="flex flex-col">
              <span className="text-xl font-black tracking-[-0.05em] uppercase text-white leading-none">
                ICONIC
              </span>
              <span className="text-[9px] font-black tracking-[0.4em] text-pink-500 uppercase leading-none mt-1">
                Digital CVF
              </span>
            </Link>
          </div>

          {/* 2. NAVEGACIÓN DESKTOP: Flotante & Glass */}
          <div className="hidden md:flex items-center gap-1 bg-white/5 backdrop-blur-md border border-white/10 px-2 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em]">
            <Link to="/products" className="px-6 py-2.5 text-gray-300 hover:text-white transition-all rounded-xl hover:bg-white/5">
              Colecciones
            </Link>
            <Link to="/musa-ai" className="px-6 py-2.5 text-pink-500 hover:text-pink-400 transition-all bg-pink-500/10 rounded-xl border border-pink-500/20">
              Musa AI ✨
            </Link>
          </div>
          
          {/* 3. ACCIONES: Estilo Neón */}
          <div className="flex items-center gap-3">
            {/* CARRITO */}
            <button 
              onClick={openCart} 
              className="relative w-11 h-11 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl hover:bg-pink-500 hover:border-pink-500 transition-all duration-500 text-white"
            >
              <i className="fas fa-shopping-bag text-sm"></i>
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-black text-[9px] font-black w-5 h-5 rounded-lg flex items-center justify-center shadow-lg animate-bounce">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* USUARIO DESKTOP */}
            <div className="hidden md:flex items-center gap-3 ml-2">
              {auth?.isAuthenticated ? (
                <div className="flex items-center gap-3 bg-white/5 p-1 rounded-2xl border border-white/10">
                  <Link to="/perfil" className="w-9 h-9 bg-gradient-to-tr from-pink-500 to-purple-600 text-white rounded-xl flex items-center justify-center text-xs font-black shadow-lg">
                    {auth.user?.name.charAt(0).toUpperCase()}
                  </Link>
                  <button onClick={handleLogout} className="pr-3 text-gray-500 hover:text-red-500 transition-colors text-sm">
                    <i className="fas fa-power-off"></i>
                  </button>
                </div>
              ) : (
                <Link to="/login" className="px-8 py-3.5 bg-white text-black rounded-2xl hover:bg-pink-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest shadow-xl shadow-white/5">
                  Sign In
                </Link>
              )}
            </div>

            {/* MOBILE TOGGLE */}
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="md:hidden w-11 h-11 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl text-white hover:bg-pink-500 transition-all"
            >
              <i className="fas fa-bars-staggered"></i>
            </button>
          </div>
        </div>
      </nav>

      {/* MENÚ LATERAL MOBILE: THE DARK SIDE */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[120] md:hidden"
            />
            
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 right-0 w-[85%] max-w-sm bg-[#0D0D0D] border-l border-white/5 z-[130] shadow-2xl md:hidden flex flex-col p-10 pt-28"
            >
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="absolute top-8 right-8 w-12 h-12 flex items-center justify-center bg-white/5 rounded-2xl text-white border border-white/10"
              >
                <i className="fas fa-times text-xl"></i>
              </button>

              <div className="space-y-12">
                <div className="space-y-6">
                  <p className="text-[10px] font-black text-pink-500 uppercase tracking-[0.5em] mb-4">Musa Experience</p>
                  <Link to="/products" onClick={() => setIsMenuOpen(false)} className="block group">
                    <span className="text-4xl font-black uppercase tracking-tighter text-white group-hover:text-pink-500 transition-colors">Colecciones</span>
                  </Link>
                  <Link to="/musa-ai" onClick={() => setIsMenuOpen(false)} className="block group">
                    <span className="text-4xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">Musa AI ✨</span>
                  </Link>
                </div>

                <div className="h-[1px] w-full bg-white/5" />

                <div className="space-y-8">
                  {auth?.isAuthenticated ? (
                    <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 relative overflow-hidden">
                      <div className="relative z-10">
                        <div className="w-16 h-16 bg-gradient-to-tr from-pink-500 to-purple-600 text-white rounded-2xl flex items-center justify-center text-2xl font-black mb-4">
                          {auth.user?.name.charAt(0).toUpperCase()}
                        </div>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Connected as</p>
                        <p className="text-2xl font-black uppercase text-white mb-6">{auth.user?.name.split(' ')[0]}</p>
                        <button onClick={handleLogout} className="w-full py-4 text-red-400 text-[10px] font-black uppercase tracking-[0.3em] border border-red-500/20 rounded-xl hover:bg-red-500/10 transition-all">
                           Disconnect
                        </button>
                      </div>
                      <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 blur-3xl rounded-full"></div>
                    </div>
                  ) : (
                    <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block w-full py-6 bg-white text-black text-center rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] hover:bg-pink-500 hover:text-white transition-all duration-500">
                      Entrar al Futuro
                    </Link>
                  )}
                </div>
              </div>

              <div className="mt-auto text-center opacity-30">
                <p className="text-[9px] font-black text-white uppercase tracking-[0.5em]">Musa Engine v1.0.42</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};