import dayjs from 'dayjs';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useTranslation } from 'react-i18next';

import {
  Badge,
  Button,
  Loader,
  LoadingOverlay,
  SimpleGrid,
  Skeleton,
  Tooltip,
} from '@mantine/core';

import { Check, X } from 'lucide-react';
import { showNotification } from '@mantine/notifications';

import { sumByKeyDecimal } from '../../utils/math';
import utilStyles from '../../styles/utils.module.css';

import FilteredPaymentsCard from './FilteredPaymentsCard/FilteredPaymentsCard';
import PageHeader from '../common/PageHeader/PageHeader';
import EmptyState from '../common/EmptyState/EmptyState';

import FilterHeader from './FilterHeader/FilterHeader';

import {
  completePayments,
  updateInstallments,
} from '../../features/installments/installmentsSlice';

import { useSelectedPayments } from '../../hooks/useSelectedPayments';
import { useFilteredInstallments } from '../../hooks/useFilteredInstallments';

const FilterOverdue = () => {
  const dispatch = useAppDispatch();

  const { t } = useTranslation();

  const {
    installments,
    fetchInstallments: { loading: fetchInstallmentsLoading },
    completePayments: { loading: completePaymentsLoading },
  } = useAppSelector((state) => state.installments);

  const filteredInstallments = useFilteredInstallments(installments, (p) => {
    const now = dayjs();
    return !p.paid && dayjs(p.date).isBefore(now, 'month');
  });

  const {
    selectedPayments,
    selectedPaymentsAmount,
    togglePayment,
    resetAll,
    isSelected,
  } = useSelectedPayments();

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
        title={t('components.filters.overdue.pageTitle')}
        breadcrumbs={[
          { label: t('breadcrumbs.payments'), to: '/payments' },
          {
            label: t('breadcrumbs.filterOverdue'),
            to: '/payments/overdue',
            active: true,
          },
        ]}
        actions={[
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
              title={t('components.filters.overdue.totalLabel')}
              amount={sumByKeyDecimal(
                filteredInstallments.flatMap((i) => i.monthlyPayments),
                'amount'
              )}
              type='overdue'
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
                <FilteredPaymentsCard
                  key={installment._id}
                  {...installment}
                  togglePayment={togglePayment}
                  isSelected={isSelected}
                  type='overdue'
                />
              ))}
            </SimpleGrid>
          </>
        ) : (
          <EmptyState
            icon
            title={t('components.filters.overdue.empty.title')}
            description={t('components.filters.overdue.empty.description')}
          />
        )}
      </Skeleton>
    </>
  );
};

export default FilterOverdue;
