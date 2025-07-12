export interface IMonthlyPayment {
  _id: string;
  date: string;
  amount: number;
  paid: boolean;
  paidDate: string | null;
}

export type MonthlyPaymentCreate = Omit<
  IMonthlyPayment,
  '_id' | 'paid' | 'paidDate'
>;

export type MonthlyPaymentEdit = Omit<IMonthlyPayment, '_id' | 'paidDate'>;

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

export type InstallmentCreate = Omit<
  IInstallment,
  '_id' | 'user' | 'createdAt' | 'updatedAt' | 'monthlyPayments'
> & {
  monthlyPayments: MonthlyPaymentCreate[];
};

export type InstallmentEdit = Omit<
  IInstallment,
  '_id' | 'user' | 'createdAt' | 'updatedAt' | 'monthlyPayments'
> & {
  monthlyPayments: MonthlyPaymentEdit[];
};

export interface IPaymentUpdate {
  installmentId: string;
  paymentId: string;
  paymentAmount: number;
}
