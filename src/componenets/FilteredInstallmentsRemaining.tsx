import type { IInstallment, ISelectedPayment } from '../types/installment';
import FilteredInstallmentCard from './FilteredIntallmentCard';
import { useAppSelector } from '../app/hooks';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Wallet } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { sumByKeyDecimal } from '../utils/math';

const FilteredInstallmentsRemaining = () => {
  const { installments } = useAppSelector((state) => state.installments);
  const [remainingInstallments, setRemainingInstallments] = useState<
    IInstallment[]
  >([]);
  const [selectedPayments, setSelectedPayments] = useState<ISelectedPayment[]>(
    []
  );
  const [selectedPaymentsAmount, setSelectedPaymentsAmount] =
    useState<number>(0);

  const { t } = useTranslation();

  useEffect(() => {
    const filteredInstallments: IInstallment[] = [];

    for (const installment of installments) {
      const { monthlyPayments, ...otherInstallmentData } = installment;

      const filteredMonthlyPayments = monthlyPayments.filter(
        (payment) => !payment.paid
      );

      if (filteredMonthlyPayments.length) {
        filteredInstallments.push({
          ...otherInstallmentData,
          monthlyPayments: filteredMonthlyPayments,
        });
      }
    }

    setRemainingInstallments(filteredInstallments);
  }, [installments]);

  useEffect(() => {
    setSelectedPaymentsAmount(
      sumByKeyDecimal(selectedPayments, 'paymentAmount')
    );
  }, [selectedPayments]);

  const handlePaymentSelect = (payment: ISelectedPayment) => {
    const exists = selectedPayments.some(
      (p) =>
        p.installmentId === payment.installmentId &&
        p.paymentId === payment.paymentId
    );

    if (exists) {
      setSelectedPayments(
        selectedPayments.filter(
          (p) =>
            !(
              p.installmentId === payment.installmentId &&
              p.paymentId === payment.paymentId
            )
        )
      );
    } else {
      setSelectedPayments([...selectedPayments, payment]);
    }
  };

  return (
    <div className='flex flex-col gap-3'>
      <div className='flex justify-end items-center gap-1 pb-6'>
        <Link
          to='/dashboard'
          className='bg-gray-600 text-white px-3 py-1 rounded-xl hover:bg-gray-500 transition flex gap-2'
        >
          <ArrowLeft />
        </Link>
        <span className='grow'></span>
        <button
          className='bg-gray-600 text-white px-3 py-1 rounded-xl hover:bg-gray-500 transition flex gap-2'
          disabled={!(selectedPaymentsAmount > 0)}
        >
          {selectedPaymentsAmount > 0
            ? `${t(
                'filteredInstallments.remaining.buttons.pay.selected'
              )} ${selectedPaymentsAmount} ₼`
            : t('filteredInstallments.remaining.buttons.pay.notselected')}
        </button>
      </div>
      {remainingInstallments.length ? (
        <>
          <div className='flex items-center justify-between md:justify-start gap-2 px-4 py-2 bg-white shadow-md rounded-lg'>
            <span className='text-xl text-gray-800 font-bold'>
              {t('filteredInstallments.remaining.total')}
            </span>
            <span className='text-lg text-yellow-600 font-bold'>
              ₼{' '}
              {sumByKeyDecimal(
                remainingInstallments.flatMap((i) => i.monthlyPayments),
                'amount'
              )}
            </span>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 md:grid-cols-3'>
            {remainingInstallments.map((installment) => (
              <FilteredInstallmentCard
                key={installment._id}
                {...installment}
                togglePaymentSelect={handlePaymentSelect}
                selectedPayments={selectedPayments}
                type='remaining'
              />
            ))}
          </div>
        </>
      ) : (
        <div className='flex flex-col items-center justify-center text-center col-span-full mt-8 text-gray-500'>
          <Wallet className='w-12 h-12 mb-2 text-gray-400' />
          <p className='text-lg font-semibold'>
            {t('filteredInstallments.remaining.empty.textLg')}
          </p>
          <p className='text-sm'>{t('filteredInstallments.remaining.empty.textSm')}</p>
        </div>
      )}
    </div>
  );
};

export default FilteredInstallmentsRemaining;
