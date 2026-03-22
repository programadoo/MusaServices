import { useContext, useEffect, useState } from "react";
import { EcommerceContext } from "../shared/context/ecommerceContext";
import SizeButtons from "../shared/components/infoProducts/SizeButtons";
import PaypalButtonComponent from "../shared/components/Paypal/PaypalButtonComponent";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Product } from "../shared/models/product.modul";

const InfoProducts = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Usamos el contexto actualizado que ahora incluye 'initState'
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
    
    // Buscamos el producto en el catálogo inicial (ahora sincronizado como initState)
    const productFromState = initState?.find((p: Product) => String(p.id) === String(id));

    if (productFromState) {
      setSelectedProduct(productFromState);
    } else {
      // Respaldo en LocalStorage si no está en el estado global
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  const cleanImageSrc = selectedProduct.image?.startsWith('http') 
    ? selectedProduct.image 
    : `/${selectedProduct.image}`;

  const handleInitCounter = (size: string) => {
    setSelectedSize(size);
    handleSize(size); // Sincroniza con el contexto global
    setInitCounter(1);
  };

  const incrementQty = () => setQuantity(prev => prev + 1);
  const decrementQty = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  // --- LÓGICA DE AGREGAR BLINDADA ---
  const onAddToCart = () => {
    // Verificamos si hay una talla seleccionada localmente o en el contexto
    const finalSize = selectedSize || contextSize;

    if (!finalSize) {
      alert("Por favor selecciona una talla antes de continuar.");
      return;
    }
    
    setIsAdding(true);

    // Creamos el objeto asegurando que la propiedad se llame 'size'
    // Esto es vital para que el findIndex del Contexto funcione
    const itemForCart = { 
      ...selectedProduct, 
      qty: quantity, 
      size: finalSize 
    };

    if (addToCart) {
      addToCart(itemForCart);
    }

    // Feedback visual y apertura del drawer
    setTimeout(() => {
      setIsAdding(false);
      if (openCart) openCart();
    }, 600);
  };

  return (
    <div className="bg-white min-h-screen font-sans selection:bg-pink-100">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-4">
        <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
          <Link to="/" className="hover:text-black transition-colors">Inicio</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-black transition-colors">Colecciones</Link>
          <span>/</span>
          <span className="text-gray-900">{selectedProduct?.name}</span>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          <div className="w-full lg:w-3/5 space-y-4">
            <div className="relative w-full overflow-hidden bg-gray-50 border border-gray-100 shadow-sm group">
              <img
                src={cleanImageSrc}
                alt={selectedProduct?.name}
                className="w-full h-auto aspect-[3/4] md:aspect-square object-cover object-top transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute top-6 left-6 bg-black/90 backdrop-blur-md px-4 py-2">
                <p className="text-[10px] font-black text-white uppercase tracking-[0.2em]">
                  Musa AI <span className="text-pink-500">Verified</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-gray-100 border-2 border-transparent hover:border-black cursor-pointer overflow-hidden transition-all group">
                  <img src={cleanImageSrc} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt="thumbnail" />
                </div>
              ))}
            </div>
          </div>

          <div className="w-full lg:w-2/5 flex flex-col space-y-8">
            <header className="space-y-4">
              <div className="inline-block px-3 py-1 bg-pink-50 text-pink-500 text-[9px] font-black uppercase tracking-widest">
                Edición Limitada
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter uppercase leading-[0.9]">
                {selectedProduct?.name}
              </h1>
              <div className="flex items-center gap-6 pt-2">
                <p className="text-3xl font-bold text-gray-900 tracking-tight">${selectedProduct?.price}</p>
              </div>
              <p className="text-gray-500 text-sm md:text-base leading-relaxed font-medium pt-2">
                {selectedProduct?.aiDescription || "Una pieza esencial diseñada para destacar con elegancia."}
              </p>
            </header>

            <div className="space-y-6">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-900">Seleccionar Talla</label>
                <div className="flex flex-wrap gap-3">
                  {initCounter === 0 ? (
                    ["XS", "S", "M", "L", "XL"].map((size) => (
                      <button
                        key={size}
                        onClick={() => handleInitCounter(size)}
                        className={`h-12 w-16 border-2 transition-all font-bold text-xs
                          ${(selectedSize === size || contextSize === size) ? "border-black bg-black text-white" : "border-gray-100 text-gray-900 hover:border-black bg-white"}`}
                      >
                        {size}
                      </button>
                    ))
                  ) : (
                    <div className="w-full"><SizeButtons /></div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-900 block">Cantidad</label>
                <div className="flex items-center w-36 h-12 border-2 border-gray-100 px-1 bg-gray-50/50">
                  <button onClick={decrementQty} className="w-10 h-full flex items-center justify-center hover:bg-white font-bold text-lg">-</button>
                  <span className="flex-1 text-center font-bold text-sm">{quantity}</span>
                  <button onClick={incrementQty} className="w-10 h-full flex items-center justify-center hover:bg-white font-bold text-lg">+</button>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <button
                onClick={onAddToCart}
                disabled={isAdding}
                className={`w-full h-14 flex items-center justify-center transition-all duration-300 border-2 
                  ${isAdding 
                    ? "bg-white border-green-500 text-green-500" 
                    : "bg-black border-black text-white hover:bg-white hover:text-black"} `}
              >
                <span className="text-[11px] font-black uppercase tracking-[0.3em]">
                  {isAdding ? "¡Añadido a la bolsa!" : "Añadir al carro"}
                </span>
              </button>
              
              <div className="pt-2 opacity-90 hover:opacity-100 transition-opacity">
                <PaypalButtonComponent />
              </div>
            </div>

            <div className="pt-10 border-t border-gray-100">
              <div className="flex gap-8 mb-6">
                <button onClick={() => setActiveTab("details")} className={`text-[10px] font-black uppercase tracking-widest border-b-2 pb-2 transition-all ${activeTab === "details" ? "border-black text-black" : "border-transparent text-gray-400"}`}>Detalles</button>
                <button onClick={() => setActiveTab("shipping")} className={`text-[10px] font-black uppercase tracking-widest border-b-2 pb-2 transition-all ${activeTab === "shipping" ? "border-black text-black" : "border-transparent text-gray-400"}`}>Envío</button>
              </div>
              <div className="text-xs text-gray-500 leading-relaxed font-medium">
                {activeTab === "details" 
                  ? <p>Inspirado en la visión vanguardista de VillaTech, este diseño utiliza materiales premium procesados bajo estándares de sostenibilidad.</p>
                  : <p>Envíos express a toda Venezuela (24-48h). Devoluciones gratuitas dentro de los primeros 15 días.</p>}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InfoProducts;