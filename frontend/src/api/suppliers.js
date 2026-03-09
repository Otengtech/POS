import axios from './axios';

export const supplierApi = {
  createSupplier: async (data) => {
    const response = await axios.post('/suppliers', data);
    return response.data;
  },

  listSuppliers: async (params = {}) => {
    const response = await axios.get('/suppliers', { params });
    return response.data;
  },

  getSupplier: async (id) => {
    const response = await axios.get(`/suppliers/${id}`);
    return response.data;
  },

  updateSupplier: async (id, data) => {
    const response = await axios.put(`/suppliers/${id}`, data);
    return response.data;
  },

  deleteSupplier: async (id) => {
    const response = await axios.delete(`/suppliers/${id}`);
    return response.data;
  }
};