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

export interface ISelectedPayment {
  installmentId: string;
  paymentId: string;
  paymentAmount: number;
}
