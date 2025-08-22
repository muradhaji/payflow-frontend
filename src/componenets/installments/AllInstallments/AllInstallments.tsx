import { Grid, Button, Tooltip, Skeleton } from '@mantine/core';
import { IconLibraryPlus } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useAppSelector } from '../../../app/hooks';

import InstallmentCard from '../InstallmentCard/InstallmentCard';
import PageHeader from '../../common/PageHeader/PageHeader';
import EmptyState from '../../common/EmptyState/EmptyState';
import { useThemeColors } from '../../../hooks/useThemeColors';

const AllInstallments = () => {
  const {
    installments,
    fetchInstallments: { loading: fetchInstallmentsLoading },
  } = useAppSelector((state) => state.installments);
  const { t } = useTranslation();
  const { themedColor } = useThemeColors();

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
              leftSection={<IconLibraryPlus size={18} />}
              component={Link}
              to='/payments/add'
              variant='filled'
              color={themedColor('blue', 'blue.4')}
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
