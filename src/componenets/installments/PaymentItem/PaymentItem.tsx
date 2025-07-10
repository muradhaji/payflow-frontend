import { Checkbox, Group, Text } from '@mantine/core';
import classes from './PaymentItem.module.css';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import type { IMonthlyPayment } from '../../../types/installment';

interface PaymentItemProps {
  payment: IMonthlyPayment;
  isSelected: boolean;
  onToggle: () => void;
}

const PaymentItem = ({ payment, isSelected, onToggle }: PaymentItemProps) => {
  const { t } = useTranslation();

  const isPaid = payment.paid;
  const formattedDate = dayjs(payment.date).format('D MMM, YYYY');
  const formattedPaidDate = payment.paidDate
    ? dayjs(payment.paidDate).format('D MMM, YYYY')
    : null;

  return (
    <Group
      justify='space-between'
      className={`${classes.wrapper} ${
        isPaid ? classes.wrapperDisabled : classes.wrapperActive
      }`}
      onClick={!isPaid ? onToggle : undefined}
    >
      <Group align='center'>
        <Checkbox
          checked={isSelected || isPaid}
          disabled={isPaid}
          onClick={(e) => {
            e.stopPropagation();
            if (!isPaid) onToggle();
          }}
          readOnly
          size='sm'
          color='blue'
        />
        <div>
          <Text size='sm' fw={500}>
            {formattedDate}
          </Text>
          {isPaid && formattedPaidDate && (
            <Text size='xs' c='green.6'>
              {t('dashboard.filters.card.paidLabel', {
                date: formattedPaidDate,
              })}
            </Text>
          )}
        </div>
      </Group>
      <Text fw={600}>{payment.amount} ₼</Text>
    </Group>
  );
};

export default PaymentItem;
