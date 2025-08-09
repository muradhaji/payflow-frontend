import {
  Badge,
  Button,
  Card,
  Flex,
  Grid,
  Loader,
  LoadingOverlay,
  Stack,
  Title,
  Tooltip,
} from '@mantine/core';

import {
  IconCheck,
  IconSquareCheck,
  IconSquareCheckFilled,
  IconX,
} from '@tabler/icons-react';

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { showNotification } from '@mantine/notifications';

import { type ReactNode } from 'react';
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
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  const { selectedInstallment } = useAppSelector((state) => state.installments);

  const {
    isSelected,
    isAllSelected,
    selectedPayments,
    selectedPaymentsAmount,
    togglePayment,
    toggleAll,
    clearAll,
  } = useSelectedPayments({
    installments: selectedInstallment ? [selectedInstallment] : [],
  });

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
        clearAll();
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
      <Flex justify='space-between' align='center' wrap='wrap' gap='xs'>
        <Title size='md'>{title}</Title>
        <Flex flex={1} justify='flex-end' align='center' gap='xs' wrap='nowrap'>
          {filteredPayments.length > 1 && (
            <Tooltip label={t('buttons.selectAll.tooltip')}>
              <Button
                variant='light'
                size='xs'
                onClick={toggleAll}
                leftSection={
                  isAllSelected ? (
                    <IconSquareCheckFilled />
                  ) : (
                    <IconSquareCheck />
                  )
                }
              >
                {t('buttons.selectAll.label')}
              </Button>
            </Tooltip>
          )}
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
        </Flex>
      </Flex>
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
        <EmptyState icon={empty.icon} description={empty.title} my='0' />
      )}
    </Card>
  );
};

export default PaymentsCard;
