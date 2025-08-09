import {
  Badge,
  Button,
  Grid,
  Loader,
  LoadingOverlay,
  Skeleton,
  Tooltip,
} from '@mantine/core';

import {
  IconCheck,
  IconFolderCheck,
  IconSquareCheck,
  IconSquareCheckFilled,
  IconX,
} from '@tabler/icons-react';
import { showNotification } from '@mantine/notifications';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useTranslation } from 'react-i18next';

import { sumByKeyDecimal } from '../../utils/math';
import utilStyles from '../../styles/utils.module.css';

import FilteredPaymentsCard from './FilteredPaymentsCard/FilteredPaymentsCard';
import PageHeader from '../common/PageHeader/PageHeader';
import EmptyState from '../common/EmptyState/EmptyState';
import FilterHeader from './FilterHeader/FilterHeader';

import { useSelectedPayments } from '../../hooks/useSelectedPayments';
import { useFilteredInstallments } from '../../hooks/useFilteredInstallments';

import {
  completePayments,
  updateInstallments,
} from '../../features/installments/installmentsSlice';

const FilterRemaining = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const {
    installments,
    fetchInstallments: { loading: fetchInstallmentsLoading },
    completePayments: { loading: completePaymentsLoading },
  } = useAppSelector((state) => state.installments);

  const filteredInstallments = useFilteredInstallments(
    installments,
    (p) => !p.paid
  );

  const {
    isSelected,
    isAllSelected,
    selectedPayments,
    selectedPaymentsAmount,
    togglePayment,
    togglePaymentsByInstallment,
    toggleAll,
    clearAll,
  } = useSelectedPayments({ installments: filteredInstallments });

  const handleSubmit = async () => {
    try {
      const response = await dispatch(completePayments(selectedPayments));

      if (completePayments.fulfilled.match(response)) {
        showNotification({
          message: t('notifications.api.completePayments.success'),
          color: 'green',
          icon: <IconCheck />,
        });
        clearAll();
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
        title={t('components.filters.remaining.pageTitle')}
        breadcrumbs={[
          { label: t('breadcrumbs.payments'), to: '/payments' },
          {
            label: t('breadcrumbs.filterRemaining'),
            to: '/payments/remaining',
            active: true,
          },
        ]}
        actions={[
          <Tooltip label={t('buttons.selectAll.tooltip')}>
            <Button
              variant='light'
              size='xs'
              onClick={toggleAll}
              leftSection={
                isAllSelected ? <IconSquareCheckFilled /> : <IconSquareCheck />
              }
            >
              {t('buttons.selectAll.label')}
            </Button>
          </Tooltip>,
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
              title={t('components.filters.remaining.totalLabel')}
              amount={sumByKeyDecimal(
                filteredInstallments.flatMap((i) => i.monthlyPayments),
                'amount'
              )}
              type='remaining'
            />

            <Grid align='flex-start'>
              <LoadingOverlay
                loaderProps={{ children: <></> }}
                visible={completePaymentsLoading}
                className={utilStyles.radiusSm}
              />
              {filteredInstallments.map((installment) => (
                <Grid.Col
                  key={installment._id}
                  span={{ base: 12, sm: 6, md: 4 }}
                >
                  <FilteredPaymentsCard
                    {...installment}
                    togglePayment={togglePayment}
                    isSelected={isSelected}
                    type='remaining'
                    toggleAllPayments={togglePaymentsByInstallment}
                  />
                </Grid.Col>
              ))}
            </Grid>
          </>
        ) : (
          <EmptyState
            icon={<IconFolderCheck size={48} color='gray' />}
            title={t('components.filters.remaining.empty.title')}
            description={t('components.filters.remaining.empty.description')}
          />
        )}
      </Skeleton>
    </>
  );
};

export default FilterRemaining;
