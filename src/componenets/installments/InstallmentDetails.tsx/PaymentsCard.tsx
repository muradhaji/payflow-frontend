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

import { IconCheck, IconX } from '@tabler/icons-react';

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { showNotification } from '@mantine/notifications';

import type { ReactNode } from 'react';
import type { AsyncThunk } from '@reduxjs/toolkit';
import type {
  IPaymentUpdate,
  IMonthlyPayment,
  IInstallment,
} from '../../../types/installment';

import PaymentItem from '../PaymentItem/PaymentItem';
import EmptyState from '../../common/EmptyState/EmptyState';
import { setSelectedInstallment } from '../../../features/installments/installmentsSlice';
import { useSelectedPayments } from '../../../hooks/useSelectedPayments';

import utilStyles from '../../../styles/utils.module.css';

interface PaymentsCardProps {
  title: string;
  button: {
    label: string;
    tooltip: string;
    color: string;
  };
  empty: {
    icon?: ReactNode;
    title: string;
  };
  notificationMessages: {
    success: string;
    error: string;
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

  const {
    selectedPayments,
    selectedPaymentsAmount,
    togglePayment,
    resetAll,
    isSelected,
  } = useSelectedPayments();

  const { selectedInstallment } = useAppSelector((state) => state.installments);

  if (!selectedInstallment) return null;

  const handleSubmit = async () => {
    try {
      const response = await dispatch(onSubmitThunk(selectedPayments));

      if (onSubmitThunk.fulfilled.match(response)) {
        showNotification({
          message: notificationMessages.success,
          color: 'green',
          icon: <IconCheck />,
        });
        resetAll();
        dispatch(setSelectedInstallment(response.payload.installments[0]));
      } else {
        showNotification({
          message: notificationMessages.error,
          color: 'red',
          icon: <IconX />,
        });
        console.error(response.payload);
      }
    } catch (err) {
      showNotification({
        message: notificationMessages.error,
        color: 'red',
        icon: <IconX />,
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
            disabled={!(selectedPaymentsAmount > 0)}
            onClick={handleSubmit}
            rightSection={
              selectedPaymentsAmount > 0 && (
                <Badge variant='white' color={button.color}>
                  {` ${selectedPaymentsAmount} ₼`}
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
            className={utilStyles.radiusSm}
          />
          {filteredPayments.map((payment) => (
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }} key={payment._id}>
              <PaymentItem
                payment={payment}
                isSelected={isSelected(payment._id)}
                onToggle={(paymentId, paymentAmount) =>
                  togglePayment({
                    installmentId: selectedInstallment._id,
                    paymentId,
                    paymentAmount,
                  })
                }
              />
            </Grid.Col>
          ))}
        </Grid>
      ) : (
        <EmptyState icon={empty.icon} title={empty.title} my='0' />
      )}
    </Card>
  );
};

export default PaymentsCard;
