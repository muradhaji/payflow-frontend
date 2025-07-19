import FilterCard from './FilterCard/FilterCard';
import EmptyState from '../../common/EmptyState/EmptyState';
import PageHeader from '../../common/PageHeader/PageHeader';

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
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

import { sumByKeyDecimal } from '../../../utils/math';
import FilterHeader from './FilterHeader/FilterHeader';
import { useFilteredInstallments } from '../../../hooks/useFilteredInstallments';
import { useSelectedPayments } from '../../../hooks/useSelectedPayments';
import {
  cancelPayments,
  updateInstallments,
} from '../../../features/installments/installmentsSlice';
import { showNotification } from '@mantine/notifications';
import { Check, X } from 'lucide-react';
import utilStyles from '../../../styles/utils.module.css';

const FilterPaid = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const {
    installments,
    fetchInstallments: { loading: fetchInstallmentsLoading },
    cancelPayments: { loading: cancelPaymentsLoading },
  } = useAppSelector((state) => state.installments);

  const filteredInstallments = useFilteredInstallments(
    installments,
    (p) => p.paid
  );

  const {
    selectedPayments,
    selectedPaymentsAmount,
    togglePayment,
    isSelected,
    resetAll,
  } = useSelectedPayments();

  const handleSubmit = async () => {
    try {
      const response = await dispatch(cancelPayments(selectedPayments));

      if (cancelPayments.fulfilled.match(response)) {
        showNotification({
          title: t('notifications.api.cancelPayments.success.title'),
          message: t('notifications.api.cancelPayments.success.message'),
          color: 'green',
          icon: <Check />,
        });
        resetAll();
        dispatch(updateInstallments(response.payload.installments));
      } else {
        showNotification({
          title: t('notifications.api.cancelPayments.error.title'),
          message: t('notifications.api.cancelPayments.error.message'),
          color: 'red',
          icon: <X />,
        });
        console.error(response.payload);
      }
    } catch (err) {
      showNotification({
        title: t('notifications.api.cancelPayments.error.title'),
        message: t('notifications.api.cancelPayments.error.message'),
        color: 'red',
        icon: <X />,
      });
      console.error(err);
    }
  };

  return (
    <>
      <PageHeader
        title={t('dashboard.filters.paid.pageTitle')}
        breadcrumbs={[
          { label: t('common.breadcrumbs.dashboard'), to: '/dashboard' },
          {
            label: t('common.breadcrumbs.filterPaid'),
            to: '/dashboard/paid',
            active: true,
          },
        ]}
        actions={
          <Tooltip label={t('dashboard.filters.paid.buttons.cancel.tooltip')}>
            <Button
              variant='filled'
              color='red'
              size='xs'
              onClick={handleSubmit}
              disabled={!(selectedPaymentsAmount > 0)}
              rightSection={
                selectedPaymentsAmount > 0 && (
                  <Badge variant='white' color='red'>
                    {` ${selectedPaymentsAmount} ₼`}
                  </Badge>
                )
              }
              loading={cancelPaymentsLoading}
              loaderProps={{
                children: <Loader size='sm' type='dots' color='white' />,
              }}
            >
              {t('dashboard.filters.paid.buttons.cancel.label')}
            </Button>
          </Tooltip>
        }
      />

      <Skeleton visible={fetchInstallmentsLoading}>
        {filteredInstallments.length > 0 ? (
          <>
            <FilterHeader
              title={t('dashboard.filters.paid.totalLabel')}
              amount={sumByKeyDecimal(
                filteredInstallments.flatMap((i) => i.monthlyPayments),
                'amount'
              )}
              type='paid'
            />

            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing='md'>
              <LoadingOverlay
                loaderProps={{ children: <></> }}
                visible={cancelPaymentsLoading}
                className={utilStyles.radiusSm}
              />
              {filteredInstallments.map((installment) => (
                <FilterCard
                  key={installment._id}
                  {...installment}
                  togglePayment={togglePayment}
                  isSelected={isSelected}
                  type='paid'
                />
              ))}
            </SimpleGrid>
          </>
        ) : (
          <EmptyState
            icon
            title={t('dashboard.filters.paid.empty.title')}
            description={t('dashboard.filters.paid.empty.description')}
          />
        )}
      </Skeleton>
    </>
  );
};

export default FilterPaid;
