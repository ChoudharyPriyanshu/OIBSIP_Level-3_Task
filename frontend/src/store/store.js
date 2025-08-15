import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import pizzaSlice from './slices/pizzaSlice';
import inventorySlice from './slices/inventorySlice';
import orderSlice from './slices/orderSlice';
import usersSlice from './slices/usersSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    pizzas: pizzaSlice,
    inventory: inventorySlice,
    orders: orderSlice,
    users: usersSlice,
  },
});

// If you need RootState or AppDispatch in plain JS, 
// you just use store.getState and store.dispatch directly without type definitions.
