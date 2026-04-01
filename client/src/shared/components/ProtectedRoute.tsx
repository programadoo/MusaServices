import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const auth = useContext(AuthContext);
  const location = useLocation();

  // Si no está autenticado, lo redirigimos al login
  if (!auth?.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si está logueado, renderizamos el componente hijo (Musa AI)
  return children;
};