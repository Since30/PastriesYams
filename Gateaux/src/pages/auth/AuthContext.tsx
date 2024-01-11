import React, { createContext, useState, useEffect, useCallback } from 'react';

type User = {
  name: string;
  role: string; // Ajoutez la propriété 'role' ici
};

export const AuthContext = createContext<{
  user: User | null;
  login: (name: string) => void;
  logout: () => void;
} | undefined>(undefined);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback((name: string) => {
    const loggedInUser: User = { name, role: 'admin'|| 'user' };
    setUser(loggedInUser);
  }, []);

  const logout = () => {
    setUser(null);
  };

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const name = localStorage.getItem('name');
      if (token && name !== null) { 
       
        login(name);
      }
    };

    checkAuth();
  }, [login]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };