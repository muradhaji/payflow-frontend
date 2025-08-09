import { useTranslation } from 'react-i18next';

import { useAppSelector } from '../../../app/hooks';

import PaymentsCard from './PaymentsCard';

import { completePayments } from '../../../features/installments/installmentsSlice';
import { IconFolderCheck } from '@tabler/icons-react';

const UnpaidPayments = () => {
  const { loading } = useAppSelector(
    (state) => state.installments.completePayments
  );

  const { t } = useTranslation();

  const notificationMessages = {
    success: t('notifications.api.completePayments.success'),
    error: t('notifications.api.completePayments.error'),
  };

  const buttonProps = {
    label: t('buttons.completePayments.label'),
    tooltip: t('buttons.completePayments.tooltip'),
    color: 'blue',
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
