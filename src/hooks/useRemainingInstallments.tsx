import type { IInstallment } from '../types/installment';
import { useMemo } from 'react';

export const useRemainingInstallments = (installments: IInstallment[]) => {
  return useMemo(() => {
    return installments
      .map((installment) => {
        const filteredPayments = installment.monthlyPayments.filter(
          (p) => !p.paid
        );

        if (filteredPayments.length === 0) return null;

        return {
          ...installment,
          monthlyPayments: filteredPayments,
        };
      })
      .filter(Boolean) as IInstallment[];
  }, [installments]);
};
