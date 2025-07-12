import {
  Badge,
  Button,
  Card,
  Grid,
  Group,
  Loader,
  LoadingOverlay,
  Stack,
  Title,
  Tooltip,
} from '@mantine/core';
import PaymentItem from '../PaymentItem/PaymentItem';
import EmptyState from '../../common/EmptyState/EmptyState';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { setSelectedInstallment } from '../../../features/installments/installmentsSlice';
import type {
  IPaymentUpdate,
  IMonthlyPayment,
  IInstallment,
} from '../../../types/installment';
import { useMemo, useState } from 'react';
import { sumByKeyDecimal } from '../../../utils/math';
import { showNotification } from '@mantine/notifications';
import { Check, X } from 'lucide-react';
import type { AsyncThunk } from '@reduxjs/toolkit';

interface PaymentsCardProps {
  title: string;
  button: {
    label: string;
    tooltip: string;
    color: string;
  };
  empty: {
    title: string;
  };
  notificationMessages: {
    success: {
      title: string;
      message: string;
    };
    error: {
      title: string;
      message: string;
    };
  };
  filterCondition: (payment: IMonthlyPayment) => boolean;
  onSubmitThunk: AsyncThunk<
    { message: string; installments: IInstallment[] },
    IPaymentUpdate[],
    { rejectValue: string }
  >;
  loading: boolean;
}

const PaymentsCard = ({
  title,
  button,
  empty,
  notificationMessages,
  filterCondition,
  onSubmitThunk,
  loading,
}: PaymentsCardProps) => {
  const dispatch = useAppDispatch();

  const { selectedInstallment } = useAppSelector((state) => state.installments);

  const [selectedPayments, setSelectedPayments] = useState<IPaymentUpdate[]>(
    []
  );

  const totalSelected = useMemo(
    () => sumByKeyDecimal(selectedPayments, 'paymentAmount'),
    [selectedPayments]
  );

  if (!selectedInstallment) return null;

  const handleToggleSelection = (paymentId: string, amount: number) => {
    setSelectedPayments((prev) =>
      prev.some((p) => p.paymentId === paymentId)
        ? prev.filter((p) => p.paymentId !== paymentId)
        : [
            ...prev,
            {
              installmentId: selectedInstallment._id,
              paymentId,
              paymentAmount: amount,
            },
          ]
    );
  };

  const handleSubmit = async () => {
    try {
      const response = await dispatch(onSubmitThunk(selectedPayments));

      if (onSubmitThunk.fulfilled.match(response)) {
        showNotification({
          title: notificationMessages.success.title,
          message: notificationMessages.success.message,
          color: 'green',
          icon: <Check />,
        });
        setSelectedPayments([]);
        dispatch(setSelectedInstallment(response.payload.installments[0]));
      } else {
        showNotification({
          title: notificationMessages.error.title,
          message: notificationMessages.error.message,
          color: 'red',
          icon: <X />,
        });
        console.error(response.payload);
      }
    } catch (err) {
      showNotification({
        title: notificationMessages.error.title,
        message: notificationMessages.error.message,
        color: 'red',
        icon: <X />,
      });
      console.error(err);
    }
  };

  const filteredPayments =
    selectedInstallment?.monthlyPayments.filter(filterCondition);

  return (
    <Card component={Stack} withBorder radius='sm' shadow='sm' gap='sm' p='lg'>
      <Group justify='space-between'>
        <Title size='md'>{title}</Title>
        <Tooltip label={button.tooltip}>
          <Button
            loading={loading}
            loaderProps={{
              children: <Loader size='sm' type='dots' color='white' />,
            }}
            key='pay'
            variant='filled'
            size='xs'
            color={button.color}
            disabled={!(totalSelected > 0)}
            onClick={handleSubmit}
            rightSection={
              totalSelected > 0 && (
                <Badge variant='white' color={button.color}>
                  {` ${totalSelected} ₼`}
                </Badge>
              )
            }
          >
            {button.label}
          </Button>
        </Tooltip>
      </Group>
      {filteredPayments.length > 0 ? (
        <Grid gutter='sm' className='relative'>
          <LoadingOverlay
            visible={loading}
            loaderProps={{ children: <></> }}
            className='rounded-md'
          />
          {filteredPayments.map((payment) => (
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }} key={payment._id}>
              <PaymentItem
                payment={payment}
                isSelected={selectedPayments.some(
                  (p) => p.paymentId === payment._id
                )}
                onToggle={() =>
                  handleToggleSelection(payment._id, payment.amount)
                }
              />
            </Grid.Col>
          ))}
        </Grid>
      ) : (
        <EmptyState icon title={empty.title} my='0' />
      )}
    </Card>
  );
};

export default PaymentsCard;
