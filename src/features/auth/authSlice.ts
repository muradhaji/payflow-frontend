import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';
import { AxiosError } from 'axios';
import { ERROR_MESSAGES } from '../../constants/messages';
import type {
  AuthResponse,
  AuthCredentials,
  DeleteCredentials,
  DeleteResponse,
} from '../../types/auth';
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

export const deleteMe = createAsyncThunk<
  DeleteResponse,
  DeleteCredentials,
  { rejectValue: string }
>(THUNKS.AUTH.DELETE_ME, async (credentials, { rejectWithValue }) => {
  try {
    const response = await api.delete(API_ENDPOINTS.AUTH.DELETE_ME, {
      data: credentials,
    });
    return response.data;
  } catch (error: unknown) {
    const axiosErr = error as AxiosError<{ message: string }>;
    return rejectWithValue(
      axiosErr.response?.data?.message || ERROR_MESSAGES.UNKNOWN
    );
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: authInitialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem(STORAGE_KEYS.USER);
    },
    openDeleteModal(state) {
      state.delete.modalOpened = true;
    },
    closeDeleteModal(state) {
      state.delete.modalOpened = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
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
      // signup
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
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
      })
      // deleteMe
      .addCase(deleteMe.pending, (state) => {
        state.delete.loading = true;
        state.delete.error = null;
      })
      .addCase(deleteMe.fulfilled, (state) => {
        state.delete.loading = false;
        state.delete.error = null;
      })
      .addCase(deleteMe.rejected, (state, action) => {
        state.delete.loading = false;
        state.delete.error = action.payload as string;
      });
  },
});

export const { logout, openDeleteModal, closeDeleteModal } = authSlice.actions;
export default authSlice.reducer;
