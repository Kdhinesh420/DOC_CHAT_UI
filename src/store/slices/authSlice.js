import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  loginUser,
  registerUser,
  verifyToken,
  saveSession,
  clearSession,
  getToken,
  getStoredUser,
} from '../../services/authService';

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await loginUser({ email, password });
      saveSession(data.token, data.user);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const data = await registerUser({ name, email, password });
      saveSession(data.token, data.user);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    const token = getToken();
    if (!token) return null;
    try {
      const data = await verifyToken(token);
      if (data && data.user) {
        return { token, user: data.user };
      }
      clearSession();
      return null;
    } catch (error) {
      clearSession();
      return rejectWithValue(error.message || 'Session expired');
    }
  }
);

const initialState = {
  user: getStoredUser(),
  token: getToken(),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      clearSession();
      state.user = null;
      state.token = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // CheckAuth
      .addCase(checkAuth.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload.user;
          state.token = action.payload.token;
        } else {
          state.user = null;
          state.token = null;
        }
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
