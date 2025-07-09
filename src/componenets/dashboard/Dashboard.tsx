import DashboardCard from './DashboardCard/DashboardCard';
import PageHeader from '../common/PageHeader/PageHeader';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../app/hooks';
import { sumByKeyDecimal, sumDecimal } from '../../utils/math';
import { Button, SimpleGrid, Skeleton, Tooltip } from '@mantine/core';
import { Link } from 'react-router-dom';
import {
  CalendarCheck2,
  CircleDollarSign,
  Layers,
  Plus,
  Wallet,
} from 'lucide-react';

import dayjs from 'dayjs';

const Dashboard = () => {
  const {
    installments,
    fetchInstallments: { loading: fetchInstallmentsLoading },
  } = useAppSelector((state) => state.installments);
  const { t } = useTranslation();

  const { totalCurrent, totalPaid, totalRemaining } = useMemo(() => {
    const now = dayjs();
    const allPayments = installments.flatMap((i) => i.monthlyPayments);

    const totalCurrent = sumByKeyDecimal(
      allPayments.filter(
        (p) =>
          !p.paid &&
          dayjs(p.date).month() === now.month() &&
          dayjs(p.date).year() === now.year()
      ),
      'amount'
    );

    const totalPaid = sumByKeyDecimal(
      allPayments.filter((p) => p.paid),
      'amount'
    );

    const totalRemaining = sumByKeyDecimal(
      allPayments.filter((p) => !p.paid),
      'amount'
    );

    return { totalCurrent, totalPaid, totalRemaining };
  }, [installments]);

  return (
    <>
      <PageHeader
        title='Dashboard'
        actions={
          <Tooltip label={t('dashboard.buttons.addPayment.tooltip')}>
            <Button
              leftSection={<Plus size={18} />}
              component={Link}
              to='/payments/add'
              variant='filled'
              size='xs'
            >
              <span>{t('dashboard.buttons.addPayment.label')}</span>
            </Button>
          </Tooltip>
        }
      />

      <Skeleton visible={fetchInstallmentsLoading}>
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing='md' mt='md'>
          <DashboardCard
            title={t('dashboard.cards.current')}
            amount={totalCurrent}
            routeUrl='/dashboard/current'
            icon={<CalendarCheck2 className='text-red-600' />}
            color='border-red-500'
          />
          <DashboardCard
            title={t('dashboard.cards.remaining')}
            amount={totalRemaining}
            routeUrl='/dashboard/remaining'
            icon={<Wallet className='text-yellow-600' />}
            color='border-yellow-500'
          />
          <DashboardCard
            title={t('dashboard.cards.paid')}
            amount={totalPaid}
            routeUrl='/dashboard/paid'
            icon={<CircleDollarSign className='text-green-600' />}
            color='border-green-500'
          />
          <DashboardCard
            title={t('dashboard.cards.all')}
            amount={sumDecimal([totalPaid, totalRemaining])}
            routeUrl='/payments/all'
            icon={<Layers className='text-gray-600' />}
            color='border-gray-500'
          />
        </SimpleGrid>
      </Skeleton>
    </>
  );
};

export default Dashboard;
