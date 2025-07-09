import type {
  IInstallment,
  ISelectedPayment,
} from '../../../types/installment';

import { useAppSelector } from '../../../app/hooks';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import FilterCard from './FilterCard/FilterCard';
import PageHeader from '../../common/PageHeader/PageHeader';
import EmptyState from '../../common/EmptyState/EmptyState';

import {
  Badge,
  Button,
  Card,
  Group,
  SimpleGrid,
  Skeleton,
  Text,
  Tooltip,
} from '@mantine/core';

import { sumByKeyDecimal } from '../../../utils/math';

const FilterRemaining = () => {
  const {
    installments,
    fetchInstallments: { loading: fetchInstallmentsLoading },
  } = useAppSelector((state) => state.installments);

  const [selectedPayments, setSelectedPayments] = useState<ISelectedPayment[]>(
    []
  );

  const [selectedPaymentsAmount, setSelectedPaymentsAmount] =
    useState<number>(0);

  const { t } = useTranslation();

  const filteredInstallments = useMemo(() => {
    return installments
      .map((installment) => {
        const filtered = installment.monthlyPayments.filter((p) => !p.paid);
        if (filtered.length === 0) return null;
        return {
          ...installment,
          monthlyPayments: filtered,
        };
      })
      .filter(Boolean) as IInstallment[];
  }, [installments]);

  useEffect(() => {
    setSelectedPaymentsAmount(
      sumByKeyDecimal(selectedPayments, 'paymentAmount')
    );
  }, [selectedPayments]);

  const handlePaymentSelect = (payment: ISelectedPayment) => {
    setSelectedPayments((prev) => {
      const exists = prev.some(
        (p) =>
          p.installmentId === payment.installmentId &&
          p.paymentId === payment.paymentId
      );

      return exists
        ? prev.filter(
            (p) =>
              !(
                p.installmentId === payment.installmentId &&
                p.paymentId === payment.paymentId
              )
          )
        : [...prev, payment];
    });
  };

  return (
    <>
      <PageHeader
        title={t('dashboard.filters.remaining.pageTitle')}
        breadcrumbs={[
          { label: t('common.breadcrumbs.dashboard'), to: '/dashboard' },
          {
            label: t('common.breadcrumbs.filterRemaining'),
            to: '/dashboard/remaining',
            active: true,
          },
        ]}
        actions={
          <Tooltip label={t('dashboard.filters.common.buttons.pay.tooltip')}>
            <Button
              variant='filled'
              size='xs'
              onClick={() => {
                console.info({ selectedPayments });
              }}
              disabled={!(selectedPaymentsAmount > 0)}
              rightSection={
                selectedPaymentsAmount > 0 && (
                  <Badge variant='white' color='blue'>
                    {` ${selectedPaymentsAmount} ₼`}
                  </Badge>
                )
              }
            >
              {t('dashboard.filters.common.buttons.pay.label')}
            </Button>
          </Tooltip>
        }
      />

      <Skeleton visible={fetchInstallmentsLoading}>
        {filteredInstallments.length > 0 ? (
          <>
            <Card
              shadow='sm'
              radius='sm'
              withBorder
              mb='md'
              px='md'
              py='sm'
              bg='white'
            >
              <Group justify='space-between' gap='md' wrap='wrap'>
                <Text size='lg' fw={700} c='gray.8'>
                  {t('dashboard.filters.remaining.totalLabel')}
                </Text>
                <Text size='md' fw={700} c='orange'>
                  {sumByKeyDecimal(
                    filteredInstallments.flatMap((i) => i.monthlyPayments),
                    'amount'
                  )}{' '}
                  ₼
                </Text>
              </Group>
            </Card>

            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing='md'>
              {filteredInstallments.map((installment) => (
                <FilterCard
                  key={installment._id}
                  {...installment}
                  togglePaymentSelect={handlePaymentSelect}
                  selectedPayments={selectedPayments}
                  type='remaining'
                />
              ))}
            </SimpleGrid>
          </>
        ) : (
          <EmptyState
            icon
            title={t('dashboard.filters.remaining.empty.title')}
            description={t('dashboard.filters.remaining.empty.description')}
          />
        )}
      </Skeleton>
    </>
  );
};

export default FilterRemaining;
