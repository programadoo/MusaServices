import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useContext } from "react";
import Home from "./pages/Home";
import Products from "./pages/Products"; 
import InfoProducts from "./pages/InfoProducts";

// Importamos los componentes modulares
import { Navbar } from "./shared/components/Navbar";
import { Footer } from "./shared/components/Footer";
import { CartDrawer } from "./shared/components/CartDrawer";

// Importamos el State (Provider) y el Contexto
import EcommerceState from "./shared/context/EcommerceState";
import { EcommerceContext } from "./shared/context/EcommerceContext"; 

const AppContent = () => {
  // Extraemos el estado del contexto global
  const context = useContext(EcommerceContext);

  // Si el contexto no está listo, no renderizamos nada para evitar errores
  if (!context) return null;

  const { isCartOpen, closeCart } = context as any;

  return (
    <>
      {/* 1. NAVBAR GLOBAL: Aparecerá en todas las rutas */}
      <Navbar />

      {/* 2. CARRITO GLOBAL */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={closeCart} 
      />

      {/* Contenedor principal con un min-h-screen y flex-col 
         para que el footer siempre se empuje al fondo 
      */}
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <Routes>
            <Route index element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/info/:id" element={<InfoProducts />} /> 
            {/* Aquí puedes añadir la ruta de Musa AI cuando la tengas lista */}
            {/* <Route path="/musa-ai" element={<MusaAI />} /> */}
          </Routes>
        </main>

        {/* 3. FOOTER GLOBAL: Se mantiene al final de cada página */}
        <Footer />
      </div>
    </>
  );
};

function App() {
  return (
    /* EcommerceState provee los datos de los productos 
      y la lógica del carrito a toda la aplicación.
    */
    <EcommerceState>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </EcommerceState>
  );
}

export default App;