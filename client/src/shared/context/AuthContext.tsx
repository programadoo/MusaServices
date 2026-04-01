import { createContext, useState, useEffect, ReactNode, useCallback } from "react";

// Interfaz unificada para evitar errores de TypeScript entre id y _id
interface User {
  id: string;
  _id?: string; // Compatible con lo que devuelve MongoDB
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
  loading: boolean; // Añadido para evitar parpadeos en rutas protegidas
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Logout memorizado para evitar bucles en useEffects
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }, []);

  // Reconstrucción de sesión al cargar
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");
    
    if (savedUser && savedToken) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setToken(savedToken);
      } catch (error) {
        console.error("Error al restaurar sesión:", error);
        logout();
      }
    }
    setLoading(false);
  }, [logout]);

  const login = (userData: User, token: string) => {
    // Aseguramos que si viene _id de Mongo, se guarde también como id
    const formattedUser = { ...userData, id: userData.id || userData._id || "" };
    setUser(formattedUser);
    setToken(token);
    localStorage.setItem("user", JSON.stringify(formattedUser));
    localStorage.setItem("token", token);
  };

  // Actualización de créditos optimizada
  const updateCredits = (newCredits: number) => {
    setUser(prevUser => {
      if (!prevUser) return null;
      const updated = { ...prevUser, credits: newCredits };
      localStorage.setItem("user", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token, 
        login, 
        logout, 
        isAuthenticated: !!token && !!user,
        updateCredits,
        loading
      }}
    >
      {!loading && children} 
    </AuthContext.Provider>
  );
};