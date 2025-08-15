// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import orderApi from '../../api/orderApi';

// // Create Custom Order
// export const createCustomOrder = createAsyncThunk(
//   'orders/createCustom',
//   async (orderData, { rejectWithValue }) => {
//     try {
//       const response = await orderApi.createCustomOrder(orderData);
//       return response; // orderApi now returns data directly
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || error.message);
//     }
//   }
// );

// // Verify Payment
// export const verifyPayment = createAsyncThunk(
//   'orders/verifyPayment',
//   async (paymentData, { rejectWithValue }) => {
//     try {
//       const response = await orderApi.verifyPayment(paymentData);
//       return response.data; // backend data only
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || error.message);
//     }
//   }
// );

// // Fetch My Orders
// export const fetchMyOrders = createAsyncThunk(
//   'orders/fetchMyOrders',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await orderApi.getMyOrders();
//       return response.data.orders || response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || error.message);
//     }
//   }
// );

// // Fetch All Orders
// export const fetchAllOrders = createAsyncThunk(
//   'orders/fetchAllOrders',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await orderApi.getAllOrders();
//       return response.data.orders || response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || error.message);
//     }
//   }
// );

// // Update Order Status
// export const updateOrderStatus = createAsyncThunk(
//   'orders/updateStatus',
//   async ({ orderId, status }, { rejectWithValue }) => {
//     try {
//       const response = await orderApi.updateOrderStatus(orderId, status);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || error.message);
//     }
//   }
// );

// const orderSlice = createSlice({
//   name: 'orders',
//   initialState: {
//     myOrders: [],
//     allOrders: [],
//     currentOrder: null,
//     isLoading: false,
//     error: null,
//     razorpayOrder: null,
//   },
//   reducers: {
//     clearError: (state) => {
//       state.error = null;
//     },
//     setCurrentOrder: (state, action) => {
//       state.currentOrder = action.payload;
//     },
//     clearCurrentOrder: (state) => {
//       state.currentOrder = null;
//       state.razorpayOrder = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Create Custom Order
//       .addCase(createCustomOrder.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(createCustomOrder.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.error = null;
//         const { razorpayOrder, orderData, order } = action.payload || {};
//         state.razorpayOrder = razorpayOrder || null;
//         state.currentOrder = order || orderData || null;
//       })
//       .addCase(createCustomOrder.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload;
//       })
//       // Verify Payment
//       .addCase(verifyPayment.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(verifyPayment.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.error = null;
//         if (action.payload && action.payload.order) {
//           state.currentOrder = action.payload.order;
//           state.razorpayOrder = null;
//         }
//       })
//       .addCase(verifyPayment.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload;
//       })
//       // Fetch My Orders
//       .addCase(fetchMyOrders.fulfilled, (state, action) => {
//         state.myOrders = action.payload;
//       })
//       // Fetch All Orders
//       .addCase(fetchAllOrders.fulfilled, (state, action) => {
//         state.allOrders = action.payload;
//       })
//       // Update Order Status
//       .addCase(updateOrderStatus.fulfilled, (state, action) => {
//         const { orderId, status } = action.payload;
//         const orderIndex = state.allOrders.findIndex(order => order._id === orderId);
//         if (orderIndex !== -1) {
//           state.allOrders[orderIndex].status = status;
//         }
//       });
//   },
// });

// export const { clearError, setCurrentOrder, clearCurrentOrder } = orderSlice.actions;
// export default orderSlice.reducer;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderApi } from '../../api/orderApi';

export const createCustomOrder = createAsyncThunk(
  'orders/createCustom',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await orderApi.createCustomOrder(orderData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const verifyPayment = createAsyncThunk(
  'orders/verifyPayment',
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await orderApi.verifyPayment(paymentData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchMyOrders = createAsyncThunk(
  'orders/fetchMyOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await orderApi.getMyOrders();
      return response.orders || response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllOrders = createAsyncThunk(
  'orders/fetchAllOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await orderApi.getAllOrders();
      return response.orders || response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const response = await orderApi.updateOrderStatus(orderId, status);
      return { orderId, status };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    myOrders: [],
    allOrders: [],
    currentOrder: null,
    isLoading: false,
    error: null,
    razorpayOrder: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
      state.razorpayOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Custom Order
      .addCase(createCustomOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCustomOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.razorpayOrder = action.payload.razorpayOrder;
        state.currentOrder = action.payload.orderData;
      })
      .addCase(createCustomOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Verify Payment
      .addCase(verifyPayment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload.order;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch My Orders
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.myOrders = action.payload;
      })
      // Fetch All Orders
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.allOrders = action.payload;
      })
      // Update Order Status
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const { orderId, status } = action.payload;
        const orderIndex = state.allOrders.findIndex(order => order._id === orderId);
        if (orderIndex !== -1) {
          state.allOrders[orderIndex].status = status;
        }
      });
  },
});

export const { clearError, setCurrentOrder, clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;