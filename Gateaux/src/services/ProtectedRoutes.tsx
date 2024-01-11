import React, { useContext, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../pages/auth/AuthContext';

interface ProtectedRouteProps {
  role: string;
  children: ReactNode; // Ajouter les enfants dans les props
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ role, children }) => {
  const authContext = useContext(AuthContext);

  if (!authContext?.user || authContext.user.role !== role) {
    // Si l'utilisateur n'est pas authentifié ou n'a pas le rôle requis,
    // rediriger vers la page de connexion ou la page d'accueil
    return <Navigate to="/" />;
  }

  return <>{children}</>; // Rendre les composants enfants
};

export default ProtectedRoute;
