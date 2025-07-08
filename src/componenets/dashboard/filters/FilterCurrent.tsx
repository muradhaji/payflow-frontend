import type {
  IInstallment,
  ISelectedPayment,
} from '../../../types/installment';
import FilterCard from './FilterCard/FilterCard';
import MonthSelector from '../../common/MonthSelector/MonthSelector';
import { useAppSelector } from '../../../app/hooks';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, LineChart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { sumByKeyDecimal } from '../../../utils/math';
import dayjs from 'dayjs';

const FilterCurrent = () => {
  const { installments } = useAppSelector((state) => state.installments);
  const [currentInstallments, setCurrentInstallment] = useState<IInstallment[]>(
    []
  );
  const [selectedPayments, setSelectedPayments] = useState<ISelectedPayment[]>(
    []
  );
  const [selectedPaymentsAmount, setSelectedPaymentsAmount] =
    useState<number>(0);
  const [currentMonth, setCurrentMonth] = useState<number>(0);

  const { t } = useTranslation();

  useEffect(() => {
    setCurrentMonth(dayjs().month());
  }, []);

  useEffect(() => {
    const filteredInstallments: IInstallment[] = [];

    for (const installment of installments) {
      const { monthlyPayments, ...otherInstallmentData } = installment;

      const filteredMonthlyPayments = monthlyPayments.filter((payment) => {
        return !payment.paid && dayjs(payment.date).month() === currentMonth;
      });

      if (filteredMonthlyPayments.length) {
        filteredInstallments.push({
          ...otherInstallmentData,
          monthlyPayments: filteredMonthlyPayments,
        });
      }
    }
    setCurrentInstallment(filteredInstallments);
  }, [installments, currentMonth]);

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

  const handleMonthChange = (newMonth: number) => {
    setCurrentMonth(newMonth);
    setSelectedPayments([]);
  };

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <div className='flex flex-col gap-3'>
      <div className='flex justify-end items-center gap-1'>
        <Link
          to='/dashboard'
          className='bg-gray-600 text-white px-3 py-1 rounded-xl hover:bg-gray-500 transition flex gap-2'
        >
          <ArrowLeft />
        </Link>
        <span className='grow'></span>
        <MonthSelector
          selectedMonth={currentMonth}
          onChange={handleMonthChange}
        />
        <button
          className='bg-gray-600 text-white px-3 py-1 rounded-xl hover:bg-gray-500 transition flex gap-2'
          disabled={!(selectedPaymentsAmount > 0)}
        >
          {t('dashboard.filters.common.buttons.pay.label')}
          {selectedPaymentsAmount > 0 && ` ${selectedPaymentsAmount} ₼`}
        </button>
      </div>

      {currentInstallments.length ? (
        <>
          <div className='flex items-center justify-between md:justify-start gap-2 px-4 py-2 bg-white shadow-md rounded-lg'>
            <span className='text-xl text-gray-800 font-bold'>
              {t('dashboard.filters.current.totalLabel', {
                month: capitalize(dayjs().month(currentMonth).format('MMMM')),
              })}
            </span>
            <span className='text-lg text-red-600 font-bold'>
              ₼{' '}
              {sumByKeyDecimal(
                currentInstallments.flatMap((i) => i.monthlyPayments),
                'amount'
              )}
            </span>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 md:grid-cols-3'>
            {currentInstallments.map((installment) => (
              <FilterCard
                key={installment._id}
                {...installment}
                togglePaymentSelect={handlePaymentSelect}
                selectedPayments={selectedPayments}
                type='current'
              />
            ))}
          </div>
        </>
      ) : (
        <div className='grow flex flex-col items-center justify-center text-center col-span-full mt-8 text-gray-500'>
          <LineChart className='w-12 h-12 mb-2 text-gray-400' />
          <p className='text-lg font-semibold'>
            {t('dashboard.filters.current.empty.title')}
          </p>
          <p className='text-sm'>
            {t('dashboard.filters.current.empty.description')}
          </p>
        </div>
      )}
    </div>
  );
};

export default FilterCurrent;
