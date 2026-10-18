'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext({
  user: null,
  isLoading: true,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const storedUser = localStorage.getItem('lumiere_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      }
    } catch (error) {
      console.error('Failed to parse stored user:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('lumiere_user', JSON.stringify(userData));
      } catch (error) {
        console.error('Failed to save user session:', error);
      }
    }
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('lumiere_user');
      } catch (error) {
        console.error('Failed to clear user session:', error);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
