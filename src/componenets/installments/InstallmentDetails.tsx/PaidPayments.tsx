import { useTranslation } from 'react-i18next';

import { useAppSelector } from '../../../app/hooks';

import PaymentsCard from './PaymentsCard';

import { cancelPayments } from '../../../features/installments/installmentsSlice';
import { IconFolderCheck } from '@tabler/icons-react';

const PaidPayments = () => {
  const { loading } = useAppSelector(
    (state) => state.installments.cancelPayments
  );

  const { t } = useTranslation();

  const buttonProps = {
    label: t('buttons.cancelPayments.label'),
    tooltip: t('buttons.cancelPayments.tooltip'),
    color: 'red',
  };

  const emptyProps = {
    icon: <IconFolderCheck size={32} color='gray' />,
    title: t('components.paymentsCard.paid.empty.title'),
  };

  const notificationMessages = {
    success: t('notifications.api.cancelPayments.success'),
    error: t('notifications.api.cancelPayments.error'),
  };

  return (
    <PaymentsCard
      title={t('components.paymentsCard.paid.cardTitle')}
      button={buttonProps}
      empty={emptyProps}
      notificationMessages={notificationMessages}
      filterCondition={(payment) => payment.paid}
      onSubmitThunk={cancelPayments}
      loading={loading}
    />
  );
};

export default PaidPayments;
