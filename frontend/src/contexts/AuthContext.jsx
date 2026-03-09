import React, { createContext, useState, useContext, useEffect } from 'react';
import { authApi } from '../api/auth';
import toast from 'react-hot-toast';

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
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const loadUser = async () => {
    try {
      const response = await authApi.getProfile();
      // Based on your backend structure, the response might be:
      // { success: true, data: { user: {...} } }
      if (response.success && response.data?.user) {
        setUser(response.data.user);
      } else if (response.data?.user) {
        setUser(response.data.user);
      } else if (response.user) {
        setUser(response.user);
      }
    } catch (error) {
      console.error('Failed to load user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authApi.login(email, password);
      
      // Handle different possible response structures
      let token = null;
      let userData = null;

      if (response.token) {
        token = response.token;
        userData = response.data?.user || response.user;
      } else if (response.data?.token) {
        token = response.data.token;
        userData = response.data.user;
      } else if (response.success && response.data) {
        token = response.data.token;
        userData = response.data.user;
      }

      if (token && userData) {
        localStorage.setItem('token', token);
        setToken(token);
        setUser(userData);
        toast.success('Login successful!');
        return { success: true, user: userData };
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      toast.success('Logged out successfully');
      window.location.href = '/login';
    }
  };

  const hasRole = (roles) => {
    if (!user) return false;
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    return user.role === roles;
  };

  const value = {
    user,
    loading,
    login,
    logout,
    hasRole,
    isAuthenticated: !!user,
    isSuperAdmin: user?.role === 'super_admin',
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};