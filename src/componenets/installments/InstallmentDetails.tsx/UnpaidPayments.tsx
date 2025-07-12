import PaymentsCard from './PaymentsCard';
import { useTranslation } from 'react-i18next';
import { completePayments } from '../../../features/installments/installmentsSlice';
import { useAppSelector } from '../../../app/hooks';

const UnpaidPayments = () => {
  const { loading } = useAppSelector(
    (state) => state.installments.completePayments
  );

  const { t } = useTranslation();

  const notificationMessages = {
    success: {
      title: t(
        'installments.details.payments.unpaid.notifications.success.title'
      ),
      message: t(
        'installments.details.payments.unpaid.notifications.success.message'
      ),
    },
    error: {
      title: t(
        'installments.details.payments.unpaid.notifications.error.title'
      ),
      message: t(
        'installments.details.payments.unpaid.notifications.error.message'
      ),
    },
  };

  const buttonProps = {
    label: t('installments.details.payments.unpaid.buttons.pay.label'),
    tooltip: t('installments.details.payments.unpaid.buttons.pay.tooltip'),
    color: 'blue',
  };

  const emptyProps = {
    title: t('installments.details.payments.unpaid.empty.title'),
  };

  return (
    <PaymentsCard
      title={t('installments.details.payments.unpaid.cardTitle')}
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
