import axiosInstance from './axios';

export const userApi = {
  getProfile: async () => {
    return await axiosInstance.get('/api/users/profile');
  },

  updateProfile: async (profileData) => {
    return await axiosInstance.put('/api/users/profile', profileData);
  },

  getAllUsers: async () => {
    return await axiosInstance.get('/api/users');
  },

  deleteUser: async (userId) => {
    return await axiosInstance.delete(`/api/users/${userId}`);
  },
};