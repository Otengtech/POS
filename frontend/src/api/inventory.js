import axios from './axios';

export const inventoryApi = {
  getStockLevels: async (params = {}) => {
    const response = await axios.get('/inventory/stock', { params });
    return response.data;
  },

  getLowStock: async () => {
    const response = await axios.get('/inventory/low-stock');
    return response.data;
  },

  adjustStock: async (data) => {
    const response = await axios.post('/inventory/adjust', data);
    return response.data;
  },

  getStockMovements: async (params = {}) => {
    const response = await axios.get('/inventory/movements', { params });
    return response.data;
  },

  transferStock: async (data) => {
    const response = await axios.post('/inventory/transfer', data);
    return response.data;
  },

  exportInventory: async () => {
    const response = await axios.get('/inventory/export', {
      responseType: 'blob'
    });
    return response;
  },

  getInventoryValuation: async () => {
    const response = await axios.get('/inventory/valuation');
    return response.data;
  }
};