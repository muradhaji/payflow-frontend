import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import type {
  IInstallment,
  InstallmentCreate,
  InstallmentEdit,
  IPaymentUpdate,
} from '../../types/installment';

import api from '../../api';
import { API_ENDPOINTS, THUNKS } from '../../constants/common';
import { ERROR_MESSAGES } from '../../constants/messages';
import { installmentInitialState } from '../../constants/installment';

export const fetchInstallments = createAsyncThunk<
  IInstallment[],
  void,
  { rejectValue: string }
>(THUNKS.INSTALLMENTS.FETCH_ALL, async (_, { rejectWithValue }) => {
  try {
    const res = await api.get(API_ENDPOINTS.INSTALLMENTS.ROOT);
    return res.data;
  } catch (err: unknown) {
    const axiosErr = err as AxiosError<{ message: string }>;
    return rejectWithValue(
      axiosErr.response?.data?.message || ERROR_MESSAGES.UNKNOWN
    );
  }
});

export const addInstallment = createAsyncThunk<
  IInstallment,
  InstallmentCreate,
  { rejectValue: string }
>(THUNKS.INSTALLMENTS.ADD, async (newInstallment, { rejectWithValue }) => {
  try {
    const res = await api.post(API_ENDPOINTS.INSTALLMENTS.ROOT, newInstallment);
    return res.data;
  } catch (err: unknown) {
    const axiosErr = err as AxiosError<{ message: string }>;
    return rejectWithValue(
      axiosErr.response?.data?.message || ERROR_MESSAGES.UNKNOWN
    );
  }
});

export const updateInstallment = createAsyncThunk<
  IInstallment,
  { id: string; newData: InstallmentEdit },
  { rejectValue: string }
>(THUNKS.INSTALLMENTS.UPDATE, async ({ id, newData }, { rejectWithValue }) => {
  try {
    const res = await api.put(
      `${API_ENDPOINTS.INSTALLMENTS.ROOT}/${id}`,
      newData
    );
    return res.data;
  } catch (err: unknown) {
    const axiosErr = err as AxiosError<{ message: string }>;
    return rejectWithValue(
      axiosErr.response?.data?.message || ERROR_MESSAGES.UNKNOWN
    );
  }
});

export const getInstallmentById = createAsyncThunk<
  IInstallment,
  string,
  { rejectValue: string }
>(THUNKS.INSTALLMENTS.GET_BY_ID, async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`${API_ENDPOINTS.INSTALLMENTS.ROOT}/${id}`);

    return res.data;
  } catch (err: unknown) {
    const axiosErr = err as AxiosError<{ message: string }>;
    return rejectWithValue(
      axiosErr.response?.data?.message || ERROR_MESSAGES.UNKNOWN
    );
  }
});

export const deleteInstallment = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(THUNKS.INSTALLMENTS.DELETE, async (id, { rejectWithValue }) => {
  try {
    const res = await api.delete(`${API_ENDPOINTS.INSTALLMENTS.ROOT}/${id}`);
    return res.data.message;
  } catch (err: unknown) {
    const axiosErr = err as AxiosError<{ message: string }>;
    return rejectWithValue(
      axiosErr.response?.data?.message || ERROR_MESSAGES.UNKNOWN
    );
  }
});

export const completePayments = createAsyncThunk<
  IInstallment[],
  IPaymentUpdate[],
  { rejectValue: string }
>(
  THUNKS.INSTALLMENTS.COMPLETE_PAYMENTS,
  async (payments, { rejectWithValue }) => {
    try {
      const res = await api.post(API_ENDPOINTS.INSTALLMENTS.TOGGLE, payments);
      return res.data;
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ message: string }>;
      return rejectWithValue(
        axiosErr.response?.data?.message || ERROR_MESSAGES.UNKNOWN
      );
    }
  }
);

export const cancelPayments = createAsyncThunk<
  IInstallment[],
  IPaymentUpdate[],
  { rejectValue: string }
>(
  THUNKS.INSTALLMENTS.CANCEL_PAYMENTS,
  async (payments, { rejectWithValue }) => {
    try {
      const res = await api.post(API_ENDPOINTS.INSTALLMENTS.TOGGLE, payments);
      return res.data;
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ message: string }>;
      return rejectWithValue(
        axiosErr.response?.data?.message || ERROR_MESSAGES.UNKNOWN
      );
    }
  }
);

const installmentSlice = createSlice({
  name: 'installments',
  initialState: installmentInitialState,
  reducers: {
    clearInstallments: (state) => {
      state.installments = [];
    },
    updateInstallments: (state, action) => {
      const updatedInstallments: IInstallment[] = action.payload;
      state.installments = state.installments.map((item) => {
        const updated = updatedInstallments.find((u) => u._id === item._id);
        return updated ? updated : item;
      });
    },
    clearSelectedInstallment: (state) => {
      state.selectedInstallment = null;
    },
    setSelectedInstallment: (state, action) => {
      state.selectedInstallment = action.payload;
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
      })
      // getInstallmentById
      .addCase(getInstallmentById.pending, (state) => {
        state.getInstallmentById.loading = true;
        state.getInstallmentById.error = null;
      })
      .addCase(getInstallmentById.fulfilled, (state, action) => {
        state.getInstallmentById.loading = false;
        state.getInstallmentById.error = null;
        state.selectedInstallment = action.payload;
      })
      .addCase(getInstallmentById.rejected, (state, action) => {
        state.getInstallmentById.loading = false;
        state.getInstallmentById.error = action.payload as string;
      })
      // updateInstallment
      .addCase(updateInstallment.pending, (state) => {
        state.updateInstallment.loading = true;
        state.updateInstallment.error = null;
      })
      .addCase(updateInstallment.fulfilled, (state) => {
        state.updateInstallment.loading = false;
        state.updateInstallment.error = null;
      })
      .addCase(updateInstallment.rejected, (state, action) => {
        state.updateInstallment.loading = false;
        state.updateInstallment.error = action.payload as string;
      })
      // deleteInstallment
      .addCase(deleteInstallment.pending, (state) => {
        state.deleteInstallment.loading = true;
        state.deleteInstallment.error = null;
      })
      .addCase(deleteInstallment.fulfilled, (state) => {
        state.deleteInstallment.loading = false;
        state.deleteInstallment.error = null;
      })
      .addCase(deleteInstallment.rejected, (state, action) => {
        state.deleteInstallment.loading = false;
        state.deleteInstallment.error = action.payload as string;
      })
      // completePayments
      .addCase(completePayments.pending, (state) => {
        state.completePayments.loading = true;
        state.completePayments.error = null;
      })
      .addCase(completePayments.fulfilled, (state) => {
        state.completePayments.loading = false;
        state.completePayments.error = null;
      })
      .addCase(completePayments.rejected, (state, action) => {
        state.completePayments.loading = false;
        state.completePayments.error = action.payload as string;
      })
      // cancelPayments
      .addCase(cancelPayments.pending, (state) => {
        state.cancelPayments.loading = true;
        state.cancelPayments.error = null;
      })
      .addCase(cancelPayments.fulfilled, (state) => {
        state.cancelPayments.loading = false;
        state.cancelPayments.error = null;
      })
      .addCase(cancelPayments.rejected, (state, action) => {
        state.cancelPayments.loading = false;
        state.cancelPayments.error = action.payload as string;
      });
  },
});

export const {
  clearInstallments,
  updateInstallments,
  clearSelectedInstallment,
  setSelectedInstallment,
} = installmentSlice.actions;

export default installmentSlice.reducer;
