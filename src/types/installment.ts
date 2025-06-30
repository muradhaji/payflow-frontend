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
  startMonth: number;
  monthlyPayments: IMonthlyPayment[];
  createdAt: string;
  updatedAt: string;
}
