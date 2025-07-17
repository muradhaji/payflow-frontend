import type { IInstallment } from '../types/installment';
import { useMemo } from 'react';
import dayjs from 'dayjs';

export const useCurrentInstallments = (
  installments: IInstallment[],
  selectedMonth: string
) => {
  return useMemo(() => {
    return installments
      .map((installment) => {
        const filteredPayments = installment.monthlyPayments.filter(
          (p) => !p.paid && dayjs(p.date).isSame(dayjs(selectedMonth), 'month')
        );

        if (filteredPayments.length === 0) return null;

        return {
          ...installment,
          monthlyPayments: filteredPayments,
        };
      })
      .filter(Boolean) as IInstallment[];
  }, [installments, selectedMonth]);
};
