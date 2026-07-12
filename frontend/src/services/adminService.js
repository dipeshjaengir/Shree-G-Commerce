import api from './api.js';

export const adminService = {
  // 1. PRODUCTS CRUD
  createProduct: async (productData) => {
    return api.post('/products', productData);
  },
  updateProduct: async (id, productData) => {
    return api.put(`/products/${id}`, productData);
  },
  deleteProduct: async (id) => {
    return api.delete(`/products/${id}`);
  },
  restoreProduct: async (id) => {
    return api.patch(`/products/${id}/restore`); // Future restore route
  },

  // 2. CATEGORIES CRUD
  createCategory: async (categoryData) => {
    return api.post('/products/categories', categoryData);
  },
  updateCategory: async (id, categoryData) => {
    return api.put(`/products/categories/${id}`, categoryData);
  },
  deleteCategory: async (id) => {
    return api.delete(`/products/categories/${id}`);
  },

  // 3. ADMIN ORDERS CONSOLE
  getAllOrders: async (page = 1, limit = 10) => {
    return api.get(`/orders?isAdmin=true&page=${page}&limit=${limit}`);
  },
  updateOrderStatus: async (orderId, orderStatus, remarks) => {
    return api.patch(`/orders/${orderId}/status`, { orderStatus, remarks }); // Future admin status check
  },

  // 4. CUSTOMER LOGS
  getAllCustomers: async () => {
    return api.get('/auth/customers'); // Future admin get customers
  },
  toggleCustomerStatus: async (userId, action) => {
    return api.patch(`/auth/customers/${userId}/${action}`); // block / unblock
  },

  // 5. SETTINGS
  getSystemSettings: async () => {
    return api.get('/settings'); // Future admin settings route
  },
  updateSystemSettings: async (settingsData) => {
    return api.put('/settings', settingsData);
  },

  // 6. AUDIT LOGS
  getAuditLogs: async () => {
    return api.get('/admin/audit-logs'); // Future admin activity log route
  }
};
