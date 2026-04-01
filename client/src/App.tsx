import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useContext, useEffect } from "react"; 
import { Toaster } from 'react-hot-toast';

// Páginas
import Home from "./pages/Home";
import Products from "./pages/Products"; 
import InfoProducts from "./pages/InfoProducts";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MusaAI from "./pages/MusaAI"; 
import Profile from "./pages/Profile";
import ResetPassword from "./pages/ResetPassword"; // 👈 Nueva Página
import ForgotPassword from "./pages/ForgotPassword"; // 👈 Nueva Página (Si decides crearla)

// Componentes Globales y Seguridad
import { Navbar } from "./shared/components/Navbar";
import { Footer } from "./shared/components/Footer";
import { CartDrawer } from "./shared/components/CartDrawer";
import { ProtectedRoute } from "./shared/components/ProtectedRoute"; 

// Contextos y Providers
import EcommerceState from "./shared/context/EcommerceState";
import { EcommerceContext } from "./shared/context/EcommerceContext"; 
import { AuthProvider } from "./shared/context/AuthContext";

/**
 * COMPONENTE DE RESETEO DE SCROLL
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = "unset";
    document.documentElement.style.overflow = "unset";
  }, [pathname]);
  return null;
};

const AppContent = () => {
  const context = useContext(EcommerceContext);
  const location = useLocation();

  if (!context) return null;

  const { isCartOpen, closeCart } = context as any;

  // Actualizamos para que las páginas de Auth no muestren Navbar/Footer
  const authRoutes = ["/login", "/register", "/reset-password", "/forgot-password"];
  const isAuthPage = authRoutes.includes(location.pathname);

  return (
    <div className="relative w-full min-h-screen flex flex-col bg-white">
      <ScrollToTop />

      <Toaster 
        position="bottom-right" 
        reverseOrder={false} 
        toastOptions={{
          style: {
            background: '#0A0A0A',
            color: '#fff',
            border: '1px solid rgba(236, 72, 153, 0.2)',
            fontSize: '12px',
            fontWeight: 'bold',
            borderRadius: '1rem'
          },
          success: {
            iconTheme: { primary: '#ec4899', secondary: '#fff' }
          }
        }}
      />

      {!isAuthPage && <Navbar />}

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={closeCart} 
      />

      <main className="flex-grow w-full">
        <Routes>
          <Route index element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/info/:id" element={<InfoProducts />} /> 
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* 🔑 RUTAS DE RECUPERACIÓN */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

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