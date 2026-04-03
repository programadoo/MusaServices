import { createContext, useState, useEffect, ReactNode, useCallback, useMemo } from "react";

// Interfaz unificada para compatibilidad total con MongoDB/Frontend
interface User {
  id: string;
  _id?: string; 
  name: string;
  email: string;
  credits: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  updateCredits: (newCredits: number) => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Logout memorizado para estabilidad en el árbol de componentes
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    // Opcional: Redirigir a /login aquí si usas un router externo
  }, []);

  // Reconstrucción de sesión silenciosa
  useEffect(() => {
    const restoreSession = () => {
      const savedUser = localStorage.getItem("user");
      const savedToken = localStorage.getItem("token");
      
      if (savedUser && savedToken) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          setToken(savedToken);
        } catch (error) {
          console.error("🚨 [AUTH_RESTORE_ERROR]: Fallo al parsear sesión persistente.");
          logout();
        }
      }
      setLoading(false);
    };

    restoreSession();
  }, [logout]);

  // Login con formateo automático de IDs
  const login = useCallback((userData: User, token: string) => {
    const formattedUser = { 
      ...userData, 
      id: userData.id || userData._id || "" 
    };
    
    setUser(formattedUser);
    setToken(token);
    
    localStorage.setItem("user", JSON.stringify(formattedUser));
    localStorage.setItem("token", token);
  }, []);

  // Actualización atómica de créditos
  const updateCredits = useCallback((newCredits: number) => {
    setUser(prevUser => {
      if (!prevUser) return null;
      const updated = { ...prevUser, credits: newCredits };
      
      // Sincronizamos con localStorage para que F5 no borre el saldo
      localStorage.setItem("user", JSON.stringify(updated));
      return updated;
    });
  }, []);

  // ⚡ OPTIMIZACIÓN CRÍTICA: useMemo
  // Evita re-renders innecesarios en toda la aplicación si los datos no han cambiado
  const contextValue = useMemo(() => ({
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token && !!user,
    updateCredits,
    loading
  }), [user, token, loading, login, logout, updateCredits]);

  return (
    <AuthContext.Provider value={contextValue}>
      {/* Evitamos el parpadeo de "No autorizado" mientras cargamos el localStorage */}
      {!loading ? children : (
        <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </AuthContext.Provider>
  );
};