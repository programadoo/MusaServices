import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useContext } from "react";

// Páginas
import Home from "./pages/Home";
import Products from "./pages/Products"; 
import InfoProducts from "./pages/InfoProducts";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MusaAI from "./pages/MusaAI"; 
import Profile from "./pages/Profile";

// Componentes Globales y Seguridad
import { Navbar } from "./shared/components/Navbar";
import { Footer } from "./shared/components/Footer";
import { CartDrawer } from "./shared/components/CartDrawer";
import { ProtectedRoute } from "./shared/components/ProtectedRoute"; 

// Contextos y Providers
import EcommerceState from "./shared/context/EcommerceState";
import { EcommerceContext } from "./shared/context/EcommerceContext"; 
import { AuthProvider } from "./shared/context/AuthContext";

const AppContent = () => {
  const context = useContext(EcommerceContext);
  const location = useLocation();

  if (!context) return null;

  const { isCartOpen, closeCart } = context as any;

  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="relative w-full min-h-screen flex flex-col bg-white">
      {/* 1. NAVBAR GLOBAL */}
      {!isAuthPage && <Navbar />}

      {/* 2. CARRITO GLOBAL */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={closeCart} 
      />

      {/* QUITAMOS: paddings o márgenes que limiten el ancho. 
          El main ahora permite que cada sección interna del Home maneje su ancho.
      */}
      <main className="flex-grow w-full">
        <Routes>
          <Route index element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/info/:id" element={<InfoProducts />} /> 
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route 
            path="/musa-ai" 
            element={
              <ProtectedRoute>
                <MusaAI />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/perfil" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>

      {/* 3. FOOTER GLOBAL */}
      {!isAuthPage && <Footer />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <EcommerceState>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </EcommerceState>
    </AuthProvider>
  );
}

export default App;