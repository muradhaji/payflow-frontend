import FilterCard from './FilterCard/FilterCard';
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

const Filters = () => {
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
        title={t('components.filters.pageTitle')}
        actions={
          <Tooltip label={t('buttons.installment.add.tooltip')}>
            <Button
              leftSection={<Plus size={18} />}
              component={Link}
              to='/payments/add'
              variant='filled'
              size='xs'
            >
              <span>{t('buttons.installment.add.label')}</span>
            </Button>
          </Tooltip>
        }
      />

      <Skeleton visible={fetchInstallmentsLoading}>
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing='md' mt='md'>
          <FilterCard
            title={t('components.filters.cards.current')}
            amount={totalCurrent}
            routeUrl='/payments/current'
            icon={<CalendarCheck2 className='text-red-600' />}
            color='border-red-500'
          />
          <FilterCard
            title={t('components.filters.cards.remaining')}
            amount={totalRemaining}
            routeUrl='/payments/remaining'
            icon={<Wallet className='text-yellow-600' />}
            color='border-yellow-500'
          />
          <FilterCard
            title={t('components.filters.cards.paid')}
            amount={totalPaid}
            routeUrl='/payments/paid'
            icon={<CircleDollarSign className='text-green-600' />}
            color='border-green-500'
          />
          <FilterCard
            title={t('components.filters.cards.all')}
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

export default Filters;
