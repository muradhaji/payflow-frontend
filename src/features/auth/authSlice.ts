import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';
import { AxiosError } from 'axios';
import { ERROR_MESSAGES } from '../../constants/messages';
import type { AuthResponse, AuthCredentials } from '../../types/auth';
import { authInitialState } from '../../constants/auth';
import { API_ENDPOINTS, STORAGE_KEYS, THUNKS } from '../../constants/common';

export const login = createAsyncThunk<
  AuthResponse,
  AuthCredentials,
  { rejectValue: string }
>(
  THUNKS.AUTH.LOGIN,
  async (credentials: AuthCredentials, { rejectWithValue }) => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
      return response.data;
    } catch (error: unknown) {
      const axiosErr = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        axiosErr.response?.data?.message || ERROR_MESSAGES.UNKNOWN
      );
    }
  }
);

export const signup = createAsyncThunk<
  AuthResponse,
  AuthCredentials,
  { rejectValue: string }
>(
  THUNKS.AUTH.SIGNUP,
  async (credentials: AuthCredentials, { rejectWithValue }) => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.SIGNUP, credentials);
      return response.data;
    } catch (error: unknown) {
      const axiosErr = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        axiosErr.response?.data?.message || ERROR_MESSAGES.UNKNOWN
      );
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: authInitialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem(STORAGE_KEYS.USER);
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
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(action.payload));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.user = {
          _id: action.payload._id,
          username: action.payload.username,
        };
        state.token = action.payload.token;
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(action.payload));
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
