import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { IInstallment, InstallmentCreate } from '../../types/installment';
import api from '../../api';
import type { AxiosError } from 'axios';

interface InstallmentsState {
  installments: IInstallment[];
  fetchInstallments: {
    loading: boolean;
    error: string | null;
  };
  addInstallment: {
    loading: boolean;
    error: string | null;
  };
}

const initialState: InstallmentsState = {
  installments: [],
  fetchInstallments: {
    loading: false,
    error: null,
  },
  addInstallment: {
    loading: false,
    error: null,
  },
};

export const fetchInstallments = createAsyncThunk<
  IInstallment[],
  void,
  { rejectValue: string }
>('installments/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/api/installments');
    return res.data;
  } catch (err: unknown) {
    const axiosErr = err as AxiosError<{ message: string }>;
    return rejectWithValue(
      axiosErr.response?.data?.message || 'Failed to fetch installments'
    );
  }
});

export const addInstallment = createAsyncThunk<
  IInstallment,
  InstallmentCreate,
  { rejectValue: string }
>('installments/add', async (newInstallment, { rejectWithValue }) => {
  try {
    const res = await api.post('api/installments', newInstallment);
    return res.data;
  } catch (err: unknown) {
    const axiosErr = err as AxiosError<{ message: string }>;
    return rejectWithValue(axiosErr.response?.data?.message || 'Server error');
  }
});

const installmentsSlice = createSlice({
  name: 'installments',
  initialState,
  reducers: {
    clearInstallments: (state) => {
      state.installments = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchInstallment
      .addCase(fetchInstallments.pending, (state) => {
        state.fetchInstallments.loading = true;
        state.fetchInstallments.error = null;
      })
      .addCase(fetchInstallments.fulfilled, (state, action) => {
        state.fetchInstallments.loading = false;
        state.installments = action.payload;
      })
      .addCase(fetchInstallments.rejected, (state, action) => {
        state.fetchInstallments.loading = false;
        state.fetchInstallments.error = action.payload as string;
      })
      // addInstallment
      .addCase(addInstallment.pending, (state) => {
        state.addInstallment.loading = true;
        state.addInstallment.error = null;
      })
      .addCase(addInstallment.fulfilled, (state) => {
        state.addInstallment.loading = false;
      })
      .addCase(addInstallment.rejected, (state, action) => {
        state.addInstallment.loading = false;
        state.addInstallment.error = action.payload as string;
      });
  },
});

export const { clearInstallments } = installmentsSlice.actions;

export default installmentsSlice.reducer;
