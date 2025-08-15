// import axiosInstance from './axios';

// const orderApi = {
//   // Create a custom order
//   createCustomOrder: async (orderData) => {
//     const res = await axiosInstance.post('/api/orders/custom', orderData);
//     return res.data; // Only returning backend data
//   },

//   // Verify payment after Razorpay checkout
//   verifyPayment: async (paymentData) => {
//     const res = await axiosInstance.post('/api/orders/verify', paymentData);
//     return res.data;
//   },

//   // Fetch orders for logged-in user
//   getMyOrders: async () => {
//     const res = await axiosInstance.get('/api/orders/my');
//     return res.data; // Expecting { orders: [...] }
//   },

//   // Fetch all orders (Admin)
//   getAllOrders: async () => {
//     const res = await axiosInstance.get('/api/orders');
//     return res.data;
//   },

//   // Update order status (Admin)
//   updateOrderStatus: async (orderId, status) => {
//     const res = await axiosInstance.patch(`/api/orders/${orderId}/status`, { status });
//     return res.data;
//   },

//   // Fetch specific order by ID
//   getOrderById: async (orderId) => {
//     const res = await axiosInstance.get(`/api/orders/${orderId}`);
//     return res.data;
//   },
// };

// export default orderApi;
import axiosInstance from './axios';

export const orderApi = {
  createCustomOrder: async (orderData) => {
    return await axiosInstance.post('/api/orders/custom', orderData);
  },

  verifyPayment: async (paymentData) => {
    return await axiosInstance.post('/api/orders/verify', paymentData);
  },

  getMyOrders: async () => {
    return await axiosInstance.get('/api/orders/my');
  },

  getAllOrders: async () => {
    return await axiosInstance.get('/api/orders');
  },

  updateOrderStatus: async (orderId, status) => {
    return await axiosInstance.patch(`/api/orders/${orderId}/status`, { status });
  },

  getOrderById: async (orderId) => {
    return await axiosInstance.get(`/api/orders/${orderId}`);
  },
};