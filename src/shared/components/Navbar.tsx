import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { EcommerceContext } from "../context/EcommerceContext";

export const Navbar = () => {
  const context = useContext(EcommerceContext) as any;
  const { openCart, cart = [] } = context;
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const cartItemsCount = cart.reduce((acc: number, item: any) => acc + item.qty, 0);

  return (
    <nav className={`fixed w-full z-[100] top-0 left-0 transition-all duration-300 ${
      isScrolled ? "bg-white/95 backdrop-blur-md border-b border-gray-100 py-0 shadow-sm" : "bg-transparent border-transparent py-2"
    }`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center overflow-hidden shadow-md">
            <img src="src/assets/images/logo_proyecto.jpeg" alt="L" className="object-cover" />
          </div>
          <Link to="/" className="text-xl md:text-2xl font-black tracking-tighter uppercase">
            ICONIC <span className="text-pink-500 text-sm align-top">C.V.F</span>
          </Link>
        </div>

        <div className="flex items-center gap-4 md:gap-8">
          <div className="hidden md:flex items-center gap-8 text-[11px] font-bold uppercase tracking-[0.2em]">
            <Link to="/products" className="hover:text-pink-500 transition-colors">Colecciones</Link>
            <Link to="/musa-ai" className="hover:text-pink-500 transition-colors text-pink-500">Musa AI</Link>
          </div>
          
          <button onClick={openCart} className="relative p-2 hover:bg-gray-100 rounded-full transition-colors group">
            <i className="fas fa-shopping-bag text-lg group-hover:text-pink-500"></i>
            {cartItemsCount > 0 && (
              <span className="absolute top-0 right-0 bg-pink-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </button>

          <Link to="/products" className="px-5 py-2 md:px-6 md:py-2.5 bg-black text-white rounded-full hover:bg-pink-600 transition-all text-xs font-bold uppercase tracking-widest">
            Explorar
          </Link>
        </div>
      </div>
    </nav>
  );
};