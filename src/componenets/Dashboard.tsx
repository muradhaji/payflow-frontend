import { useEffect } from 'react';
import Header from './Header';
import LogOutButton from './LogOutButton';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchInstallments } from '../features/installments/installmentsSlice';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import Card from './Card';
import {
  CalendarCheck2,
  CircleDollarSign,
  Layers,
  Plus,
  Wallet,
} from 'lucide-react';
import Footer from './Footer';
import FullPageSpinner from './FullPageSpinner';
import { useTranslation } from 'react-i18next';

function Dashboard() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const {
    installments,
    fetchInstallments: { loading },
  } = useAppSelector((state) => state.installments);

  useEffect(() => {
    dispatch(fetchInstallments());
  }, [dispatch]);

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

  return loading ? (
    <FullPageSpinner />
  ) : (
    <div className='min-h-[100dvh] flex flex-col bg-gray-200'>
      <Header rightElement={<LogOutButton />} />
      <div className='flex-1 px-3 py-6'>
        <div className='container mx-auto'>
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
              routeUrl='/payments/current'
              icon={<CalendarCheck2 className='text-blue-600' />}
              color='border-blue-500'
            />
            <Card
              title={t('dashboard.cards.remaining')}
              amount={sum(totalRemaining)}
              routeUrl='/payments/remaining'
              icon={<Wallet className='text-red-600' />}
              color='border-red-500'
            />
            <Card
              title={t('dashboard.cards.paid')}
              amount={sum(totalPaid)}
              routeUrl='/payments/paid'
              icon={<CircleDollarSign className='text-green-600' />}
              color='border-green-500'
            />
            <Card
              title={t('dashboard.cards.all')}
              amount={sum([...totalPaid, ...totalRemaining])}
              routeUrl='/payments/all'
              icon={<Layers className='text-gray-600' />}
              color='border-gray-500'
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Dashboard;
