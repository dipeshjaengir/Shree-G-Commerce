import api from './api.js';

export const wishlistService = {
  getWishlist: async () => {
    return api.get('/wishlist');
  },
  
  addToWishlist: async (productId) => {
    return api.post('/wishlist', { productId });
  },
  
  removeFromWishlist: async (productId) => {
    return api.delete(`/wishlist/${productId}`);
  }
};
