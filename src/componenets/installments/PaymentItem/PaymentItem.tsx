import type { IMonthlyPayment } from '../../../types/installment';

import { Checkbox, Group, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

import classes from './PaymentItem.module.css';
import utilStyles from '../../../styles/utils.module.css';

interface PaymentItemProps {
  payment: IMonthlyPayment;
  isSelected: boolean;
  onToggle: (paymentId: string, paymentAmount: number) => void;
}

const PaymentItem = ({ payment, isSelected, onToggle }: PaymentItemProps) => {
  const { t } = useTranslation();

  const formattedDate = dayjs(payment.date).format('D MMM, YYYY');
  const formattedPaidDate = payment.paidDate
    ? dayjs(payment.paidDate).format('D MMM, YYYY')
    : null;

  return (
    <Group
      justify='space-between'
      className={classes.wrapper}
      onClick={() => {
        onToggle(payment._id, payment.amount);
      }}
    >
      <Group align='center'>
        <Checkbox
          checked={isSelected}
          onClick={(e) => {
            e.stopPropagation();
            onToggle(payment._id, payment.amount);
          }}
          readOnly
          size='sm'
          color='blue'
        />
        <div>
          <Text size='sm' fw={500} className={utilStyles.capitalize}>
            {formattedDate}
          </Text>
          {payment.paid && formattedPaidDate && (
            <Text size='xs' c='green.6' className={utilStyles.capitalize}>
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
