import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../../api/authApi';
import { userApi } from '../../api/userApi';


const safeParse = (key) => {
  try {
    const value = localStorage.getItem(key);
    if (value && value !== 'undefined') {
      return JSON.parse(value);
    }
    return null; // ✅ always return null, never undefined
  } catch {
    return null; // ✅ still null if parsing fails
  }
};


export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authApi.register(userData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);
      localStorage.setItem('user', JSON.stringify(response.user));
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async (token, { rejectWithValue }) => {
    try {
      const response = await authApi.verifyEmail(token); // already the data object
      return response; // ✅ no .data here
    } catch (error) {
      return rejectWithValue(error.message); // error.message is already clean
    }
  }
);



export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      const response = await authApi.forgotPassword(email);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, newPassword }, { rejectWithValue }) => {
    try {
      const response = await authApi.resetPassword(token, newPassword);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userApi.getProfile();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await userApi.updateProfile(profileData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: safeParse('user'), // ✅ no crash if invalid JSON
    token: localStorage.getItem('token') || null,
    isLoading: false,
    error: null,
    isVerified: false,
    verificationMessage: '',
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isVerified = false;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
    clearError: (state) => {
      state.error = null;
    },
    setVerificationStatus: (state, action) => {
      state.isVerified = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Verify Email
      .addCase(verifyEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isVerified = true;
        state.verificationMessage = action.payload.message;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Profile
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      // Update Profile
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload.user;
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      });
  },
});

export const { logout, clearError, setVerificationStatus } = authSlice.actions;
export default authSlice.reducer;