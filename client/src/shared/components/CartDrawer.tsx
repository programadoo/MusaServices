import { motion, AnimatePresence } from "framer-motion";
import { useContext } from "react";
import { EcommerceContext } from "../context/EcommerceContext";
import PaypalButtonComponent from "./Paypal/PaypalButtonComponent";

export const CartDrawer = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const context = useContext(EcommerceContext);
  
  if (!context) return null;

  const { cart, removeFromCart, total } = context;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* OVERLAY SUTIL */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200]" 
          />
          
          {/* DRAWER OSCURO */}
          <motion.div 
            initial={{ x: "100%" }} 
            animate={{ x: 0 }} 
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-[#0A0A0A] z-[201] shadow-[-30px_0_60px_rgba(0,0,0,0.5)] p-8 flex flex-col border-l border-white/5 text-white"
          >
            {/* Header del Carrito */}
            <div className="flex justify-between items-center mb-12">
              <div>
                <h3 className="text-3xl font-black uppercase tracking-tighter leading-none">Tu Selección</h3>
                <div className="flex items-center gap-2 mt-3">
                  <span className="w-6 h-[1px] bg-pink-500"></span>
                  <p className="text-[9px] font-black text-pink-500 uppercase tracking-[0.3em]">
                    {cart.length} {cart.length === 1 ? 'Pieza' : 'Piezas'} en archivo
                  </p>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-all border border-white/10 group"
              >
                <i className="fas fa-times text-gray-400 group-hover:text-white group-hover:rotate-90 transition-all"></i>
              </button>
            </div>

            {/* Lista de Productos */}
            <div className="flex-1 overflow-y-auto space-y-8 pr-4 custom-scrollbar">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-pink-500/20 blur-2xl rounded-full"></div>
                    <div className="relative w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                      <i className="fas fa-shopping-bag text-gray-600 text-2xl"></i>
                    </div>
                  </div>
                  <p className="text-gray-500 font-bold uppercase tracking-[0.4em] text-[9px]">Inventario Vacío</p>
                  <button 
                    onClick={onClose} 
                    className="px-8 py-3 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                  >
                    Explorar
                  </button>
                </div>
              ) : (
                cart.map((item: any, index: number) => (
                  <motion.div 
                    key={`${item.id}-${item.size}-${index}`} 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex gap-6 items-center group relative p-4 rounded-3xl hover:bg-white/[0.02] border border-transparent hover:border-white/5 transition-all"
                  >
                    <div className="relative w-24 h-32 flex-shrink-0 overflow-hidden rounded-2xl bg-[#111111] border border-white/5">
                      <img 
                        src={item.image.startsWith('http') ? item.image : `/${item.image}`} 
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" 
                        alt={item.name} 
                      />
                    </div>

                    <div className="flex-1 space-y-2">
                      <h4 className="text-[11px] font-black uppercase tracking-widest text-white leading-tight pr-4">
                        {item.name}
                      </h4>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] font-black bg-pink-500/10 text-pink-500 border border-pink-500/20 px-2 py-0.5 rounded-md uppercase tracking-tighter">
                          Talla {item.size}
                        </span>
                        <span className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">
                          Cant: {item.qty}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <p className="text-white font-black text-base tracking-tighter">${item.price}</p>
                        <button 
                          onClick={() => removeFromCart(item.id, item.size)}
                          className="text-[9px] font-black text-gray-600 hover:text-pink-500 uppercase tracking-widest transition-colors"
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer con Total y Pago */}
            <div className="pt-10 mt-6 border-t border-white/5">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <span className="text-[9px] font-black uppercase text-gray-600 tracking-[0.4em] block mb-1">Total Estimado</span>
                  <span className="text-[8px] text-gray-700 font-bold uppercase tracking-widest">VillaTech Checkout v1.2</span>
                </div>
                <div className="text-right">
                  <span className="text-5xl font-black tracking-tighter text-white">
                    ${typeof total === 'number' ? total.toFixed(2) : total}
                  </span>
                </div>
              </div>
              
              {/* PAYPAL COMPONENT INTEGRADO */}
              <div className="mt-4 relative z-10">
                {cart.length > 0 ? (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <PaypalButtonComponent />
                  </div>
                ) : (
                  <button 
                    disabled
                    className="w-full py-6 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] bg-white/5 text-gray-600 border border-white/5 cursor-not-allowed"
                  >
                    Archivo Vacío
                  </button>
                )}
              </div>
              
              <div className="flex items-center justify-center gap-3 mt-8">
                <i className="fas fa-shield-alt text-pink-500 text-[10px]"></i>
                <p className="text-[8px] text-gray-600 uppercase font-black tracking-[0.3em]">
                  Pago Seguro & Encriptado
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};