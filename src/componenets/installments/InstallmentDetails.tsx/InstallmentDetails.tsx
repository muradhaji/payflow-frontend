import { useEffect, useMemo } from 'react';
import dayjs from 'dayjs';

import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import {
  Button,
  Card,
  Grid,
  Group,
  Loader,
  Skeleton,
  Stack,
  Text,
} from '@mantine/core';

import { Check, X } from 'lucide-react';
import { showNotification } from '@mantine/notifications';

import { useAppDispatch, useAppSelector } from '../../../app/hooks';

import {
  deleteInstallment,
  fetchInstallments,
  getInstallmentById,
} from '../../../features/installments/installmentsSlice';

import PageHeader from '../../common/PageHeader/PageHeader';
import EmptyState from '../../common/EmptyState/EmptyState';
import InstallmentCard from '../InstallmentCard/InstallmentCard';
import PaidPayments from './PaidPayments';
import UnpaidPayments from './UnpaidPayments';

import utilStyles from '../../../styles/utils.module.css';

const InstallmentDetails = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();

  const {
    selectedInstallment,
    getInstallmentById: { loading: getByIdLoading },
    deleteInstallment: { loading: deleteLoading },
  } = useAppSelector((state) => state.installments);

  useEffect(() => {
    if (id) {
      dispatch(getInstallmentById(id));
    }
  }, [dispatch, id]);

  const dateFields = useMemo(
    () => [
      {
        label: t('components.installments.details.label.startDate'),
        date: selectedInstallment?.startDate,
        format: 'DD MMM YYYY',
      },
      {
        label: t('components.installments.details.label.createdAt'),
        date: selectedInstallment?.createdAt,
        format: 'HH:mm, DD MMM YYYY',
      },
      {
        label: t('components.installments.details.label.updatedAt'),
        date: selectedInstallment?.updatedAt,
        format: 'HH:mm, DD MMM YYYY',
      },
    ],
    [selectedInstallment, t]
  );

  const handleDelete = async () => {
    if (!selectedInstallment) return;

    const result = await dispatch(deleteInstallment(selectedInstallment._id));

    if (deleteInstallment.fulfilled.match(result)) {
      showNotification({
        title: t('notifications.api.installment.delete.success.title'),
        message: t('notifications.api.installment.delete.success.message'),
        color: 'green',
        icon: <Check />,
      });
      dispatch(fetchInstallments());
      navigate('/payments');
    } else {
      showNotification({
        title: t('notifications.api.installment.delete.error.title'),
        message: t('notifications.api.installment.delete.error.message'),
        color: 'red',
        icon: <X />,
      });
    }
  };

  return (
    <>
      <PageHeader
        title={t('components.installments.details.pageTitle')}
        breadcrumbs={[
          { label: t('breadcrumbs.payments'), to: '/payments' },
          {
            label: t('breadcrumbs.details'),
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
            {t('buttons.installment.edit.label')}
          </Button>,
          <Button
            key='edit'
            variant='light'
            color='red'
            size='xs'
            onClick={handleDelete}
            loading={deleteLoading}
            loaderProps={{
              children: <Loader size='sm' type='dots' color='white' />,
            }}
          >
            {t('buttons.installment.delete.label')}
          </Button>,
        ]}
      />

      <Skeleton visible={getByIdLoading}>
        {selectedInstallment ? (
          <Grid gutter='md'>
            <Grid.Col span={{ base: 12, xs: 6, md: 4 }}>
              <Stack gap='md'>
                <InstallmentCard installment={selectedInstallment} />

                <Card withBorder radius='sm' p='lg' shadow='sm'>
                  {dateFields.map(({ label, date }) => (
                    <Group justify='space-between' key={label}>
                      <Text c='dimmed'>{label}:</Text>
                      <Text fw={500} className={utilStyles.capitalize}>
                        {dayjs(date).format(
                          label ===
                            t('components.installments.details.label.startDate')
                            ? 'DD MMM YYYY'
                            : 'HH:mm, DD MMM YYYY'
                        )}
                      </Text>
                    </Group>
                  ))}
                </Card>
              </Stack>
            </Grid.Col>

            <Grid.Col span={{ base: 12, xs: 6, md: 8 }}>
              <Stack gap='md'>
                <PaidPayments />
                <UnpaidPayments />
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
