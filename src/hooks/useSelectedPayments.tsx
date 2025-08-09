import { useState, useMemo, useCallback } from 'react';

import { sumByKeyDecimal } from '../utils/math';

import type { IMonthlyPayment, IPaymentUpdate } from '../types/installment';

export const useSelectedPayments = () => {
  const [selectedPayments, setSelectedPayments] = useState<IPaymentUpdate[]>(
    []
  );

  const selectedPaymentsAmount = useMemo(() => {
    return sumByKeyDecimal(selectedPayments, 'paymentAmount');
  }, [selectedPayments]);

  const togglePayment = useCallback((payment: IPaymentUpdate) => {
    setSelectedPayments((prev) =>
      prev.some((p) => p.paymentId === payment.paymentId)
        ? prev.filter((p) => p.paymentId !== payment.paymentId)
        : [...prev, payment]
    );
  }, []);

  const selectAll = useCallback((payments: IPaymentUpdate[]) => {
    setSelectedPayments(payments);
  }, []);

  const resetAll = useCallback(() => {
    setSelectedPayments([]);
  }, []);

  const togglePaymentsByInstallment = useCallback(
    (installmentId: string, payments: IMonthlyPayment[]) => {
      setSelectedPayments((prev) => {
        const allSelected = payments.every((payment) =>
          prev.some((p) => p.paymentId === payment._id)
        );

        if (allSelected) {
          return prev.filter((p) => p.installmentId !== installmentId);
        } else {
          const paymentsToAdd = payments
            .filter((p) => !prev.some((sel) => sel.paymentId === p._id))
            .map((p) => ({
              installmentId,
              paymentId: p._id,
              paymentAmount: p.amount,
            }));
          return [...prev, ...paymentsToAdd];
        }
      });
    },
    []
  );

  const isSelected = useCallback(
    (paymentId: string) => {
      return selectedPayments.some((p) => p.paymentId === paymentId);
    },
    [selectedPayments]
  );

  return {
    selectedPayments,
    selectedPaymentsAmount,
    togglePayment,
    selectAll,
    resetAll,
    togglePaymentsByInstallment,
    isSelected,
  };
};
