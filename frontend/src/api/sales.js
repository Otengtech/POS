import axios from './axios';

export const saleApi = {
  createSale: async (data) => {
    const response = await axios.post('/sales', data);
    return response.data;
  },

  listSales: async (params = {}) => {
    const response = await axios.get('/sales', { params });
    return response.data;
  },

  getSale: async (id) => {
    const response = await axios.get(`/sales/${id}`);
    return response.data;
  },

  getReceipt: async (id) => {
    const response = await axios.get(`/sales/${id}/receipt`);
    return response.data;
  },

  voidSale: async (id, reason) => {
    const response = await axios.patch(`/sales/${id}/void`, { reason });
    return response.data;
  },

  getDailySummary: async (date) => {
    const response = await axios.get('/sales/summary/daily', { params: { date } });
    return response.data;
  }
};