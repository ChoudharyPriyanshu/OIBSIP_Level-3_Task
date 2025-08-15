// import axiosInstance from './axios';

// export const pizzaApi = {
//   getAllPizzas: async () => {
//     return await axiosInstance.get('/api/pizzas');
//   },

//   getPizzaById: async (id) => {
//     return await axiosInstance.get(`/api/pizzas/${id}`);
//   },

//   createPizza: async (pizzaData) => {
//     return await axiosInstance.post('/api/pizzas', pizzaData);
//   },

//   updatePizza: async (id, pizzaData) => {
//     return await axiosInstance.put(`/api/pizzas/${id}`, pizzaData);
//   },

//   deletePizza: async (id) => {
//     return await axiosInstance.delete(`/api/pizzas/${id}`);
//   },
// };

import axiosInstance from './axios';

const unwrap = (res) => {
  // 'res' is already { success, data } because of interceptor
  return res?.data ?? null;
};

export const pizzaApi = {
  getAllPizzas: async () => {
    return unwrap(await axiosInstance.get('/api/pizzas')) || [];
  },

  getPizzaById: async (id) => {
    return unwrap(await axiosInstance.get(`/api/pizzas/${id}`));
  },

  createPizza: async (pizzaData) => {
    return unwrap(await axiosInstance.post('/api/pizzas', pizzaData));
  },

  updatePizza: async (id, pizzaData) => {
    return unwrap(await axiosInstance.put(`/api/pizzas/${id}`, pizzaData));
  },

  deletePizza: async (id) => {
    await axiosInstance.delete(`/api/pizzas/${id}`);
    return id;
  },
};
