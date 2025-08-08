import InstallmentCard from '../InstallmentCard/InstallmentCard';
import PageHeader from '../../common/PageHeader/PageHeader';
import { useAppSelector } from '../../../app/hooks';
import { Grid, Button, Tooltip, Skeleton } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import EmptyState from '../../common/EmptyState/EmptyState';

const AllInstallments = () => {
  const {
    installments,
    fetchInstallments: { loading: fetchInstallmentsLoading },
  } = useAppSelector((state) => state.installments);
  const { t } = useTranslation();

  return (
    <>
      <PageHeader
        title={t('components.installments.all.pageTitle')}
        breadcrumbs={[
          { label: t('breadcrumbs.payments'), to: '/payments' },
          {
            label: t('breadcrumbs.allPayments'),
            to: '/payments/all',
            active: true,
          },
        ]}
        actions={
          <Tooltip label={t('buttons.installment.add.tooltip')}>
            <Button
              leftSection={<Plus size={18} />}
              component={Link}
              to='/payments/add'
              variant='filled'
              size='xs'
            >
              {t('buttons.installment.add.label')}
            </Button>
          </Tooltip>
        }
      />

      <Skeleton visible={fetchInstallmentsLoading}>
        {installments.length === 0 ? (
          <EmptyState
            icon
            title={t('components.installments.all.empty.title')}
            description={t('components.installments.all.empty.description')}
          />
        ) : (
          <Grid gutter='lg'>
            {installments.map((installment) => (
              <Grid.Col key={installment._id} span={{ base: 12, sm: 6, md: 4 }}>
                <InstallmentCard installment={installment} withLink />
              </Grid.Col>
            ))}
          </Grid>
        )}
      </Skeleton>
    </>
  );
};

export default AllInstallments;
