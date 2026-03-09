import axios from './axios';

export const businessApi = {
  createBusiness: async (data) => {
    const response = await axios.post('/businesses', data);
    return response.data;
  },

  listBusinesses: async (params = {}) => {
    const response = await axios.get('/businesses', { params });
    return response.data;
  },

  getBusiness: async (id) => {
    const response = await axios.get(`/businesses/${id}`);
    return response.data;
  },

  updateBusiness: async (id, data) => {
    const response = await axios.put(`/businesses/${id}`, data);
    return response.data;
  },

  deleteBusiness: async (id) => {
    const response = await axios.delete(`/businesses/${id}`);
    return response.data;
  },
};