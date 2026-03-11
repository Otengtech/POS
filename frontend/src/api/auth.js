import api from './axios';

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  
  logout: () => api.post('/auth/logout'),
  
  refreshToken: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
  
  verifyToken: () => api.get('/auth/verify'),
  
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
  
  changePassword: (currentPassword, newPassword) => 
    api.post('/auth/change-password', { currentPassword, newPassword }),
};