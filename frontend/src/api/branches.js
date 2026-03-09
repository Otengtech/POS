import axios from './axios';

export const branchApi = {
  createBranch: async (data) => {
    const response = await axios.post('/branches', data);
    return response.data;
  },

  listBranches: async (params = {}) => {
    const response = await axios.get('/branches', { params });
    return response.data;
  },

  getBranch: async (id) => {
    const response = await axios.get(`/branches/${id}`);
    return response.data;
  },

  updateBranch: async (id, data) => {
    const response = await axios.put(`/branches/${id}`, data);
    return response.data;
  },

  deleteBranch: async (id) => {
    const response = await axios.delete(`/branches/${id}`);
    return response.data;
  },
};