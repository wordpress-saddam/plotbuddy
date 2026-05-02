import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  phone?: string;
  address?: string;
  bio?: string;
  favorites: string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  toggleFavorite: (plotId: string) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('plotbuddy_user');
    const storedToken = localStorage.getItem('plotbuddy_token');
    
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch (e) {
        console.error('Failed to parse user data from localStorage');
        logout();
      }
    }
  }, []);

  const login = (userData: User, jwtToken: string) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem('plotbuddy_user', JSON.stringify(userData));
    localStorage.setItem('plotbuddy_token', jwtToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('plotbuddy_user');
    localStorage.removeItem('plotbuddy_token');
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('plotbuddy_user', JSON.stringify(updatedUser));
    }
  };

  const toggleFavorite = (plotId: string) => {
    if (user) {
      const isFavorite = user.favorites.includes(plotId);
      const newFavorites = isFavorite 
        ? user.favorites.filter(id => id !== plotId)
        : [...user.favorites, plotId];
      
      updateUser({ favorites: newFavorites });
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser, toggleFavorite, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
