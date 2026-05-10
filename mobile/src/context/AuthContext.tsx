import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';

interface User {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  role?: 'user' | 'administrator';
  favorites: string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (userData: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const storedUser = await SecureStore.getItemAsync('plotbuddy_user');
        const storedToken = await SecureStore.getItemAsync('plotbuddy_token');
        
        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
        }
      } catch (e) {
        console.error('Failed to load auth data', e);
      } finally {
        setLoading(false);
      }
    };

    loadStoredAuth();
  }, []);

  const login = async (userData: User, jwtToken: string) => {
    setUser(userData);
    setToken(jwtToken);
    await SecureStore.setItemAsync('plotbuddy_user', JSON.stringify(userData));
    await SecureStore.setItemAsync('plotbuddy_token', jwtToken);
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    await SecureStore.deleteItemAsync('plotbuddy_user');
    await SecureStore.deleteItemAsync('plotbuddy_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!user, loading }}>
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
