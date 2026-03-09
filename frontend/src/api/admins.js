import axios from './axios';

export const adminApi = {
  createSuperAdmin: async (data) => {
    const response = await axios.post('/admins/super-admin', data);
    return response.data;
  },

  createAdmin: async (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        if (key === 'profileImage' && data[key] instanceof File) {
          formData.append(key, data[key]);
        } else {
          formData.append(key, data[key]);
        }
      }
    });
    
    const response = await axios.post('/admins/create-admin', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  listAdmins: async (params = {}) => {
    const response = await axios.get('/admins', { params });
    return response.data;
  },

  getAdmin: async (id) => {
    const response = await axios.get(`/admins/${id}`);
    return response.data;
  },

  updateAdmin: async (id, data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        if (key === 'profileImage' && data[key] instanceof File) {
          formData.append(key, data[key]);
        } else {
          formData.append(key, data[key]);
        }
      }
    });
    
    const response = await axios.put(`/admins/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  deactivateAdmin: async (id) => {
    const response = await axios.patch(`/admins/${id}/deactivate`);
    return response.data;
  },

  deleteAdmin: async (id) => {
    const response = await axios.delete(`/admins/${id}`);
    return response.data;
  },
};