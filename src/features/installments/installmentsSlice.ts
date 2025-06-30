import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { IInstallment } from '../../types/installment';
import api from '../../api';

interface InstallmentsState {
  installments: IInstallment[];
  fetchInstallments: {
    loading: boolean;
    error: string | null;
  };
  deleteInstallment: {
    loading: boolean;
    error: string | null;
  };
  togglePayment: {
    loading: boolean;
    id: string | null;
    error: string | null;
  };
}

const initialState: InstallmentsState = {
  installments: [],
  fetchInstallments: {
    loading: false,
    error: null,
  },
  deleteInstallment: {
    loading: false,
    error: null,
  },
  togglePayment: {
    loading: false,
    id: null,
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
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || 'Failed to fetch installments'
    );
  }
});

export const addInstallment = createAsyncThunk<
  IInstallment,
  Omit<IInstallment, '_id' | 'user' | 'createdAt' | 'updatedAt'>,
  { rejectValue: string }
>('installments/add', async (newInstallment, { rejectWithValue }) => {
  try {
    const res = await api.post('api/installments', newInstallment);
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Server error');
  }
});

export const deleteInstallment = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('installments/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/installments/${id}`);
    return id;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Server error');
  }
});

export const togglePayment = createAsyncThunk(
  'installments/togglePayment',
  async (
    { installmentId, paymentId }: { installmentId: string; paymentId: string },
    thunkAPI
  ) => {
    try {
      const res = await api.put(
        `/api/installments/${installmentId}/pay/${paymentId}`
      );
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response.data.message || 'Toggle failed'
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
  },
  extraReducers: (builder) => {
    builder
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
      .addCase(deleteInstallment.pending, (state) => {
        state.deleteInstallment.loading = true;
        state.deleteInstallment.error = null;
      })
      .addCase(deleteInstallment.fulfilled, (state, action) => {
        state.deleteInstallment.loading = false;
        state.installments = state.installments.filter(
          (inst) => inst._id !== action.payload
        );
      })
      .addCase(deleteInstallment.rejected, (state, action) => {
        state.deleteInstallment.loading = false;
        state.deleteInstallment.error = action.payload as string;
      })
      .addCase(togglePayment.pending, (state, action) => {
        state.togglePayment.loading = true;
        state.togglePayment.id = action.meta.arg.paymentId;
      })
      .addCase(togglePayment.fulfilled, (state, action) => {
        state.togglePayment.loading = false;
        state.togglePayment.id = null;

        const iIndex = state.installments.findIndex(
          (i) => i._id === action.meta.arg.installmentId
        );
        const pIndex = state.installments[iIndex].monthlyPayments.findIndex(
          (p) => p._id === action.meta.arg.paymentId
        );

        state.installments[iIndex].monthlyPayments[pIndex] =
          action.payload.payment;
      })
      .addCase(togglePayment.rejected, (state, action) => {
        state.togglePayment.loading = false;
        state.togglePayment.id = null;
        state.togglePayment.error = action.payload as string;
      });
  },
});

export const { clearInstallments } = installmentsSlice.actions;

export default installmentsSlice.reducer;
