import { ReactNode, useState, useEffect, useMemo } from "react";
import { EcommerceContext, Product, CartItem } from "./EcommerceContext";

const EcommerceState = ({ children }: { children: ReactNode }) => {
  // 1. Catálogo Completo de VillaTech
  const [initState, setInitState] = useState<Product[]>([
    {
      id: 1,
      name: "Proud",
      price: 129.99,
      quantity: 15,
      image: "src/assets/images/proud.jpeg",
      aiImage: "src/assets/images/proud_final.png",
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
      image: "src/assets/images/monalisa.jpeg",
      aiImage: "src/assets/images/monalisa_final.png",
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
      image: "src/assets/images/giallo.jpeg",
      aiImage: "src/assets/images/giallo_final.png",
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
      image: "src/assets/images/expensive.jpeg",
      aiImage: "src/assets/images/expensive_final.png",
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
      image: "src/assets/images/classic.jpeg",
      aiImage: "src/assets/images/clasic_final.png",
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
      image: "src/assets/images/musa.jpeg",
      aiImage: "src/assets/images/musa_final.png",
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