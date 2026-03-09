import axios from './axios';

export const productApi = {
  createProduct: async (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key === 'images' && Array.isArray(data[key])) {
        data[key].forEach(image => formData.append('images', image));
      } else if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    
    const response = await axios.post('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  listProducts: async (params = {}) => {
    const response = await axios.get('/products', { params });
    return response.data;
  },

  getProduct: async (id) => {
    const response = await axios.get(`/products/${id}`);
    return response.data;
  },

  updateProduct: async (id, data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key === 'images' && Array.isArray(data[key])) {
        data[key].forEach(image => formData.append('images', image));
      } else if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    
    const response = await axios.put(`/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await axios.delete(`/products/${id}`);
    return response.data;
  },

  updateStock: async (id, quantity) => {
    const response = await axios.patch(`/products/${id}/stock`, { quantity });
    return response.data;
  }
};