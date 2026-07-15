import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('adminToken') || null);

  // Check if admin is authenticated on load
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const res = await api.get('/api/v1/auth/me');
          if (res.data.success) {
            setAdmin(res.data.admin);
          } else {
            handleLogout();
          }
        } catch (error) {
          console.error('Auth verification failed:', error);
          handleLogout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  const handleLogin = async (email, password) => {
    try {
      const res = await api.post('/api/v1/auth/login', { email, password });
      if (res.data.success) {
        localStorage.setItem('adminToken', res.data.token);
        setToken(res.data.token);
        setAdmin(res.data.admin);
        return { success: true };
      }
      return { success: false, error: 'Login failed' };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'An error occurred during login.'
      };
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, token, loading, login: handleLogin, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};
