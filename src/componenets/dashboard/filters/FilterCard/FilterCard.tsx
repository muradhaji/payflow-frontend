import dayjs from 'dayjs';
import type {
  IInstallment,
  ISelectedPayment,
} from '../../../../types/installment';
import { Ellipsis } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { sumByKeyDecimal } from '../../../../utils/math';

const colorMap: Record<string, string> = {
  current: 'text-red-700',
  remaining: 'text-yellow-700',
  paid: 'text-green-700',
  default: 'text-gray-700',
};

interface PaymentCardProps extends IInstallment {
  togglePaymentSelect: (payment: ISelectedPayment) => void;
  selectedPayments: ISelectedPayment[];
  type: 'current' | 'remaining' | 'paid' | 'all';
}

const FilterCard = ({
  _id: installmentId,
  title,
  monthlyPayments,
  togglePaymentSelect,
  selectedPayments,
  type,
}: PaymentCardProps) => {
  const { t } = useTranslation();

  const paymentAmountColor = colorMap[type] || colorMap.default;

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <div className='w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-md p-6 space-y-4'>
      <div className='flex items-center justify-between'>
        <h2 className='text-xl font-semibold text-gray-800'>{title}</h2>
        <Link
          to={`/payment/${installmentId}`}
          className='px-2 rounded-md transition hover:bg-gray-50'
        >
          <Ellipsis />
        </Link>
      </div>

      {monthlyPayments.length > 1 && (
        <div className='flex items-center justify-between px-4 py-2 bg-blue-50 rounded-lg'>
          <span className='text-sm text-blue-800 font-medium'>
            {t('dashboard.filters.card.totalLabel')}
          </span>
          <span className={`text-lg ${paymentAmountColor} font-bold`}>
            ₼ {sumByKeyDecimal(monthlyPayments, 'amount')}
          </span>
        </div>
      )}

      <div className='space-y-3'>
        {monthlyPayments.map((payment) => (
          <label
            key={payment._id}
            className='flex items-center justify-between p-3 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition cursor-pointer'
          >
            <div className='flex items-center space-x-3'>
              {type != 'paid' && (
                <input
                  type='checkbox'
                  checked={selectedPayments.some(
                    (p) =>
                      p.installmentId === installmentId &&
                      p.paymentId === payment._id
                  )}
                  readOnly
                  className='form-checkbox h-5 w-5 accent-blue-600'
                  onClick={() => {
                    togglePaymentSelect({
                      installmentId,
                      paymentId: payment._id,
                      paymentAmount: payment.amount,
                    });
                  }}
                />
              )}
              <div>
                <p className='text-sm font-medium text-gray-800'>
                  {`${dayjs(payment.date).format('D')} ${capitalize(
                    dayjs(payment.date).format('MMM')
                  )}, ${dayjs(payment.date).format('YYYY')}`}
                </p>
                {payment.paid && payment.paidDate && (
                  <p className='text-xs text-green-600'>
                    {t('dashboard.filters.card.paidLabel', {
                      date: `${dayjs(payment.paidDate).format(
                        'D'
                      )} ${capitalize(
                        dayjs(payment.paidDate).format('MMM')
                      )}, ${dayjs(payment.paidDate).format('YYYY')}`,
                    })}
                  </p>
                )}
              </div>
            </div>
            <p className={`text-right font-semibold ${paymentAmountColor}`}>
              ₼ {payment.amount}
            </p>
          </label>
        ))}
      </div>
    </div>
  );
};

export default FilterCard;
