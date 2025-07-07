import type { IInstallment } from '../types/installment';
import FilteredInstallmentCard from './FilteredIntallmentCard';
import { useAppSelector } from '../app/hooks';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Banknote } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { sumByKeyDecimal } from '../utils/math';

const FilteredInstallmentsPaid = () => {
  const { installments } = useAppSelector((state) => state.installments);
  const [paidInstallments, setPaidInstallment] = useState<IInstallment[]>([]);

  const { t } = useTranslation();

  useEffect(() => {
    const filteredInstallments: IInstallment[] = [];

    for (const installment of installments) {
      const { monthlyPayments, ...otherInstallmentData } = installment;

      const filteredMonthlyPayments = monthlyPayments.filter(
        (payment) => payment.paid
      );

      if (filteredMonthlyPayments.length) {
        filteredInstallments.push({
          ...otherInstallmentData,
          monthlyPayments: filteredMonthlyPayments,
        });
      }
    }

    setPaidInstallment(filteredInstallments);
  }, [installments]);

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
      </div>
      {paidInstallments.length ? (
        <>
          <div className='flex items-center justify-between md:justify-start gap-2 px-4 py-2 bg-white shadow-md rounded-lg'>
            <span className='text-xl text-gray-800 font-bold'>
              {t('filteredInstallments.paid.total')}
            </span>
            <span className='text-lg text-green-600 font-bold'>
              ₼{' '}
              {sumByKeyDecimal(
                paidInstallments.flatMap((i) => i.monthlyPayments),
                'amount'
              )}
            </span>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 md:grid-cols-3'>
            {paidInstallments.map((installment) => (
              <FilteredInstallmentCard
                key={installment._id}
                {...installment}
                togglePaymentSelect={() => {}}
                selectedPayments={[]}
                type='paid'
              />
            ))}
          </div>
        </>
      ) : (
        <div className='flex flex-col items-center justify-center text-center col-span-full mt-8 text-gray-500'>
          <Banknote className='w-12 h-12 mb-2 text-gray-400' />
          <p className='text-lg font-semibold'>
            {t('filteredInstallments.paid.empty.textLg')}
          </p>
          <p className='text-sm'>{t('filteredInstallments.paid.empty.textSm')}</p>
        </div>
      )}
    </div>
  );
};

export default FilteredInstallmentsPaid;
