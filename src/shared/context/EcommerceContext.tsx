import React, { createContext, useState, useEffect, useMemo } from "react";

// 1. DEFINICIÓN DE INTERFACES (Contrato de datos)
export interface Product {
  id: string | number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  selected?: boolean; 
  stars?: number;
  reviews?: number;
  category: string; 
  aiDescription?: string;
  aiImage?: string;
}

export interface CartItem extends Product {
  size: string; 
  qty: number;
  isAiGenerated?: boolean;
}

interface EcommerceContextType {
  products: Product[];
  initState: Product[];
  cart: CartItem[];
  size: string;
  total: number;
  isCartOpen: boolean;
  handleSize: (size: string) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string | number, size: string) => void;
  clearCart: () => void;
  openCart: () => void; 
  closeCart: () => void;
}

export const EcommerceContext = createContext<EcommerceContextType | undefined>(undefined);

export const EcommerceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  
  // --- ESTADOS ---
  // Nota: initState y products vendrán desde EcommerceState.tsx, 
  // aquí inicializamos los estados que sí gestiona este Provider.
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem("villatech_cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [size, setSize] = useState<string>("");
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Sincronizar con LocalStorage
  useEffect(() => {
    localStorage.setItem("villatech_cart", JSON.stringify(cart));
  }, [cart]);

  // --- LÓGICA ---
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
    setIsCartOpen(true); 
  };

  const removeFromCart = (id: string | number, itemSize: string) => {
    setCart((prevCart) => prevCart.filter((item) => !(item.id === id && item.size === itemSize)));
  };

  const clearCart = () => setCart([]);

  const handleSize = (selectedSize: string) => setSize(selectedSize);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  // --- CÁLCULO DEL TOTAL ---
  const total = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  }, [cart]);

  return (
    <EcommerceContext.Provider
      value={{
        // Para eliminar el subrayado, enviamos valores por defecto. 
        // EcommerceState.tsx se encargará de llenar estos datos realmente.
        products: [], 
        initState: [],
        cart,
        size,
        total,
        isCartOpen,
        handleSize,
        addToCart,
        removeFromCart,
        clearCart,
        openCart,
        closeCart
      } as any}
    >
      {children}
    </EcommerceContext.Provider>
  );
};