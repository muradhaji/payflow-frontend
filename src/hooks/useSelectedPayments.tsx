import type { IPaymentUpdate } from '../types/installment';
import { useState, useMemo, useCallback } from 'react';
import { sumByKeyDecimal } from '../utils/math';

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
    isSelected,
  };
};
