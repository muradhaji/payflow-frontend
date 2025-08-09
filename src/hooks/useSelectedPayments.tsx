import { useState, useMemo, useCallback } from 'react';
import { sumByKeyDecimal } from '../utils/math';
import type {
  IInstallment,
  IMonthlyPayment,
  IPaymentUpdate,
} from '../types/installment';

interface UseSelectedPaymentsProps {
  installments: IInstallment[];
}

export const useSelectedPayments = ({
  installments,
}: UseSelectedPaymentsProps) => {
  const [selectedPayments, setSelectedPayments] = useState<IPaymentUpdate[]>(
    []
  );

  const allPayments = useMemo(
    () => installments.flatMap((i) => i.monthlyPayments),
    [installments]
  );

  const isSelected = useCallback(
    (paymentId: string) =>
      selectedPayments.some((p) => p.paymentId === paymentId),
    [selectedPayments]
  );

  const isAllSelected = useMemo(() => {
    if (allPayments.length === 0) return false;
    return allPayments.every((payment) =>
      selectedPayments.some(
        (selectedPayment) => selectedPayment.paymentId === payment._id
      )
    );
  }, [allPayments, selectedPayments]);

  const getUnselectedPayments = useCallback(
    (installmentId: string) => {
      const installment = installments.find((i) => i._id === installmentId);

      if (!installment) {
        return [];
      }

      const payments: IMonthlyPayment[] = installment.monthlyPayments;

      return payments
        .filter((p) => !selectedPayments.some((sel) => sel.paymentId === p._id))
        .map((p) => ({
          installmentId,
          paymentId: p._id,
          paymentAmount: p.amount,
        }));
    },
    [installments, selectedPayments]
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

  const toggleAll = useCallback(() => {
    setSelectedPayments((prev) => {
      if (isAllSelected) {
        return [];
      }

      const paymentsToAdd = installments.flatMap((installment) =>
        getUnselectedPayments(installment._id)
      );

      return [...prev, ...paymentsToAdd];
    });
  }, [installments, isAllSelected, getUnselectedPayments]);

  const togglePaymentsByInstallment = useCallback(
    (installmentId: string) => {
      setSelectedPayments((prev) => {
        const installment = installments.find((i) => i._id === installmentId);

        if (!installment) {
          return prev;
        }

        if (isAllSelected) {
          return prev.filter((p) => p.installmentId !== installmentId);
        }

        const paymentsToAdd = getUnselectedPayments(installmentId);

        return [...prev, ...paymentsToAdd];
      });
    },
    [installments, isAllSelected, getUnselectedPayments]
  );

  const clearAll = useCallback(() => {
    setSelectedPayments([]);
  }, []);

  return {
    selectedPayments,
    selectedPaymentsAmount,
    isSelected,
    isAllSelected,
    togglePayment,
    togglePaymentsByInstallment,
    toggleAll,
    clearAll,
  };
};
