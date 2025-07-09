import type {
  IInstallment,
  ISelectedPayment,
} from '../../../types/installment';

import { useAppSelector } from '../../../app/hooks';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { sumByKeyDecimal } from '../../../utils/math';

import FilterCard from './FilterCard/FilterCard';
import MonthSelector from '../../common/MonthSelector/MonthSelector';
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

import dayjs from 'dayjs';
import { capitalize } from '../../../utils/strings';

const FilterCurrent = () => {
  const {
    installments,
    fetchInstallments: { loading: fetchInstallmentsLoading },
  } = useAppSelector((state) => state.installments);

  const [selectedPayments, setSelectedPayments] = useState<ISelectedPayment[]>(
    []
  );
  const [selectedPaymentsAmount, setSelectedPaymentsAmount] =
    useState<number>(0);

  const [selectedMonth, setSelectedMonth] = useState<string>(
    dayjs().format('YYYY-MM')
  );

  const { t } = useTranslation();

  const filteredInstallments = useMemo(() => {
    const filtered: IInstallment[] = [];

    for (const installment of installments) {
      const { monthlyPayments, ...otherInstallmentData } = installment;

      const filteredMonthlyPayments = monthlyPayments.filter((payment) => {
        return (
          !payment.paid &&
          dayjs(payment.date).year() === dayjs(selectedMonth).year() &&
          dayjs(payment.date).month() === dayjs(selectedMonth).month()
        );
      });

      if (filteredMonthlyPayments.length) {
        filtered.push({
          ...otherInstallmentData,
          monthlyPayments: filteredMonthlyPayments,
        });
      }
    }

    return filtered;
  }, [installments, selectedMonth]);

  const [minDate, maxDate] = useMemo(() => {
    const allDates = installments.flatMap((i) =>
      i.monthlyPayments.map((p) => dayjs(p.date))
    );

    if (allDates.length === 0) return [null, null];

    const sorted = allDates.sort((a, b) => a.valueOf() - b.valueOf());

    return [
      sorted[0].startOf('month').toDate(),
      sorted[sorted.length - 1].startOf('month').toDate(),
    ];
  }, [installments]);

  useEffect(() => {
    setSelectedPaymentsAmount(
      sumByKeyDecimal(selectedPayments, 'paymentAmount')
    );
  }, [selectedPayments]);

  const handlePaymentSelect = (payment: ISelectedPayment) => {
    const exists = selectedPayments.some(
      (p) =>
        p.installmentId === payment.installmentId &&
        p.paymentId === payment.paymentId
    );

    if (exists) {
      setSelectedPayments(
        selectedPayments.filter(
          (p) =>
            !(
              p.installmentId === payment.installmentId &&
              p.paymentId === payment.paymentId
            )
        )
      );
    } else {
      setSelectedPayments([...selectedPayments, payment]);
    }
  };

  const handleMonthChange = (newMonth: string) => {
    setSelectedMonth(newMonth);
    setSelectedPayments([]);
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
            value={selectedMonth}
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
          </Tooltip>,
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
                  {t('dashboard.filters.current.totalLabel', {
                    month: capitalize(dayjs(selectedMonth).format('MMMM')),
                  })}
                </Text>
                <Text size='md' fw={700} c='red.6'>
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
