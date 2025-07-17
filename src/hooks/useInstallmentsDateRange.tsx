import type { IInstallment } from '../types/installment';
import { useMemo } from 'react';
import dayjs from 'dayjs';

export const useInstallmenstsDateRange = (
  installments: IInstallment[]
): [Date | null, Date | null] => {
  return useMemo(() => {
    const allDates = installments.flatMap((i) =>
      i.monthlyPayments.map((p) => dayjs(p.date))
    );

    if (allDates.length === 0) return [null, null];

    const sorted = allDates.sort((a, b) => a.valueOf() - b.valueOf());

    return [
      sorted[0].startOf('month').toDate(),
      sorted[sorted.length - 1].startOf('month').toDate(),
    ];
  }, [installments]);
};
