import axiosInstance from './axios';

export const inventoryApi = {
  getAllInventory: async () => {
    return await axiosInstance.get('/api/inventory');
  },

  getByCategory: async (category) => {
    return await axiosInstance.get(`/api/inventory/category/${category}`);
  },

  createInventoryItem: async (itemData) => {
    return await axiosInstance.post('/api/inventory', itemData);
  },

  updateInventoryItem: async (id, itemData) => {
    return await axiosInstance.put(`/api/inventory/${id}`, itemData);
  },

  deleteInventoryItem: async (id) => {
    return await axiosInstance.delete(`/api/inventory/${id}`);
  },
};