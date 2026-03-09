import axiosInstance from '../services/axiosConfig';

export const authApi = {
  login: async (email, password) => {
    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      // Based on your backend, the response structure should be:
      // {
      //   success: true,
      //   token: "jwt_token_here",
      //   data: { user: {...} }
      // }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    try {
      const response = await axiosInstance.post('/auth/logout');
      return response.data;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  getProfile: async () => {
    try {
      const response = await axiosInstance.get('/auth/profile');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateProfile: async (data) => {
    try {
      const response = await axiosInstance.put('/auth/profile', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  changePassword: async (data) => {
    try {
      const response = await axiosInstance.put('/auth/change-password', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};