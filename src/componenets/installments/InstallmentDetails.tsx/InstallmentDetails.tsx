import type { ISelectedPayment } from '../../../types/installment';

import {
  Badge,
  Button,
  Card,
  Divider,
  Grid,
  Group,
  Skeleton,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import PageHeader from '../../common/PageHeader/PageHeader';
import EmptyState from '../../common/EmptyState/EmptyState';
import PaymentItem from '../PaymentItem/PaymentItem';
import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { getInstallmentById } from '../../../features/installments/installmentsSlice';
import { useTranslation } from 'react-i18next';

import dayjs from 'dayjs';
import { sumByKeyDecimal } from '../../../utils/math';

const InstallmentDetails = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();

  const { selectedInstallment, getInstallmentById: getByIdStatus } =
    useAppSelector((state) => state.installments);

  const [selectedPayments, setSelectedPayments] = useState<ISelectedPayment[]>(
    []
  );

  const totalSelected = useMemo(
    () => sumByKeyDecimal(selectedPayments, 'paymentAmount'),
    [selectedPayments]
  );

  useEffect(() => {
    if (id) dispatch(getInstallmentById(id));
  }, [dispatch, id]);

  const togglePaymentSelect = (paymentId: string, amount: number) => {
    setSelectedPayments((prev) =>
      prev.some((p) => p.paymentId === paymentId)
        ? prev.filter((p) => p.paymentId !== paymentId)
        : [...prev, { installmentId: id!, paymentId, paymentAmount: amount }]
    );
  };

  return (
    <>
      <PageHeader
        title={t('installments.details.pageTitle')}
        breadcrumbs={[
          { label: t('common.breadcrumbs.dashboard'), to: '/dashboard' },
          {
            label: t('common.breadcrumbs.details'),
            to: `/installments/details/${id}`,
            active: true,
          },
        ]}
        actions={[
          <Button
            key='edit'
            component={Link}
            to={`/payments/edit/${id}`}
            variant='light'
            size='xs'
          >
            {t('installments.details.buttons.edit.label')}
          </Button>,
          <Tooltip label={t('dashboard.filters.common.buttons.pay.tooltip')}>
            <Button
              key='pay'
              variant='filled'
              size='xs'
              disabled={!(totalSelected > 0)}
              onClick={() => console.info({ selectedPayments })}
              rightSection={
                totalSelected > 0 && (
                  <Badge variant='white' color='blue'>
                    {` ${totalSelected} ₼`}
                  </Badge>
                )
              }
            >
              {t('dashboard.filters.common.buttons.pay.label')}
            </Button>
          </Tooltip>,
        ]}
      />

      <Skeleton visible={getByIdStatus.loading}>
        {selectedInstallment ? (
          <Grid gutter='md'>
            <Grid.Col span={{ base: 12, xs: 6, md: 4 }}>
              <Card withBorder radius='sm' p='sm'>
                <Title size='xl' order={4} mb='sm'>
                  {selectedInstallment.title}
                </Title>

                <Divider mb='sm' />

                <Group justify='space-between'>
                  <Text c='dimmed'>
                    {t('installments.details.fields.amount')}:
                  </Text>
                  <Text fw={600} c='blue.7'>
                    {selectedInstallment.amount} ₼
                  </Text>
                </Group>

                <Group justify='space-between'>
                  <Text c='dimmed'>
                    {t('installments.details.fields.startDate')}:
                  </Text>
                  <Text fw={500}>
                    {dayjs(selectedInstallment.startDate).format('DD MMM YYYY')}
                  </Text>
                </Group>

                <Group justify='space-between'>
                  <Text c='dimmed'>
                    {t('installments.details.fields.createdAt')}:
                  </Text>
                  <Text fw={500}>
                    {dayjs(selectedInstallment.createdAt).format(
                      'HH:mm, DD MMM YYYY'
                    )}
                  </Text>
                </Group>

                <Group justify='space-between'>
                  <Text c='dimmed'>
                    {t('installments.details.fields.updatedAt')}:
                  </Text>
                  <Text fw={500}>
                    {dayjs(selectedInstallment.updatedAt).format(
                      'HH:mm, DD MMM YYYY'
                    )}
                  </Text>
                </Group>
              </Card>
            </Grid.Col>

            <Grid.Col span={{ base: 12, xs: 6, md: 8 }}>
              <Grid gutter='sm'>
                {selectedInstallment.monthlyPayments.map((payment) => (
                  <Grid.Col span={{ base: 12, md: 6, lg: 4 }} key={payment._id}>
                    <PaymentItem
                      payment={payment}
                      isSelected={selectedPayments.some(
                        (p) => p.paymentId === payment._id
                      )}
                      onToggle={() =>
                        togglePaymentSelect(payment._id, payment.amount)
                      }
                    />
                  </Grid.Col>
                ))}
              </Grid>
            </Grid.Col>
          </Grid>
        ) : (
          <EmptyState icon title description />
        )}
      </Skeleton>
    </>
  );
};

export default InstallmentDetails;
