import type {
  IDefaultAsyncState,
  IInstallmentSliceState,
} from '../types/installment';

export const defaultAsyncState: IDefaultAsyncState = {
  loading: false,
  error: null,
};

export const installmentInitialState: IInstallmentSliceState = {
  installments: [],
  selectedInstallment: null,
  fetchInstallments: defaultAsyncState,
  addInstallment: defaultAsyncState,
  getInstallmentById: defaultAsyncState,
  updateInstallment: defaultAsyncState,
  deleteInstallment: defaultAsyncState,
  completePayments: defaultAsyncState,
  cancelPayments: defaultAsyncState,
};
