import axiosInstance from './axios';

export const authApi = {
  register: async (userData) => {
    return await axiosInstance.post('/api/auth/register', userData);
  },

  login: async (credentials) => {
    return await axiosInstance.post('/api/auth/login', credentials);
  },

  verifyEmail: async (token) => {
  return await axiosInstance.get(`/api/auth/verify-email/${token}`);
},


  forgotPassword: async (email) => {
    return await axiosInstance.post('/api/auth/forgot-password', { email });
  },

  resetPassword: async (token, newPassword) => {
    return await axiosInstance.post(`/api/auth/reset-password/${token}`, { newPassword });
  },

  logout: async () => {
    return await axiosInstance.post('/api/auth/logout');
  },
};