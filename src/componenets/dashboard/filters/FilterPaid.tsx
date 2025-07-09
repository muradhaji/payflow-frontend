import type { IInstallment } from '../../../types/installment';

import FilterCard from './FilterCard/FilterCard';
import EmptyState from '../../common/EmptyState/EmptyState';
import PageHeader from '../../common/PageHeader/PageHeader';

import { useAppSelector } from '../../../app/hooks';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Card, Group, SimpleGrid, Skeleton, Text } from '@mantine/core';

import { sumByKeyDecimal } from '../../../utils/math';

const FilterPaid = () => {
  const {
    installments,
    fetchInstallments: { loading: fetchInstallmentsLoading },
  } = useAppSelector((state) => state.installments);

  const { t } = useTranslation();

  const filteredInstallments = useMemo(() => {
    return installments
      .map((installment) => {
        const filtered = installment.monthlyPayments.filter((p) => p.paid);
        if (filtered.length === 0) return null;
        return {
          ...installment,
          monthlyPayments: filtered,
        };
      })
      .filter(Boolean) as IInstallment[];
  }, [installments]);

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
                  {t('dashboard.filters.paid.totalLabel')}
                </Text>
                <Text size='md' fw={700} c='green'>
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
                  togglePaymentSelect={() => {}}
                  selectedPayments={[]}
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
