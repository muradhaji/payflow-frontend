import type {
  IInstallment,
  IPaymentUpdate,
} from '../../../../types/installment';

import { useTranslation } from 'react-i18next';
import { sumByKeyDecimal } from '../../../../utils/math';

import { Link } from 'react-router-dom';
import { Ellipsis } from 'lucide-react';
import { Card, Group, Text, Checkbox, Stack, ActionIcon } from '@mantine/core';

import dayjs from 'dayjs';

import classes from './FilterCard.module.css';
import utilStyles from '../../../../styles/utils.module.css';

const colorMap: Record<string, string> = {
  current: 'red',
  remaining: 'orange',
  paid: 'green',
  default: 'gray',
};

interface FilterCardProps extends IInstallment {
  togglePaymentSelect: (payment: IPaymentUpdate) => void;
  selectedPayments: IPaymentUpdate[];
  type: 'current' | 'remaining' | 'paid' | 'all';
}

const FilterCard = ({
  _id: installmentId,
  title,
  monthlyPayments,
  togglePaymentSelect,
  selectedPayments,
  type,
}: FilterCardProps) => {
  const { t } = useTranslation();
  const color = colorMap[type] ?? colorMap.default;

  const isSelected = (paymentId: string) =>
    selectedPayments.some(
      (p) => p.installmentId === installmentId && p.paymentId === paymentId
    );

  const formatDate = (date: string | Date) => dayjs(date).format('D MMM, YYYY');

  return (
    <Card shadow='sm' radius='sm' withBorder padding='md'>
      <Group justify='space-between' align='center' mb='md'>
        <Text fw={600} size='lg' c='gray.8'>
          {title}
        </Text>
        <ActionIcon
          component={Link}
          to={`/payments/details/${installmentId}`}
          variant='subtle'
          c='gray'
          size='md'
          aria-label={t('dashboard.filters.card.viewDetails')}
        >
          <Ellipsis size={20} />
        </ActionIcon>
      </Group>

      {monthlyPayments.length > 1 && (
        <Group justify='space-between' className={classes.totalSummary}>
          <Text size='sm' fw={500} c='blue.8'>
            {t('dashboard.filters.card.totalLabel')}
          </Text>
          <Text size='lg' fw={700} c={`${color}.6`}>
            {sumByKeyDecimal(monthlyPayments, 'amount')} ₼
          </Text>
        </Group>
      )}

      <Stack gap='sm'>
        {monthlyPayments.map((payment) => (
          <Group
            key={payment._id}
            justify='space-between'
            gap='sm'
            p='xs'
            className={`${classes.paymentItem} ${
              type !== 'paid' ? classes.paymentItemHover : ''
            }`}
            onClick={() => {
              if (type !== 'paid') {
                togglePaymentSelect({
                  installmentId,
                  paymentId: payment._id,
                  paymentAmount: payment.amount,
                });
              }
            }}
          >
            <Group gap='xs' align='center'>
              {type !== 'paid' && (
                <Checkbox
                  checked={isSelected(payment._id)}
                  readOnly
                  tabIndex={-1}
                  onClick={(e) => e.stopPropagation()}
                  c='blue'
                  size='sm'
                />
              )}
              <div>
                <Text
                  size='sm'
                  fw={500}
                  c='gray.8'
                  className={utilStyles.capitalize}
                >
                  {formatDate(payment.date)}
                </Text>
                {payment.paid && payment.paidDate && (
                  <Text size='xs' c='green.6' className={utilStyles.capitalize}>
                    {t('dashboard.filters.card.paidLabel', {
                      date: formatDate(payment.paidDate),
                    })}
                  </Text>
                )}
              </div>
            </Group>
            <Text size='md' fw={600} c={`${color}.7`} ta='right'>
              ₼ {payment.amount}
            </Text>
          </Group>
        ))}
      </Stack>
    </Card>
  );
};

export default FilterCard;
