import { useMemo } from 'react';
import dayjs from 'dayjs';

import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../app/hooks';

import { Button, SimpleGrid, Skeleton, Tooltip } from '@mantine/core';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

import {
  calculatePercentageDecimal,
  sumByKeyDecimal,
  sumDecimal,
} from '../../utils/math';

import {
  IconAlertSquareRounded,
  IconCalendar,
  IconCalendarClock,
  IconLibrary,
  IconSquareRoundedCheck,
} from '@tabler/icons-react';

import FilterCard from './FilterCard/FilterCard';
import PageHeader from '../common/PageHeader/PageHeader';
import StatsCard from './StatsCard/StatsCard';

const Filters = () => {
  const {
    installments,
    fetchInstallments: { loading: fetchInstallmentsLoading },
  } = useAppSelector((state) => state.installments);
  const { t } = useTranslation();

  const { total, totalOverdue, totalCurrent, totalPaid, totalRemaining } =
    useMemo(() => {
      const now = dayjs();
      const allPayments = installments.flatMap((i) => i.monthlyPayments);

      const totalOverdue = sumByKeyDecimal(
        allPayments.filter(
          (p) => !p.paid && dayjs(p.date).isBefore(now, 'month')
        ),
        'amount'
      );

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

      return {
        total: sumDecimal([totalPaid, totalRemaining]),
        totalOverdue,
        totalCurrent,
        totalPaid,
        totalRemaining,
      };
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
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing='md'>
          <StatsCard
            total={total}
            paid={totalPaid}
            remaining={totalRemaining}
          />

          <SimpleGrid cols={{ base: 1, lg: 2 }} spacing='md'>
            {totalOverdue !== 0 && (
              <FilterCard
                to='/payments/overdue'
                label={t('components.filters.cards.overdue')}
                stats={totalOverdue}
                percentage={calculatePercentageDecimal(totalOverdue, total)}
                color='red.5'
                Icon={IconAlertSquareRounded}
              />
            )}
            <FilterCard
              to='/payments/current'
              label={t('components.filters.cards.current')}
              stats={totalCurrent}
              percentage={calculatePercentageDecimal(totalCurrent, total)}
              color='orange'
              Icon={IconCalendar}
            />
            <FilterCard
              to='/payments/paid'
              label={t('components.filters.cards.paid')}
              stats={totalPaid}
              percentage={calculatePercentageDecimal(totalPaid, total)}
              color='teal.5'
              Icon={IconSquareRoundedCheck}
            />
            <FilterCard
              to='/payments/remaining'
              label={t('components.filters.cards.remaining')}
              stats={totalRemaining}
              percentage={calculatePercentageDecimal(totalRemaining, total)}
              color='gray.5'
              Icon={IconCalendarClock}
            />
            <FilterCard
              to='/payments/all'
              label={t('components.filters.cards.all')}
              stats={total}
              percentage={100}
              color='indigo.5'
              Icon={IconLibrary}
            />
          </SimpleGrid>
        </SimpleGrid>
      </Skeleton>
    </>
  );
};

export default Filters;
