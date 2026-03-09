import axios from './axios';

export const reportApi = {
  getSalesReport: async (params) => {
    const response = await axios.get('/reports/sales', { params });
    return response.data;
  },

  getInventoryReport: async (params) => {
    const response = await axios.get('/reports/inventory', { params });
    return response.data;
  },

  getProfitReport: async (params) => {
    const response = await axios.get('/reports/profit', { params });
    return response.data;
  },

  getStockReport: async (params) => {
    const response = await axios.get('/reports/stock', { params });
    return response.data;
  },

  exportReport: async (type, format, params) => {
    const response = await axios.get(`/reports/export/${type}/${format}`, { 
      params,
      responseType: 'blob' 
    });
    return response.data;
  }
};