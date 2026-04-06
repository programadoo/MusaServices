import { ReactNode, useState, useEffect, useMemo } from "react";
import { EcommerceContext, Product, CartItem } from "./EcommerceContext";

// 🚀 IMPORTACIONES DE IMÁGENES PARA PRODUCCIÓN
// Asumiendo que EcommerceState está en src/shared/context/
import imgProud from "../../assets/images/proud.jpeg";
import aiImgProud from "../../assets/images/proud_final.png";

import imgMonalisa from "../../assets/images/monalisa.jpeg";
import aiImgMonalisa from "../../assets/images/monalisa_final.png";

import imgGiallo from "../../assets/images/giallo.jpeg";
import aiImgGiallo from "../../assets/images/giallo_final.png";

import imgExpensive from "../../assets/images/expensive.jpeg";
import aiImgExpensive from "../../assets/images/expensive_final.png";

import imgClassic from "../../assets/images/classic.jpeg";
import aiImgClassic from "../../assets/images/clasic_final.png"; // Ojo aquí con el nombre "clasic"

import imgMusa from "../../assets/images/musa.jpeg";
import aiImgMusa from "../../assets/images/musa_final.png";

const EcommerceState = ({ children }: { children: ReactNode }) => {
  // 1. Catálogo Completo
  const [initState, setInitState] = useState<Product[]>([
    {
      id: 1,
      name: "Proud",
      price: 129.99,
      quantity: 15,
      image: imgProud,
      aiImage: aiImgProud,
      selected: false,
      stars: 4,
      reviews: 15,
      category: "dresses",
      aiDescription: "A taupe tailored double-breasted vest and matching wide-leg trousers, formal office wear",
    },
    {
      id: 2,
      name: "Monalisa",
      price: 400.65,
      quantity: 6,
      image: imgMonalisa,
      aiImage: aiImgMonalisa,
      selected: false,
      stars: 5,
      reviews: 31,
      category: "dresses",
      aiDescription: "A brown linen off-the-shoulder jumpsuit with a wide-leg cut, elegant and textured",
    },
    {
      id: 3,
      name: "Giallo",
      price: 100.1,
      quantity: 8,
      image: imgGiallo,
      aiImage: aiImgGiallo,
      selected: false,
      stars: 4,
      reviews: 23,
      category: "dresses",
      aiDescription: "A beige halter-neck jumpsuit with a square neckline and prominent utility pockets on the thighs, slim fit",
    },
    {
      id: 4,
      name: "Expensive",
      price: 29.99,
      quantity: 55,
      image: imgExpensive,
      aiImage: aiImgExpensive,
      selected: false,
      stars: 5,
      reviews: 25,
      category: "dresses",
      aiDescription: "A white structured asymmetric blazer with a high-neck scarf detail and wide-leg tailored trousers, couture style",
    },
    {
      id: 5,
      name: "Classic",
      price: 135.5,
      quantity: 17,
      image: imgClassic,
      aiImage: aiImgClassic,
      selected: false,
      stars: 3,
      reviews: 5,
      category: "dresses",
      aiDescription: "A cream-colored tailored vest and matching wide-leg trousers, formal style",
    },
    {
      id: 6,
      name: "Musa",
      price: 95.2,
      quantity: 9,
      image: imgMusa,
      aiImage: aiImgMusa,
      selected: false,
      stars: 4,
      reviews: 17,
      category: "dresses",
      aiDescription: "A white strapless jumpsuit with a black belt and a straight-leg cut",
    },
  ]);

  // 2. Estado del Carrito con Persistencia
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem("villatech_cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [selectedSize, setSelectedSize] = useState<string>("");
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sincronizar Carrito con LocalStorage
  useEffect(() => {
    localStorage.setItem("villatech_cart", JSON.stringify(cart));
  }, [cart]);

  // 3. Funciones de Lógica
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const handleSize = (size: string) => setSelectedSize(size);

  const addToCart = (newItem: CartItem) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.id === newItem.id && item.size === newItem.size
      );

      if (existingIndex !== -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingIndex].qty += newItem.qty;
        return updatedCart;
      }
      return [...prevCart, newItem];
    });
    setIsCartOpen(true); // Abre el carrito automáticamente
  };

  const removeFromCart = (id: string | number, size: string) => {
    setCart((prev) => prev.filter((item) => !(item.id === id && item.size === size)));
  };

  const handleSelectedState = (nameProduct: string) => {
    const indexProduct = initState.findIndex((p) => p.name === nameProduct);
    if (indexProduct !== -1) {
      const newState = [...initState];
      newState.forEach(p => p.selected = false); 
      newState[indexProduct].selected = true;
      setInitState(newState);
      localStorage.setItem("productSelected", JSON.stringify(newState[indexProduct]));
    }
  };

  // 4. Cálculo del Total
  const total = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.price * (item.qty || 1), 0);
  }, [cart]);

  return (
    <EcommerceContext.Provider
      value={{
        initState,
        products: initState, // Para compatibilidad con ambos nombres
        cart,
        total,
        isCartOpen,
        openCart,
        closeCart,
        handleSelectedState,
        size: selectedSize || "",
        handleSize,
        addToCart,
        removeFromCart,
        clearCart: () => setCart([]),
      } as any}
    >
      {children}
    </EcommerceContext.Provider>
  );
};

export default EcommerceState;