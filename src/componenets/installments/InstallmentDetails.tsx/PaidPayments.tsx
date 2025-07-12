import PaymentsCard from './PaymentsCard';
import { useTranslation } from 'react-i18next';
import { cancelPayments } from '../../../features/installments/installmentsSlice';
import { useAppSelector } from '../../../app/hooks';

const PaidPayments = () => {
  const { loading } = useAppSelector(
    (state) => state.installments.cancelPayments
  );

  const { t } = useTranslation();

  const buttonProps = {
    label: t('installments.details.payments.paid.buttons.cancel.label'),
    tooltip: t('installments.details.payments.paid.buttons.cancel.tooltip'),
    color: 'red',
  };

  const emptyProps = {
    title: t('installments.details.payments.paid.empty.title'),
  };

  const notificationMessages = {
    success: {
      title: t(
        'installments.details.payments.paid.notifications.success.title'
      ),
      message: t(
        'installments.details.payments.paid.notifications.success.message'
      ),
    },
    error: {
      title: t('installments.details.payments.paid.notifications.error.title'),
      message: t(
        'installments.details.payments.paid.notifications.error.message'
      ),
    },
  };

  return (
    <PaymentsCard
      title={t('installments.details.payments.paid.cardTitle')}
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
