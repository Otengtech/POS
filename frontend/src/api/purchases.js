import axios from './axios';

export const purchaseApi = {
  createPurchase: async (data) => {
    const response = await axios.post('/purchases', data);
    return response.data;
  },

  listPurchases: async (params = {}) => {
    const response = await axios.get('/purchases', { params });
    return response.data;
  },

  getPurchase: async (id) => {
    const response = await axios.get(`/purchases/${id}`);
    return response.data;
  },

  updatePurchase: async (id, data) => {
    const response = await axios.put(`/purchases/${id}`, data);
    return response.data;
  },

  deletePurchase: async (id) => {
    const response = await axios.delete(`/purchases/${id}`);
    return response.data;
  },

  receivePurchase: async (id, data) => {
    const response = await axios.post(`/purchases/${id}/receive`, data);
    return response.data;
  }
};