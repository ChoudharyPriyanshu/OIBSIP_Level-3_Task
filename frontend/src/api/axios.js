import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Add token before every request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Adjust key if stored differently
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle API responses
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export default axiosInstance;
