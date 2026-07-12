import api from './api.js';

export const orderService = {
  createOrder: async (addressId, paymentMethod = 'COD') => {
    return api.post('/orders', { addressId, paymentMethod });
  },
  
  getMyOrders: async (page = 1, limit = 10) => {
    return api.get(`/orders?page=${page}&limit=${limit}`);
  },
  
  getOrderDetails: async (orderId) => {
    return api.get(`/orders/${orderId}`);
  },
  
  cancelOrder: async (orderId) => {
    return api.patch(`/orders/${orderId}/cancel`);
  }
};
