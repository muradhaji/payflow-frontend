import { useState } from 'react';

import dayjs from 'dayjs';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useTranslation } from 'react-i18next';

import {
  Badge,
  Button,
  Grid,
  Loader,
  LoadingOverlay,
  Skeleton,
  Tooltip,
} from '@mantine/core';

import { IconCheck, IconFolderCheck, IconX } from '@tabler/icons-react';
import { showNotification } from '@mantine/notifications';

import { sumByKeyDecimal } from '../../utils/math';
import utilStyles from '../../styles/utils.module.css';

import FilteredPaymentsCard from './FilteredPaymentsCard/FilteredPaymentsCard';
import MonthSelector from '../common/MonthSelector/MonthSelector';
import PageHeader from '../common/PageHeader/PageHeader';
import EmptyState from '../common/EmptyState/EmptyState';

import FilterHeader from './FilterHeader/FilterHeader';

import {
  completePayments,
  updateInstallments,
} from '../../features/installments/installmentsSlice';

import { useInstallmenstsDateRange } from '../../hooks/useInstallmentsDateRange';
import { useSelectedPayments } from '../../hooks/useSelectedPayments';
import { useFilteredInstallments } from '../../hooks/useFilteredInstallments';

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

  const filteredInstallments = useFilteredInstallments(
    installments,
    (p) => !p.paid && dayjs(p.date).isSame(dayjs(currentMonth), 'month')
  );

  const {
    selectedPayments,
    selectedPaymentsAmount,
    togglePayment,
    togglePaymentsByInstallment,
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
          message: t('notifications.api.completePayments.success'),
          color: 'green',
          icon: <IconCheck />,
        });
        resetAll();
        dispatch(updateInstallments(response.payload.installments));
      } else {
        showNotification({
          message: t('notifications.api.completePayments.error'),
          color: 'red',
          icon: <IconX />,
        });
        console.error(response.payload);
      }
    } catch (err) {
      showNotification({
        message: t('notifications.api.completePayments.error'),
        color: 'red',
        icon: <IconX />,
      });
      console.error(err);
    }
  };

  return (
    <>
      <PageHeader
        title={t('components.filters.current.pageTitle')}
        breadcrumbs={[
          { label: t('breadcrumbs.payments'), to: '/payments' },
          {
            label: t('breadcrumbs.filterCurrent'),
            to: '/payments/current',
            active: true,
          },
        ]}
        actions={[
          <MonthSelector
            value={currentMonth}
            onChange={handleMonthChange}
            minDate={minDate}
            maxDate={maxDate}
            tooltip={t('tooltips.monthSelector')}
          />,
          <Tooltip label={t('buttons.completePayments.tooltip')}>
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
              {t('buttons.completePayments.label')}
            </Button>
          </Tooltip>,
        ]}
      />

      <Skeleton visible={fetchInstallmentsLoading}>
        {filteredInstallments.length > 0 ? (
          <>
            <FilterHeader
              title={t('components.filters.current.totalLabel', {
                month: dayjs(currentMonth).format('MMMM'),
              })}
              amount={sumByKeyDecimal(
                filteredInstallments.flatMap((i) => i.monthlyPayments),
                'amount'
              )}
              type='current'
            />

            <Grid align='flex-start'>
              <LoadingOverlay
                loaderProps={{ children: <></> }}
                visible={completePaymentsLoading}
                className={utilStyles.radiusSm}
              />
              {filteredInstallments.map((installment) => (
                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                  <FilteredPaymentsCard
                    key={installment._id}
                    {...installment}
                    togglePayment={togglePayment}
                    toggleAllPayments={togglePaymentsByInstallment}
                    isSelected={isSelected}
                    type='current'
                  />
                </Grid.Col>
              ))}
            </Grid>
          </>
        ) : (
          <EmptyState
            icon={<IconFolderCheck size={48} color='gray' />}
            title={t('components.filters.current.empty.title')}
            description={t('components.filters.current.empty.description')}
          />
        )}
      </Skeleton>
    </>
  );
};

export default FilterCurrent;
