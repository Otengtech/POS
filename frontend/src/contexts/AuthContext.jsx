import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as apiLogin, logout as apiLogout, refreshToken } from '../services/authService';
import { getStoredUser, setStoredUser, removeStoredUser, getStoredToken, setStoredToken, removeStoredToken } from '../utils/helpers';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Check for stored user data on mount
    const storedUser = getStoredUser();
    const storedToken = getStoredToken();
    
    if (storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // Set up token refresh interval
    if (token) {
      const interval = setInterval(async () => {
        try {
          const newToken = await refreshToken();
          setToken(newToken);
          setStoredToken(newToken);
        } catch (error) {
          console.error('Token refresh failed:', error);
          logout();
        }
      }, 14 * 60 * 1000); // Refresh every 14 minutes

      return () => clearInterval(interval);
    }
  }, [token]);

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await apiLogin(credentials);
      
      if (response.success) {
        const { user, token } = response.data;
        setUser(user);
        setToken(token);
        setStoredUser(user);
        setStoredToken(token);
        return { success: true };
      }
      return { success: false, error: response.error };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setToken(null);
      removeStoredUser();
      removeStoredToken();
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!user && !!token,
    userRole: user?.role,
    businessId: user?.businessId,
    branchId: user?.branchId,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};