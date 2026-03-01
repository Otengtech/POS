import axiosInstance from './axiosConfig';

export const login = async (credentials) => {
  try {
    const response = await axiosInstance.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Login failed',
    };
  }
};

export const logout = async () => {
  try {
    await axiosInstance.post('/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  }
};

export const refreshToken = async () => {
  try {
    const response = await axiosInstance.post('/auth/refresh');
    return response.data.token;
  } catch (error) {
    throw new Error('Token refresh failed');
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
  } catch (error) {
    throw new Error('Failed to get current user');
  }
};