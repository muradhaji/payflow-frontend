import { useTranslation } from 'react-i18next';

import { useAppSelector } from '../../../app/hooks';

import PaymentsCard from './PaymentsCard';

import { cancelPayments } from '../../../features/installments/installmentsSlice';

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
    title: t('components.paymentsCard.paid.empty.title'),
  };

  const notificationMessages = {
    success: {
      title: t('notifications.api.cancelPayments.success.title'),
      message: t('notifications.api.cancelPayments.success.message'),
    },
    error: {
      title: t('notifications.api.cancelPayments.error.title'),
      message: t('notifications.api.cancelPayments.error.message'),
    },
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
