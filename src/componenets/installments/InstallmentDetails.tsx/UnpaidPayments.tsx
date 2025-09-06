import { useTranslation } from 'react-i18next';

import { useAppSelector } from '../../../app/hooks';

import PaymentsCard from './PaymentsCard';

import { completePayments } from '../../../features/installments/installmentsSlice';
import { IconFolderCheck } from '@tabler/icons-react';
import { useThemeColors } from '../../../hooks/useThemeColors';

const UnpaidPayments = () => {
  const { loading } = useAppSelector(
    (state) => state.installment.completePayments
  );

  const { t } = useTranslation();
  const { themedColor } = useThemeColors();

  const notificationMessages = {
    success: t('notifications.api.completePayments.success'),
    error: t('notifications.api.completePayments.error'),
  };

  const buttonProps = {
    label: t('buttons.completePayments.label'),
    tooltip: t('buttons.completePayments.tooltip'),
    color: themedColor('blue', 'blue.4'),
  };

  const emptyProps = {
    icon: <IconFolderCheck size={32} color='gray' />,
    title: t('components.paymentsCard.unpaid.empty.title'),
  };

  return (
    <PaymentsCard
      title={t('components.paymentsCard.unpaid.cardTitle')}
      button={buttonProps}
      empty={emptyProps}
      notificationMessages={notificationMessages}
      filterCondition={(payment) => !payment.paid}
      onSubmitThunk={completePayments}
      loading={loading}
    />
  );
};

export default UnpaidPayments;
