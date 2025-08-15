// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { pizzaApi } from '../../api/pizzaApi';

// export const fetchPizzas = createAsyncThunk(
//   'pizzas/fetchPizzas',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await pizzaApi.getAllPizzas();
//       return response.pizzas || response;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// export const fetchPizzaById = createAsyncThunk(
//   'pizzas/fetchPizzaById',
//   async (id, { rejectWithValue }) => {
//     try {
//       const response = await pizzaApi.getPizzaById(id);
//       return response.pizza || response;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// export const createPizza = createAsyncThunk(
//   'pizzas/createPizza',
//   async (pizzaData, { rejectWithValue }) => {
//     try {
//       const response = await pizzaApi.createPizza(pizzaData);
//       return response.pizza || response;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// export const updatePizza = createAsyncThunk(
//   'pizzas/updatePizza',
//   async ({ id, pizzaData }, { rejectWithValue }) => {
//     try {
//       const response = await pizzaApi.updatePizza(id, pizzaData);
//       return response.pizza || response;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// export const deletePizza = createAsyncThunk(
//   'pizzas/deletePizza',
//   async (id, { rejectWithValue }) => {
//     try {
//       await pizzaApi.deletePizza(id);
//       return id;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// const pizzaSlice = createSlice({
//   name: 'pizzas',
//   initialState: {
//     list: [],
//     currentPizza: null,
//     categories: [],
//     isLoading: false,
//     error: null,
//     filters: {
//       category: '',
//       search: '',
//     },
//   },
//   reducers: {
//     setFilters: (state, action) => {
//       state.filters = { ...state.filters, ...action.payload };
//     },
//     clearCurrentPizza: (state) => {
//       state.currentPizza = null;
//     },
//     clearError: (state) => {
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Fetch Pizzas
//       .addCase(fetchPizzas.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(fetchPizzas.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.list = action.payload;
//       })
//       .addCase(fetchPizzas.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload;
//       })
//       // Fetch Pizza by ID
//       .addCase(fetchPizzaById.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(fetchPizzaById.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.currentPizza = action.payload;
//       })
//       .addCase(fetchPizzaById.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload;
//       })
//       // Create Pizza
//       .addCase(createPizza.fulfilled, (state, action) => {
//         state.list.push(action.payload);
//       })
//       // Update Pizza
//       .addCase(updatePizza.fulfilled, (state, action) => {
//         const index = state.list.findIndex(pizza => pizza._id === action.payload._id);
//         if (index !== -1) {
//           state.list[index] = action.payload;
//         }
//       })
//       // Delete Pizza
//       .addCase(deletePizza.fulfilled, (state, action) => {
//         state.list = state.list.filter(pizza => pizza._id !== action.payload);
//       });
//   },
// });

// export const { setFilters, clearCurrentPizza, clearError } = pizzaSlice.actions;
// export default pizzaSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { pizzaApi } from '../../api/pizzaApi';

// ✅ Get all pizzas
export const fetchPizzas = createAsyncThunk(
  'pizzas/fetchPizzas',
  async (_, { rejectWithValue }) => {
    try {
      // now pizzaApi.getAllPizzas() already returns an array
      return await pizzaApi.getAllPizzas();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPizzaById = createAsyncThunk(
  'pizzas/fetchPizzaById',
  async (id, { rejectWithValue }) => {
    try {
      // already returns a single pizza object
      return await pizzaApi.getPizzaById(id);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// createPizza and updatePizza already return the pizza object



// ✅ Create pizza
export const createPizza = createAsyncThunk(
  'pizzas/createPizza',
  async (pizzaData, { rejectWithValue }) => {
    try {
      const res = await pizzaApi.createPizza(pizzaData);
      return res?.data?.data || null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Update pizza
export const updatePizza = createAsyncThunk(
  'pizzas/updatePizza',
  async ({ id, pizzaData }, { rejectWithValue }) => {
    try {
      const res = await pizzaApi.updatePizza(id, pizzaData);
      return res?.data?.data || null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Delete pizza
export const deletePizza = createAsyncThunk(
  'pizzas/deletePizza',
  async (id, { rejectWithValue }) => {
    try {
      await pizzaApi.deletePizza(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const pizzaSlice = createSlice({
  name: 'pizzas',
  initialState: {
    list: [],
    currentPizza: null,
    categories: [],
    isLoading: false,
    error: null,
    filters: {
      category: '',
      search: '',
    },
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearCurrentPizza: (state) => {
      state.currentPizza = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPizzas.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPizzas.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchPizzas.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchPizzaById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPizzaById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPizza = action.payload;
      })
      .addCase(fetchPizzaById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createPizza.fulfilled, (state, action) => {
        if (action.payload) state.list.push(action.payload);
      })
      .addCase(updatePizza.fulfilled, (state, action) => {
        const index = state.list.findIndex(p => p._id === action.payload._id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(deletePizza.fulfilled, (state, action) => {
        state.list = state.list.filter(p => p._id !== action.payload);
      });
  },
});

export const { setFilters, clearCurrentPizza, clearError } = pizzaSlice.actions;
export default pizzaSlice.reducer;
