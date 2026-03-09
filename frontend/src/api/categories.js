import axios from './axios';

export const categoryApi = {
  createCategory: async (data) => {
    const response = await axios.post('/categories', data);
    return response.data;
  },

  listCategories: async (params = {}) => {
    const response = await axios.get('/categories', { params });
    return response.data;
  },

  getCategory: async (id) => {
    const response = await axios.get(`/categories/${id}`);
    return response.data;
  },

  updateCategory: async (id, data) => {
    const response = await axios.put(`/categories/${id}`, data);
    return response.data;
  },

  deleteCategory: async (id) => {
    const response = await axios.delete(`/categories/${id}`);
    return response.data;
  }
};