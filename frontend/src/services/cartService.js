import api from './api.js';

export const cartService = {
  getCart: async () => {
    return api.get('/cart');
  },
  
  addToCart: async (productId, quantity = 1) => {
    return api.post('/cart', { productId, quantity });
  },
  
  removeFromCart: async (productId) => {
    return api.delete(`/cart/${productId}`);
  }
};
