import { useTranslation } from 'react-i18next';

import { Link } from 'react-router-dom';
import { Ellipsis } from 'lucide-react';
import { Card, Group, Text, Stack, ActionIcon, Tooltip } from '@mantine/core';

import type { IInstallment, IPaymentUpdate } from '../../../types/installment';

import { sumByKeyDecimal } from '../../../utils/math';

import classes from './FilteredPaymentsCard.module.css';
import PaymentItem from '../../installments/PaymentItem/PaymentItem';

const colorMap: Record<string, string> = {
  overdue: 'red.5',
  current: 'orange.5',
  remaining: 'dark',
  paid: 'tale.5',
  default: 'indigo.5',
};

interface FilteredPaymentsCardProps extends IInstallment {
  togglePayment: (payment: IPaymentUpdate) => void;
  isSelected: (paymentId: string) => boolean;
  type: 'overdue' | 'current' | 'remaining' | 'paid' | 'all';
}

const FilteredPaymentsCard = ({
  _id: installmentId,
  title,
  monthlyPayments,
  togglePayment,
  isSelected,
  type,
}: FilteredPaymentsCardProps) => {
  const { t } = useTranslation();
  const color = colorMap[type] ?? colorMap.default;

  return (
    <Card shadow='sm' radius='sm' padding='md' withBorder>
      <Group justify='space-between' align='center' mb='md'>
        <Text fw={600} size='lg' c='gray.8'>
          {title}
        </Text>
        <Tooltip label={t('tooltips.details')}>
          <ActionIcon
            component={Link}
            to={`/payments/details/${installmentId}`}
            variant='subtle'
            color='gray'
            size='md'
          >
            <Ellipsis size={20} />
          </ActionIcon>
        </Tooltip>
      </Group>

      {monthlyPayments.length > 1 && (
        <Group justify='space-between' className={classes.totalSummary}>
          <Text size='sm' fw={500} c='blue.8'>
            {t('components.filteredPaymentsCard.totalLabel')}
          </Text>
          <Text size='lg' fw={700} c={`${color}.6`}>
            {sumByKeyDecimal(monthlyPayments, 'amount')} ₼
          </Text>
        </Group>
      )}

      <Stack gap='sm'>
        {monthlyPayments.map((payment) => (
          <PaymentItem
            key={payment._id}
            payment={payment}
            isSelected={isSelected(payment._id)}
            onToggle={(paymentId, paymentAmount) => {
              togglePayment({
                installmentId,
                paymentId,
                paymentAmount,
              });
            }}
          />
        ))}
      </Stack>
    </Card>
  );
};

export default FilteredPaymentsCard;
