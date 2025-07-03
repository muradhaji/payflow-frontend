import Card from './Card';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../app/hooks';
import { Link } from 'react-router-dom';
import {
  CalendarCheck2,
  CircleDollarSign,
  Layers,
  Plus,
  Wallet,
} from 'lucide-react';
import dayjs from 'dayjs';

const DashboardCards = () => {
  const { installments } = useAppSelector((state) => state.installments);

  const { t } = useTranslation();

  const currentMonth = dayjs().month();
  const currentYear = dayjs().year();

  const currentMonthPayments: number[] = [];
  const totalPaid: number[] = [];
  const totalRemaining: number[] = [];

  installments.forEach((inst) => {
    inst.monthlyPayments.forEach((payment) => {
      const payDate = dayjs(payment.date);
      const isCurrentMonth =
        payDate.month() === currentMonth && payDate.year() === currentYear;

      if (!payment.paid) {
        totalRemaining.push(payment.amount);
        if (isCurrentMonth) {
          currentMonthPayments.push(payment.amount);
        }
      } else {
        totalPaid.push(payment.amount);
      }
    });
  });

  const sum = (arr: number[]) =>
    arr.reduce((total, amount) => total + amount, 0);

  return (
    <>
      <div className='flex justify-end items-center pb-6'>
        <Link
          to='/payments/add'
          className='bg-gray-600 text-white px-3 py-1 rounded-xl hover:bg-gray-500 transition flex gap-2'
        >
          <Plus />
          <span>{t('buttons.addpayment')}</span>
        </Link>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-2'>
        <Card
          title={t('dashboard.cards.current')}
          amount={sum(currentMonthPayments)}
          routeUrl='/dashboard/current'
          icon={<CalendarCheck2 className='text-red-600' />}
          color='border-red-500'
        />
        <Card
          title={t('dashboard.cards.remaining')}
          amount={sum(totalRemaining)}
          routeUrl='/dashboard/remaining'
          icon={<Wallet className='text-yellow-600' />}
          color='border-yellow-500'
        />
        <Card
          title={t('dashboard.cards.paid')}
          amount={sum(totalPaid)}
          routeUrl='/dashboard/paid'
          icon={<CircleDollarSign className='text-green-600' />}
          color='border-green-500'
        />
        <Card
          title={t('dashboard.cards.all')}
          amount={sum([...totalPaid, ...totalRemaining])}
          routeUrl='/dashboard/all'
          icon={<Layers className='text-gray-600' />}
          color='border-gray-500'
        />
      </div>
    </>
  );
};

export default DashboardCards;
