import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { inventoryApi } from '../../api/inventoryApi';

export const fetchInventory = createAsyncThunk(
  'inventory/fetchInventory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await inventoryApi.getAllInventory();
      return response.inventory || response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchByCategory = createAsyncThunk(
  'inventory/fetchByCategory',
  async (category, { rejectWithValue }) => {
    try {
      const response = await inventoryApi.getByCategory(category);
      return { category, items: response.inventory || response };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createInventoryItem = createAsyncThunk(
  'inventory/createItem',
  async (itemData, { rejectWithValue }) => {
    try {
      const response = await inventoryApi.createInventoryItem(itemData);
      return response.item || response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateInventoryItem = createAsyncThunk(
  'inventory/updateItem',
  async ({ id, itemData }, { rejectWithValue }) => {
    try {
      const response = await inventoryApi.updateInventoryItem(id, itemData);
      return response.item || response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const inventorySlice = createSlice({
  name: 'inventory',
  initialState: {
    items: [],
    categoryItems: {
      base: [],
      sauce: [],
      cheese: [],
      veggie: [],
      meat: [],
    },
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Inventory
      .addCase(fetchInventory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch by Category
      .addCase(fetchByCategory.fulfilled, (state, action) => {
        const { category, items } = action.payload;
        state.categoryItems[category] = items;
      })
      // Create Item
      .addCase(createInventoryItem.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Update Item
      .addCase(updateInventoryItem.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

export const { clearError } = inventorySlice.actions;
export default inventorySlice.reducer;