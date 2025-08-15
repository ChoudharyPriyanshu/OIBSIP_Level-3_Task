import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userApi } from '../../api/userApi';

export const fetchAllUsers = createAsyncThunk(
  'users/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userApi.getAllUsers();
      return response.users || response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/delete',
  async (userId, { rejectWithValue }) => {
    try {
      await userApi.deleteUser(userId);
      return userId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    list: [],
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
      // Fetch All Users
      .addCase(fetchAllUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete User
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.list = state.list.filter(user => user._id !== action.payload);
      });
  },
});

export const { clearError } = usersSlice.actions;
export default usersSlice.reducer;