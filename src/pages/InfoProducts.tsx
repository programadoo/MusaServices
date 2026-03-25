import { useContext, useEffect, useState } from "react";
import { EcommerceContext } from "../shared/context/EcommerceContext";
import SizeButtons from "../shared/components/infoProducts/SizeButtons";
import PaypalButtonComponent from "../shared/components/Paypal/PaypalButtonComponent";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Product } from "../shared/models/product.modul";
import { motion, AnimatePresence } from "framer-motion";

const InfoProducts = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const context = useContext(EcommerceContext) as any;
  const { handleSize, addToCart, openCart, initState, size: contextSize } = context;

  const [initCounter, setInitCounter] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("details");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const productFromState = initState?.find((p: Product) => String(p.id) === String(id));

    if (productFromState) {
      setSelectedProduct(productFromState);
    } else {
      const productRaw = localStorage.getItem("productSelected");
      if (productRaw) {
        const parsedData = JSON.parse(productRaw);
        const localProduct = parsedData.productData ? parsedData.productData : parsedData;
        if (String(localProduct.id) === String(id)) {
          setSelectedProduct(localProduct);
        } else {
          navigate("/products");
        }
      }
    }
  }, [id, initState, navigate]);

  if (!selectedProduct) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-t-2 border-pink-500 rounded-full animate-spin"></div>
          <div className="absolute inset-2 border-t-2 border-purple-500 rounded-full animate-spin-slow"></div>
        </div>
      </div>
    );
  }

  const cleanImageSrc = selectedProduct.image?.startsWith('http') 
    ? selectedProduct.image 
    : `/${selectedProduct.image}`;

  const handleInitCounter = (size: string) => {
    setSelectedSize(size);
    handleSize(size);
    setInitCounter(1);
  };

  const incrementQty = () => setQuantity(prev => prev + 1);
  const decrementQty = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const onAddToCart = () => {
    const finalSize = selectedSize || contextSize;
    if (!finalSize) {
      alert("Por favor selecciona una talla.");
      return;
    }
    
    setIsAdding(true);
    const itemForCart = { ...selectedProduct, qty: quantity, size: finalSize };
    if (addToCart) addToCart(itemForCart);

    setTimeout(() => {
      setIsAdding(false);
      if (openCart) openCart();
    }, 800);
  };

  return (
    <div className="bg-[#0A0A0A] min-h-screen text-white selection:bg-pink-500/30">
      {/* NAVEGACIÓN SUTIL */}
      <nav className="max-w-7xl mx-auto px-6 pt-32 pb-6">
        <div className="flex items-center space-x-3 text-[9px] font-black uppercase tracking-[0.3em] text-gray-500">
          <Link to="/" className="hover:text-pink-500 transition-colors">Musa</Link>
          <span className="opacity-20">/</span>
          <Link to="/products" className="hover:text-pink-500 transition-colors">Drops</Link>
          <span className="opacity-20">/</span>
          <span className="text-gray-300">{selectedProduct?.name}</span>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-4 pb-32">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          
          {/* COLUMNA IZQUIERDA: VISUALS */}
          <div className="w-full lg:col-span-7 space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-[3/4] rounded-[3rem] overflow-hidden bg-[#111111] border border-white/5 group"
            >
              <img
                src={cleanImageSrc}
                alt={selectedProduct?.name}
                className="w-full h-full object-cover object-top transition-transform duration-[2s] group-hover:scale-110"
              />
              <div className="absolute top-8 left-8 bg-black/60 backdrop-blur-xl border border-white/10 px-5 py-2.5 rounded-2xl">
                <p className="text-[10px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                  <span className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></span>
                  Musa <span className="text-gray-400">v1.0 Ready</span>
                </p>
              </div>
            </motion.div>

            {/* THUMBNAILS ESTILO EDITORIAL */}
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-[#111111] rounded-3xl border border-white/5 hover:border-pink-500/50 cursor-pointer overflow-hidden transition-all group">
                  <img src={cleanImageSrc} className="w-full h-full object-cover opacity-40 group-hover:opacity-100 transition-opacity" alt="detail" />
                </div>
              ))}
            </div>
          </div>

          {/* COLUMNA DERECHA: INFO & ACCIONES */}
          <div className="w-full lg:col-span-5 flex flex-col space-y-10">
            <header className="space-y-6">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-500 text-[10px] font-black uppercase tracking-widest"
              >
                Limited Edition Drop
              </motion.div>
              
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.85]">
                {selectedProduct?.name}
              </h1>

              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-light text-white tracking-tighter">${selectedProduct?.price}</span>
                <span className="text-gray-600 text-[10px] font-bold uppercase tracking-widest italic">Impuestos incluidos</span>
              </div>

              <p className="text-gray-400 text-base leading-relaxed font-medium italic border-l-2 border-pink-500/30 pl-6">
                {selectedProduct?.aiDescription || "Una pieza esencial diseñada para destacar con elegancia en el entorno digital."}
              </p>
            </header>

            {/* SELECCIÓN DE TALLA */}
            <div className="space-y-6 p-8 rounded-[2.5rem] bg-[#111111] border border-white/5">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Talla Seleccionada</label>
                  <button className="text-[9px] font-bold text-pink-500 uppercase tracking-widest border-b border-pink-500/20">Guía de tallas</button>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {initCounter === 0 ? (
                    ["XS", "S", "M", "L", "XL"].map((size) => (
                      <button
                        key={size}
                        onClick={() => handleInitCounter(size)}
                        className={`h-14 w-14 rounded-2xl border transition-all duration-500 font-black text-xs
                          ${(selectedSize === size || contextSize === size) 
                            ? "border-pink-500 bg-pink-500 text-white shadow-[0_0_20px_rgba(236,72,153,0.3)]" 
                            : "border-white/10 text-gray-400 hover:border-white/30 bg-white/5"}`}
                      >
                        {size}
                      </button>
                    ))
                  ) : (
                    <div className="w-full"><SizeButtons /></div>
                  )}
                </div>
              </div>

              {/* CANTIDAD */}
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Cantidad</label>
                <div className="flex items-center w-40 h-14 bg-white/5 border border-white/10 rounded-2xl px-2">
                  <button onClick={decrementQty} className="w-12 h-full flex items-center justify-center hover:text-pink-500 transition-colors font-bold text-xl">-</button>
                  <span className="flex-1 text-center font-black text-sm">{quantity}</span>
                  <button onClick={incrementQty} className="w-12 h-full flex items-center justify-center hover:text-pink-500 transition-colors font-bold text-xl">+</button>
                </div>
              </div>
            </div>

            {/* BOTONES DE COMPRA */}
            <div className="space-y-4">
              <button
                onClick={onAddToCart}
                disabled={isAdding}
                className={`w-full h-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-500 border-2 
                  ${isAdding 
                    ? "bg-transparent border-green-500 text-green-500" 
                    : "bg-white border-white text-black hover:bg-transparent hover:text-white hover:border-white/20"} `}
              >
                <span className="text-[11px] font-black uppercase tracking-[0.3em]">
                  {isAdding ? "System_Updated_Cart" : "Añadir a la bolsa"}
                </span>
              </button>
              
              <div className="pt-2 brightness-90 hover:brightness-110 transition-all rounded-2xl overflow-hidden">
                <PaypalButtonComponent />
              </div>
            </div>

            {/* TABS INFERIORES */}
            <div className="pt-10 border-t border-white/5">
              <div className="flex gap-10 mb-8">
                {["details", "shipping"].map((tab) => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)} 
                    className={`text-[10px] font-black uppercase tracking-[0.4em] pb-3 transition-all relative
                      ${activeTab === tab ? "text-white" : "text-gray-600"}`}
                  >
                    {tab === "details" ? "Especificaciones" : "Logística"}
                    {activeTab === tab && (
                      <motion.div layoutId="underline" className="absolute bottom-0 left-0 w-full h-[2px] bg-pink-500" />
                    )}
                  </button>
                ))}
              </div>
              
              <AnimatePresence mode="wait">
                <motion.div 
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-xs text-gray-500 leading-relaxed font-medium"
                >
                  {activeTab === "details" 
                    ? <p className="italic">Procesado con el motor Musa v1.0. Este diseño utiliza polímeros sintéticos de alta fidelidad y fibras orgánicas para un ajuste dinámico.</p>
                    : <p>Envíos prioritarios vía VillaTech Logistics. Entrega estimada en 24h para zonas urbanas. Seguimiento vía blockchain incluido.</p>}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InfoProducts;