import { motion, AnimatePresence } from "framer-motion";
import { useContext } from "react";
import { EcommerceContext } from "../context/ecommerceContext";
// 1. IMPORTAMOS TU BOTÓN DE PAYPAL
import PaypalButtonComponent from "./Paypal/PaypalButtonComponent";

export const CartDrawer = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const context = useContext(EcommerceContext);
  
  if (!context) return null;

  const { cart, removeFromCart, total } = context;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[200]" 
          />
          
          <motion.div 
            initial={{ x: "100%" }} 
            animate={{ x: 0 }} 
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[201] shadow-[-20px_0_50px_rgba(0,0,0,0.1)] p-8 flex flex-col"
          >
            {/* Header del Carrito */}
            <div className="flex justify-between items-center mb-10">
              <div>
                <h3 className="text-2xl font-black uppercase tracking-tighter text-gray-900">Tu Selección</h3>
                <p className="text-[10px] font-bold text-pink-500 uppercase tracking-widest mt-1">
                  {cart.length} {cart.length === 1 ? 'Artículo' : 'Artículos'} en la bolsa
                </p>
              </div>
              <button 
                onClick={onClose} 
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all text-gray-400 hover:text-black"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            {/* Lista de Productos */}
            <div className="flex-1 overflow-y-auto space-y-8 pr-2 custom-scrollbar">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                    <i className="fas fa-shopping-bag text-gray-200 text-2xl"></i>
                  </div>
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Tu bolsa está vacía</p>
                  <button onClick={onClose} className="text-xs font-black uppercase text-pink-500 underline underline-offset-4">Explorar Colecciones</button>
                </div>
              ) : (
                cart.map((item, index) => (
                  <motion.div 
                    key={`${item.id}-${item.size}-${index}`} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex gap-5 items-center group relative"
                  >
                    <div className="relative w-24 h-32 flex-shrink-0 overflow-hidden rounded-2xl bg-gray-100">
                      <img 
                        src={item.image.startsWith('http') ? item.image : `/${item.image}`} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                        alt={item.name} 
                      />
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-start">
                        <h4 className="text-[12px] font-black uppercase tracking-tight text-gray-900 leading-tight pr-4">
                          {item.name}
                        </h4>
                      </div>
                      
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-[10px] font-bold bg-gray-100 px-2 py-0.5 rounded uppercase tracking-tighter">
                          Talla {item.size}
                        </span>
                        <span className="text-[10px] font-bold text-gray-400">
                          Cant: {item.qty}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <p className="text-gray-900 font-black text-sm tracking-tight">${item.price}</p>
                        <button 
                          onClick={() => removeFromCart(item.id, item.size)}
                          className="text-[10px] font-black text-gray-300 hover:text-red-500 uppercase tracking-widest transition-colors"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer con Total y Pago */}
            <div className="pt-8 mt-6 border-t border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <span className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em] block">Subtotal</span>
                  <span className="text-[9px] text-gray-400 font-medium">Impuestos calculados al finalizar</span>
                </div>
                <span className="text-4xl font-black tracking-tighter text-gray-900">
                   ${typeof total === 'number' ? total.toFixed(2) : total}
                </span>
              </div>
              
              {/* 2. REEMPLAZAMOS EL BOTÓN POR EL DE PAYPAL */}
              <div className="mt-4">
                {cart.length > 0 ? (
                  <PaypalButtonComponent />
                ) : (
                  <button 
                    disabled
                    className="w-full py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] bg-gray-100 text-gray-400 cursor-not-allowed"
                  >
                    Bolsa Vacía
                  </button>
                )}
              </div>
              
              <p className="text-center text-[8px] text-gray-400 uppercase font-bold tracking-widest mt-6">
                <i className="fas fa-lock mr-2"></i> Pago 100% Seguro vía VillaTech Gateway
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};