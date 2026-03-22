import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useContext } from "react";
import Home from "./pages/Home";
import Products from "./pages/Products"; 
import InfoProducts from "./pages/InfoProducts";
// Importamos el State (Provider) y el Contexto
import EcommerceState from "./shared/context/EcommerceState";
import { EcommerceContext } from "./shared/context/ecommerceContext"; 
import { CartDrawer } from "./shared/components/CartDrawer";

const AppContent = () => {
  // Extraemos el estado del contexto global
  const context = useContext(EcommerceContext);

  // Si el contexto no está listo, no renderizamos nada para evitar errores
  if (!context) return null;

  const { isCartOpen, closeCart } = context as any;

  return (
    <>
      {/* El CartDrawer ahora está 100% vinculado al estado global de EcommerceState */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={closeCart} 
      />

      <Routes>
        <Route index element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/info/:id" element={<InfoProducts />} /> 
      </Routes>
    </>
  );
};

function App() {
  return (
    /* Usamos EcommerceState como el único Provider. 
      Esto asegura que los 6 productos (Proud, Monalisa, etc.) 
      estén disponibles en toda la app.
    */
    <EcommerceState>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </EcommerceState>
  );
}

export default App;