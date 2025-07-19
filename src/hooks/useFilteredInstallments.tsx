import type { IInstallment, IMonthlyPayment } from '../types/installment';
import { useMemo } from 'react';

type PaymentFilterFn = (payment: IMonthlyPayment) => boolean;

export const useFilteredInstallments = (
  installments: IInstallment[],
  filterFn: PaymentFilterFn
): IInstallment[] => {
  return useMemo(() => {
    return installments
      .map((installment) => {
        const filteredPayments = installment.monthlyPayments.filter(filterFn);

        if (filteredPayments.length === 0) return null;

        return {
          ...installment,
          monthlyPayments: filteredPayments,
        };
      })
      .filter(Boolean) as IInstallment[];
  }, [installments, filterFn]);
};
