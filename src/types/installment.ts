export interface IMonthlyPayment {
  _id: string;
  date: string;
  amount: number;
  paid: boolean;
  paidDate: string | null;
}

export interface IInstallment {
  _id: string;
  user: string;
  title: string;
  amount: number;
  monthCount: number;
  startDate: string;
  monthlyPayments: IMonthlyPayment[];
  createdAt: string;
  updatedAt: string;
}

export interface IPaymentUpdate {
  installmentId: string;
  paymentId: string;
  paymentAmount: number;
}

export interface IDefaultAsyncState {
  loading: boolean;
  error: string | null;
}

export interface IInstallmentSliceState {
  installments: IInstallment[];
  selectedInstallment: IInstallment | null;

  fetchInstallments: IDefaultAsyncState;
  addInstallment: IDefaultAsyncState;
  getInstallmentById: IDefaultAsyncState;
  updateInstallment: IDefaultAsyncState;
  deleteInstallment: IDefaultAsyncState;
  completePayments: IDefaultAsyncState;
  cancelPayments: IDefaultAsyncState;
}

export type MonthlyPaymentSchema = Pick<IMonthlyPayment, 'date' | 'amount'> & {
  paid?: boolean;
};

export type InstallmentSchema = Pick<
  IInstallment,
  'title' | 'amount' | 'monthCount' | 'startDate'
> & {
  monthlyPayments: MonthlyPaymentSchema[];
};
