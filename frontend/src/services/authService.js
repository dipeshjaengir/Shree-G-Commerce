import api from './api.js';

export const authService = {
  signup: async (userData) => {
    return api.post('/auth/signup', userData);
  },

  login: async (credentials) => {
    return api.post('/auth/login', credentials);
  },

  logout: async () => {
    return api.post('/auth/logout');
  },

  getProfile: async () => {
    return api.get('/auth/profile');
  },

  updateProfile: async (profileData) => {
    return api.put('/auth/profile', profileData);
  },

  addAddress: async (addressData) => {
    return api.post('/auth/addresses', addressData);
  },

  deleteAddress: async (addressId) => {
    return api.delete(`/auth/addresses/${addressId}`);
  }
};
