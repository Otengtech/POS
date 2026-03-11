import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import Loader from '../common/Loader';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const refreshToken = localStorage.getItem('refreshToken');
        const storedUser = localStorage.getItem('user');

        console.log('Initializing auth:', { token: !!token, refreshToken: !!refreshToken, user: !!storedUser });

        if (token && refreshToken && storedUser) {
          // First, set user from stored data immediately
          try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setIsAuthenticated(true);
            
            // Then try to get fresh data in the background
            authService.getCurrentUser()
              .then(freshUser => {
                if (freshUser) {
                  setUser(freshUser);
                  localStorage.setItem('user', JSON.stringify(freshUser));
                }
              })
              .catch(error => {
                console.log('Background refresh failed, using stored user data');
              });
              
          } catch (parseError) {
            console.error('Failed to parse stored user');
            // Try to get fresh data
            try {
              const userData = await authService.getCurrentUser();
              setUser(userData);
              setIsAuthenticated(true);
            } catch (error) {
              console.error('Auth initialization failed:', error);
              clearAuthData();
            }
          }
        } else {
          console.log('No tokens found, user not authenticated');
          clearAuthData();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        clearAuthData();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const clearAuthData = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    setUser(null);
    setIsAuthenticated(false);
  };

  const login = useCallback(async (email, password) => {
    try {
      const result = await authService.login({ email, password });
      
      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);
      }
      
      return result;
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuthData();
    }
  }, []);

  const hasRole = useCallback((roles) => {
    if (!user) return false;
    
    if (user.role === 'super_admin') return true;
    
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    
    return user.role === roles;
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#8FA5A0] to-[#AFC1B3] flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-[#AFC1B3] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading application...</p>
          </div>
        </div>
      </div>
    );
  }

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    hasRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};