import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';

interface UserState {
  user: null | { _id: string; username: string };
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { username: string; password: string }, thunkAPI) => {
    try {
      const response = await api.post('/api/auth/login', credentials);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Login failed'
      );
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (credentials: { username: string; password: string }, thunkAPI) => {
    try {
      const response = await api.post('/api/auth/register', credentials);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Registration failed'
      );
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem('user');
    },
    loadUserFromStorage(state) {
      const stored = localStorage.getItem('user');
      if (stored) {
        const parsed = JSON.parse(stored);
        state.user = parsed.user;
        state.token = parsed.token;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = {
          _id: action.payload._id,
          username: action.payload.username,
        };
        state.token = action.payload.token;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(login.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = {
          _id: action.payload._id,
          username: action.payload.username,
        };
        state.token = action.payload.token;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(register.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, loadUserFromStorage } = authSlice.actions;
export default authSlice.reducer;
