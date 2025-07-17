import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { sumByKeyDecimal } from '../../../utils/math';

import FilterCard from './FilterCard/FilterCard';
import MonthSelector from '../../common/MonthSelector/MonthSelector';
import PageHeader from '../../common/PageHeader/PageHeader';
import EmptyState from '../../common/EmptyState/EmptyState';
import {
  Badge,
  Button,
  Loader,
  LoadingOverlay,
  SimpleGrid,
  Skeleton,
  Tooltip,
} from '@mantine/core';

import dayjs from 'dayjs';
import utilStyles from '../../../styles/utils.module.css';

import FilterHeader from './FilterHeader/FilterHeader';
import {
  completePayments,
  updateInstallments,
} from '../../../features/installments/installmentsSlice';
import { showNotification } from '@mantine/notifications';
import { Check, X } from 'lucide-react';
import { useCurrentInstallments } from '../../../hooks/useCurrentInstallments';
import { useInstallmenstsDateRange } from '../../../hooks/useInstallmentsDateRange';
import { useSelectedPayments } from '../../../hooks/useSelectedPayments';

const FilterCurrent = () => {
  const dispatch = useAppDispatch();

  const { t } = useTranslation();

  const {
    installments,
    fetchInstallments: { loading: fetchInstallmentsLoading },
    completePayments: { loading: completePaymentsLoading },
  } = useAppSelector((state) => state.installments);

  const [currentMonth, setCurrentMonth] = useState<string>(
    dayjs().format('YYYY-MM')
  );

  const [minDate, maxDate] = useInstallmenstsDateRange(installments);

  const filteredInstallments = useCurrentInstallments(
    installments,
    currentMonth
  );

  const {
    selectedPayments,
    selectedPaymentsAmount,
    togglePayment,
    resetAll,
    isSelected,
  } = useSelectedPayments();

  const handleMonthChange = (newMonth: string) => {
    setCurrentMonth(newMonth);
    resetAll();
  };

  const handleSubmit = async () => {
    try {
      const response = await dispatch(completePayments(selectedPayments));

      if (completePayments.fulfilled.match(response)) {
        showNotification({
          title: t('notifications.api.completePayments.success.title'),
          message: t('notifications.api.completePayments.success.message'),
          color: 'green',
          icon: <Check />,
        });
        resetAll();
        dispatch(updateInstallments(response.payload.installments));
      } else {
        showNotification({
          title: t('notifications.api.completePayments.error.title'),
          message: t('notifications.api.completePayments.error.message'),
          color: 'red',
          icon: <X />,
        });
        console.error(response.payload);
      }
    } catch (err) {
      showNotification({
        title: t('notifications.api.completePayments.error.title'),
        message: t('notifications.api.completePayments.error.message'),
        color: 'red',
        icon: <X />,
      });
      console.error(err);
    }
  };

  return (
    <>
      <PageHeader
        title={t('dashboard.filters.current.pageTitle')}
        breadcrumbs={[
          { label: t('common.breadcrumbs.dashboard'), to: '/dashboard' },
          {
            label: t('common.breadcrumbs.filterCurrent'),
            to: '/dashboard/current',
            active: true,
          },
        ]}
        actions={[
          <MonthSelector
            value={currentMonth}
            onChange={handleMonthChange}
            minDate={minDate}
            maxDate={maxDate}
            tooltip={t(
              'dashboard.filters.common.buttons.monthSelector.tooltip'
            )}
          />,
          <Tooltip label={t('dashboard.filters.common.buttons.pay.tooltip')}>
            <Button
              variant='filled'
              size='xs'
              onClick={handleSubmit}
              disabled={!(selectedPaymentsAmount > 0)}
              rightSection={
                selectedPaymentsAmount > 0 && (
                  <Badge variant='white' color='blue'>
                    {` ${selectedPaymentsAmount} ₼`}
                  </Badge>
                )
              }
              loading={completePaymentsLoading}
              loaderProps={{
                children: <Loader size='sm' type='dots' color='white' />,
              }}
            >
              {t('dashboard.filters.common.buttons.pay.label')}
            </Button>
          </Tooltip>,
        ]}
      />

      <Skeleton visible={fetchInstallmentsLoading}>
        {filteredInstallments.length > 0 ? (
          <>
            <FilterHeader
              title={t('dashboard.filters.current.totalLabel', {
                month: dayjs(currentMonth).format('MMMM'),
              })}
              amount={sumByKeyDecimal(
                filteredInstallments.flatMap((i) => i.monthlyPayments),
                'amount'
              )}
            />

            <SimpleGrid
              cols={{ base: 1, sm: 2, md: 3 }}
              spacing='md'
              className='relative'
            >
              <LoadingOverlay
                loaderProps={{ children: <></> }}
                visible={completePaymentsLoading}
                className={utilStyles.radiusSm}
              />
              {filteredInstallments.map((installment) => (
                <FilterCard
                  key={installment._id}
                  {...installment}
                  togglePayment={togglePayment}
                  isSelected={isSelected}
                  type='current'
                />
              ))}
            </SimpleGrid>
          </>
        ) : (
          <EmptyState
            icon
            title={t('dashboard.filters.current.empty.title')}
            description={t('dashboard.filters.current.empty.description')}
          />
        )}
      </Skeleton>
    </>
  );
};

export default FilterCurrent;
