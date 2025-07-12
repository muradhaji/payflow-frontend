import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type {
  IInstallment,
  InstallmentCreate,
  InstallmentEdit,
  IPaymentUpdate,
} from '../../types/installment';
import api from '../../api';
import { AxiosError } from 'axios';

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
  togglePaymentStatus: {
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
  togglePaymentStatus: {
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

export const togglePaymentStatus = createAsyncThunk<
  { message: string; installments: IInstallment[] },
  IPaymentUpdate[],
  { rejectValue: string }
>(
  'installments/toggleMultiplePaymentStatuses',
  async (payments, { rejectWithValue }) => {
    try {
      const res = await api.post('api/installments/toggle', payments);
      return res.data;
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ message: string }>;
      return rejectWithValue(
        axiosErr.response?.data?.message || 'Server error'
      );
    }
  }
);

const installmentsSlice = createSlice({
  name: 'installments',
  initialState,
  reducers: {
    clearInstallments: (state) => {
      state.installments = [];
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
      // toggleMultiplePaymentStatuses
      .addCase(togglePaymentStatus.pending, (state) => {
        state.togglePaymentStatus.loading = true;
        state.togglePaymentStatus.error = null;
      })
      .addCase(togglePaymentStatus.fulfilled, (state) => {
        state.togglePaymentStatus.loading = false;
        state.togglePaymentStatus.error = null;
      })
      .addCase(togglePaymentStatus.rejected, (state, action) => {
        state.togglePaymentStatus.loading = false;
        state.togglePaymentStatus.error = action.payload as string;
      });
  },
});

export const {
  clearInstallments,
  clearSelectedInstallment,
  setSelectedInstallment,
} = installmentsSlice.actions;

export default installmentsSlice.reducer;
