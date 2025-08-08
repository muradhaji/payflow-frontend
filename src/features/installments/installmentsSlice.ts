import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import type {
  IInstallment,
  InstallmentCreate,
  InstallmentEdit,
  IPaymentUpdate,
} from '../../types/installment';

import api from '../../api';

interface InstallmentsState {
  installments: IInstallment[];
  selectedInstallment: IInstallment | null;
  fetchInstallments: {
    loading: boolean;
    error: string | null;
  };
  addInstallment: {
    loading: boolean;
    error: string | null;
  };
  getInstallmentById: {
    loading: boolean;
    error: string | null;
  };
  updateInstallment: {
    loading: boolean;
    error: string | null;
  };
  deleteInstallment: {
    loading: boolean;
    error: string | null;
  };
  completePayments: {
    loading: boolean;
    error: string | null;
  };
  cancelPayments: {
    loading: boolean;
    error: string | null;
  };
}

const initialState: InstallmentsState = {
  installments: [],
  selectedInstallment: null,
  fetchInstallments: {
    loading: false,
    error: null,
  },
  addInstallment: {
    loading: false,
    error: null,
  },
  getInstallmentById: {
    loading: false,
    error: null,
  },
  updateInstallment: {
    loading: false,
    error: null,
  },
  deleteInstallment: {
    loading: false,
    error: null,
  },
  completePayments: {
    loading: false,
    error: null,
  },
  cancelPayments: {
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

export const updateInstallment = createAsyncThunk<
  IInstallment,
  { id: string; newData: InstallmentEdit },
  { rejectValue: string }
>('installments/edit', async ({ id, newData }, { rejectWithValue }) => {
  try {
    const res = await api.put(`api/installments/${id}`, newData);
    return res.data;
  } catch (err: unknown) {
    const axiosErr = err as AxiosError<{ message: string }>;
    return rejectWithValue(axiosErr.response?.data?.message || 'Server error');
  }
});

export const getInstallmentById = createAsyncThunk<
  IInstallment,
  string,
  { rejectValue: string }
>('installments/getById', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`api/installments/${id}`);

    return res.data;
  } catch (err: unknown) {
    const axiosErr = err as AxiosError<{ message: string }>;
    return rejectWithValue(axiosErr.response?.data?.message || 'Server error');
  }
});

export const deleteInstallment = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('installments/delete', async (id, { rejectWithValue }) => {
  try {
    const res = await api.delete(`/api/installments/${id}`);
    return res.data.message;
  } catch (err: unknown) {
    const axiosErr = err as AxiosError<{ message: string }>;
    return rejectWithValue(axiosErr.response?.data?.message || 'Server error');
  }
});

export const completePayments = createAsyncThunk<
  { message: string; installments: IInstallment[] },
  IPaymentUpdate[],
  { rejectValue: string }
>('installments/completePayments', async (payments, { rejectWithValue }) => {
  try {
    const res = await api.post('api/installments/toggle', payments);
    return res.data;
  } catch (err: unknown) {
    const axiosErr = err as AxiosError<{ message: string }>;
    return rejectWithValue(axiosErr.response?.data?.message || 'Server error');
  }
});

export const cancelPayments = createAsyncThunk<
  { message: string; installments: IInstallment[] },
  IPaymentUpdate[],
  { rejectValue: string }
>('installments/cancelPayments', async (payments, { rejectWithValue }) => {
  try {
    const res = await api.post('api/installments/toggle', payments);
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
} = installmentsSlice.actions;

export default installmentsSlice.reducer;
