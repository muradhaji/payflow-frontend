import { useTranslation } from 'react-i18next';

import { Link } from 'react-router-dom';
import { IconDots } from '@tabler/icons-react';
import { Card, Group, Text, ActionIcon, Tooltip, Badge } from '@mantine/core';

import FilteredPaymentsTable from '../FilteredPaymentsTable/FilteredPaymentsTable';

import type {
  IInstallment,
  IMonthlyPayment,
  IPaymentUpdate,
} from '../../../types/installment';

import { sumByKeyDecimal } from '../../../utils/math';

const colorMap: Record<string, string> = {
  overdue: 'red.5',
  current: 'orange.5',
  paid: 'teal.5',
  remaining: 'dark.5',
  default: 'indigo.5',
};

interface FilteredPaymentsCardProps extends IInstallment {
  isSelected: (paymentId: string) => boolean;
  togglePayment: (payment: IPaymentUpdate) => void;
  toggleAllPayments: (
    installmentId: string,
    payments: IMonthlyPayment[]
  ) => void;
  type: 'overdue' | 'current' | 'remaining' | 'paid' | 'all';
}

const FilteredPaymentsCard = ({
  _id: installmentId,
  title,
  monthlyPayments,
  isSelected,
  togglePayment,
  toggleAllPayments,
  type,
}: FilteredPaymentsCardProps) => {
  const { t } = useTranslation();
  const color = colorMap[type] ?? colorMap.default;

  const handleToggleAll = (): void => {
    toggleAllPayments(installmentId, monthlyPayments);
  };

  console.log(color);

  return (
    <Card shadow='sm' radius='sm' padding='md' withBorder>
      <Group justify='space-between' align='center' mb='md'>
        <Text fw={600} size='lg' c='gray.8'>
          {title}
        </Text>
        <Group align='center' gap='xs'>
          <Badge size='lg' variant='light' color={color}>
            {sumByKeyDecimal(monthlyPayments, 'amount')} ₼
          </Badge>
          <Tooltip label={t('tooltips.details')}>
            <ActionIcon
              component={Link}
              to={`/payments/details/${installmentId}`}
              variant='subtle'
              color='gray'
              size='md'
            >
              <IconDots size={20} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>

      <FilteredPaymentsTable
        payments={monthlyPayments}
        isSelected={isSelected}
        onToggle={(paymentId, paymentAmount) => {
          togglePayment({
            installmentId,
            paymentId,
            paymentAmount,
          });
        }}
        onToggleAll={handleToggleAll}
      />
    </Card>
  );
};

export default FilteredPaymentsCard;
