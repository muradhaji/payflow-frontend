import type { IPaymentUpdate } from '../../../types/installment';

import {
  Badge,
  Button,
  Card,
  Grid,
  Group,
  LoadingOverlay,
  Loader,
  Skeleton,
  Stack,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import PageHeader from '../../common/PageHeader/PageHeader';
import EmptyState from '../../common/EmptyState/EmptyState';
import PaymentItem from '../PaymentItem/PaymentItem';
import InstallmentCard from '../InstallmentCard/InstallmentCard';
import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  getInstallmentById,
  setSelectedInstallment,
  togglePaymentStatus,
} from '../../../features/installments/installmentsSlice';
import { useTranslation } from 'react-i18next';

import dayjs from 'dayjs';
import { sumByKeyDecimal } from '../../../utils/math';

import utilStyles from '../../../styles/utils.module.css';
import { Check, X } from 'lucide-react';
import { showNotification } from '@mantine/notifications';

const InstallmentDetails = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();

  const {
    selectedInstallment,
    getInstallmentById: getByIdStatus,
    togglePaymentStatus: toggleStatus,
  } = useAppSelector((state) => state.installments);

  const [selectedPaidPayments, setSelectedPaidPayments] = useState<
    IPaymentUpdate[]
  >([]);

  const [selectedUnpaidPayments, setSelectedUnpaidPayments] = useState<
    IPaymentUpdate[]
  >([]);

  const totalSelectedPaid = useMemo(
    () => sumByKeyDecimal(selectedPaidPayments, 'paymentAmount'),
    [selectedPaidPayments]
  );

  const totalSelectedUnpaid = useMemo(
    () => sumByKeyDecimal(selectedUnpaidPayments, 'paymentAmount'),
    [selectedUnpaidPayments]
  );

  useEffect(() => {
    if (id) dispatch(getInstallmentById(id));
  }, [dispatch, id]);

  const togglePaidPaymentSelect = (paymentId: string, amount: number) => {
    setSelectedPaidPayments((prev) =>
      prev.some((p) => p.paymentId === paymentId)
        ? prev.filter((p) => p.paymentId !== paymentId)
        : [...prev, { installmentId: id!, paymentId, paymentAmount: amount }]
    );
  };

  const toggleUnpaidPaymentSelect = (paymentId: string, amount: number) => {
    setSelectedUnpaidPayments((prev) =>
      prev.some((p) => p.paymentId === paymentId)
        ? prev.filter((p) => p.paymentId !== paymentId)
        : [...prev, { installmentId: id!, paymentId, paymentAmount: amount }]
    );
  };

  const handleCancel = async () => {
    try {
      const response = await dispatch(
        togglePaymentStatus(selectedPaidPayments)
      );

      if (togglePaymentStatus.fulfilled.match(response)) {
        showNotification({
          title: 'Success Title',
          message: 'Message',
          color: 'green',
          icon: <Check />,
        });
        setSelectedPaidPayments([]);
        setSelectedUnpaidPayments([]);
        dispatch(setSelectedInstallment(response.payload.installments[0]));
      } else {
        showNotification({
          title: 'Error Title',
          message: 'Message',
          color: 'red',
          icon: <X />,
        });
        console.error(response.payload);
      }
    } catch (err) {
      showNotification({
        title: 'Error Title',
        message: 'Message',
        color: 'red',
        icon: <X />,
      });
      console.error(err);
    }
  };

  const handleComplete = async () => {
    try {
      const response = await dispatch(
        togglePaymentStatus(selectedUnpaidPayments)
      );

      if (togglePaymentStatus.fulfilled.match(response)) {
        showNotification({
          title: 'Success Title',
          message: 'Message',
          color: 'green',
          icon: <Check />,
        });
        setSelectedPaidPayments([]);
        setSelectedUnpaidPayments([]);
        dispatch(setSelectedInstallment(response.payload.installments[0]));
      } else {
        showNotification({
          title: 'Error Title',
          message: 'Message',
          color: 'red',
          icon: <X />,
        });
        console.error(response.payload);
      }
    } catch (err) {
      showNotification({
        title: 'Error Title',
        message: 'Message',
        color: 'red',
        icon: <X />,
      });
      console.error(err);
    }
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
        ]}
      />

      <Skeleton visible={getByIdStatus.loading}>
        {selectedInstallment ? (
          <Grid gutter='md'>
            <Grid.Col span={{ base: 12, xs: 6, md: 4 }}>
              <Stack gap='md'>
                <InstallmentCard installment={selectedInstallment} />

                <Card withBorder radius='sm' p='lg' shadow='sm'>
                  <Group justify='space-between'>
                    <Text c='dimmed'>
                      {t('installments.details.fields.startDate')}:
                    </Text>
                    <Text fw={500} className={utilStyles.capitalize}>
                      {dayjs(selectedInstallment.startDate).format(
                        'DD MMM YYYY'
                      )}
                    </Text>
                  </Group>

                  <Group justify='space-between'>
                    <Text c='dimmed'>
                      {t('installments.details.fields.createdAt')}:
                    </Text>
                    <Text fw={500} className={utilStyles.capitalize}>
                      {dayjs(selectedInstallment.createdAt).format(
                        'HH:mm, DD MMM YYYY'
                      )}
                    </Text>
                  </Group>

                  <Group justify='space-between'>
                    <Text c='dimmed'>
                      {t('installments.details.fields.updatedAt')}:
                    </Text>
                    <Text fw={500} className={utilStyles.capitalize}>
                      {dayjs(selectedInstallment.updatedAt).format(
                        'HH:mm, DD MMM YYYY'
                      )}
                    </Text>
                  </Group>
                </Card>
              </Stack>
            </Grid.Col>

            <Grid.Col span={{ base: 12, xs: 6, md: 8 }}>
              <Stack gap='md'>
                <Card
                  component={Stack}
                  withBorder
                  radius='sm'
                  shadow='sm'
                  gap='sm'
                  p='lg'
                  className='relative'
                >
                  <LoadingOverlay
                    visible={toggleStatus.loading}
                    loaderProps={{ children: <Loader size='sm' type='dots' /> }}
                    className='rounded-md'
                  />
                  <Group justify='space-between'>
                    <Title size='md'>
                      {t('installments.details.payments.paid.cardTitle')}
                    </Title>
                    <Tooltip
                      label={t('installments.details.buttons.cancel.tooltip')}
                    >
                      <Button
                        key='pay'
                        variant='filled'
                        size='xs'
                        color='red'
                        disabled={!(totalSelectedPaid > 0)}
                        onClick={handleCancel}
                        rightSection={
                          totalSelectedPaid > 0 && (
                            <Badge variant='white' color='red'>
                              {` ${totalSelectedPaid} ₼`}
                            </Badge>
                          )
                        }
                      >
                        {t('installments.details.buttons.cancel.label')}
                      </Button>
                    </Tooltip>
                  </Group>
                  {selectedInstallment.monthlyPayments.filter(
                    (payment) => payment.paid
                  ).length > 0 ? (
                    <Grid gutter='sm'>
                      {selectedInstallment.monthlyPayments
                        .filter((payment) => payment.paid)
                        .map((payment) => (
                          <Grid.Col
                            span={{ base: 12, md: 6, lg: 4 }}
                            key={payment._id}
                          >
                            <PaymentItem
                              payment={payment}
                              isSelected={selectedPaidPayments.some(
                                (p) => p.paymentId === payment._id
                              )}
                              onToggle={() =>
                                togglePaidPaymentSelect(
                                  payment._id,
                                  payment.amount
                                )
                              }
                            />
                          </Grid.Col>
                        ))}
                    </Grid>
                  ) : (
                    <EmptyState
                      icon
                      title={t(
                        'installments.details.payments.paid.empty.title'
                      )}
                      my='0'
                    />
                  )}
                </Card>

                <Card
                  component={Stack}
                  withBorder
                  radius='sm'
                  shadow='sm'
                  gap='sm'
                  p='lg'
                  className='relative'
                >
                  <LoadingOverlay
                    visible={toggleStatus.loading}
                    loaderProps={{ children: <Loader size='sm' type='dots' /> }}
                    className='rounded-md'
                  />
                  <Group justify='space-between'>
                    <Title size='md'>
                      {t('installments.details.payments.unpaid.cardTitle')}
                    </Title>
                    <Tooltip
                      label={t('installments.details.buttons.pay.tooltip')}
                    >
                      <Button
                        key='pay'
                        variant='filled'
                        size='xs'
                        disabled={!(totalSelectedUnpaid > 0)}
                        onClick={handleComplete}
                        rightSection={
                          totalSelectedUnpaid > 0 && (
                            <Badge variant='white' color='blue'>
                              {` ${totalSelectedUnpaid} ₼`}
                            </Badge>
                          )
                        }
                      >
                        {t('installments.details.buttons.pay.label')}
                      </Button>
                    </Tooltip>
                  </Group>
                  {selectedInstallment.monthlyPayments.filter(
                    (payment) => !payment.paid
                  ).length > 0 ? (
                    <Grid gutter='sm'>
                      {selectedInstallment.monthlyPayments
                        .filter((payment) => !payment.paid)
                        .map((payment) => (
                          <Grid.Col
                            span={{ base: 12, md: 6, lg: 4 }}
                            key={payment._id}
                          >
                            <PaymentItem
                              payment={payment}
                              isSelected={selectedUnpaidPayments.some(
                                (p) => p.paymentId === payment._id
                              )}
                              onToggle={() =>
                                toggleUnpaidPaymentSelect(
                                  payment._id,
                                  payment.amount
                                )
                              }
                            />
                          </Grid.Col>
                        ))}
                    </Grid>
                  ) : (
                    <EmptyState
                      icon
                      title={t(
                        'installments.details.payments.unpaid.empty.title'
                      )}
                      my='0'
                    />
                  )}
                </Card>
              </Stack>
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
