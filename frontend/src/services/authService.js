import axiosInstance from '../api/axios';

export const authService = {
  login: async (credentials) => {
    try {
      const response = await axiosInstance.post('/auth/login', credentials);
      
      const { token, refreshToken, user } = response.data;
      
      if (token) localStorage.setItem('token', token);
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('userRole', user.role);
      }
      
      return {
        success: true,
        user,
        token,
        refreshToken
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed'
      };
    }
  },

  // Simplified getCurrentUser that doesn't throw unnecessarily
  getCurrentUser: async () => {
    try {
      const response = await axiosInstance.get('/auth/profile');
      
      // Handle different response structures
      const userData = response.data.user || response.data.data?.user || response.data;
      
      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('userRole', userData.role);
        return userData;
      }
      
      return null;
    } catch (error) {
      console.log('Could not fetch fresh user data:', error.message);
      // Return null instead of throwing
      return null;
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
    }
  },

  // Helper to check if user is authenticated from storage
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    const user = localStorage.getItem('user');
    return !!(token && refreshToken && user);
  },

  // Get stored user without API call
  getStoredUser: () => {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }
};