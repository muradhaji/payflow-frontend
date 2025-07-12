import { useEffect, useMemo } from 'react';
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

import dayjs from 'dayjs';

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
import { showNotification } from '@mantine/notifications';
import { Check, X } from 'lucide-react';

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
        label: t('installments.details.fields.startDate'),
        date: selectedInstallment?.startDate,
        format: 'DD MMM YYYY',
      },
      {
        label: t('installments.details.fields.createdAt'),
        date: selectedInstallment?.createdAt,
        format: 'HH:mm, DD MMM YYYY',
      },
      {
        label: t('installments.details.fields.updatedAt'),
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
        title: t('installments.details.notifications.delete.success.title'),
        message: t('installments.details.notifications.delete.success.message'),
        color: 'green',
        icon: <Check />,
      });
      dispatch(fetchInstallments());
      navigate('/dashboard');
    } else {
      showNotification({
        title: t('installments.details.notifications.delete.error.title'),
        message: t('installments.details.notifications.delete.error.message'),
        color: 'red',
        icon: <X />,
      });
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
            {t('installments.details.buttons.delete.label')}
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
                          label === t('installments.details.fields.startDate')
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
