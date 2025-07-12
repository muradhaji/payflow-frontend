import type { IInstallment } from '../../../types/installment';
import { Card, Text, Group, Badge, Flex, Slider } from '@mantine/core';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  getMostFrequentAmount,
  roundToTwoDecimals,
  sumByKeyDecimal,
} from '../../../utils/math';
import { Check } from 'lucide-react';

import styles from './InstallmentCard.module.css';
import utilStyles from '../../../styles/utils.module.css';

type InstallmentCardProps = {
  installment: IInstallment;
  withLink?: boolean;
};

const InstallmentCard = ({
  installment,
  withLink = false,
}: InstallmentCardProps) => {
  const { t } = useTranslation();

  const paidAmount = sumByKeyDecimal(
    installment.monthlyPayments.filter((p) => p.paid),
    'amount'
  );

  const remainingAmount = roundToTwoDecimals(installment.amount - paidAmount);

  const paidPercentage = roundToTwoDecimals(
    (paidAmount / installment.amount) * 100
  );

  const cardContent = (
    <>
      <Group justify='space-between' mb='xs'>
        <Text fw={700} size='lg'>
          {installment.title}
        </Text>
        {remainingAmount === 0 ? (
          <Badge color='teal' variant='light'>
            {t('installments.card.badge.paid')}
          </Badge>
        ) : (
          <Badge color='blue' variant='light'>
            {t('installments.card.badge.active')}
          </Badge>
        )}
      </Group>

      <Group justify='space-between' align='baseline' mb='xs'>
        <Text c='indigo' size='xl' fw={700} mb='xs'>
          {installment.amount} ₼
        </Text>
        <Group gap='0' align='baseline'>
          <Text c='gray' size='md' fw={700} mb='xs'>
            {installment.monthCount}x
          </Text>
          <Text c='gray.7' size='lg' fw={700} mb='xs'>
            {getMostFrequentAmount(
              installment.monthlyPayments.map((p) => p.amount)
            )}
            ₼
          </Text>
        </Group>
      </Group>

      <Flex justify='space-between' align='center' gap='xs'>
        <Text c={paidAmount > 0 ? 'teal' : 'gray'} size='md' fw={600}>
          {paidAmount} ₼
        </Text>
        <Text c='gray' size='md' fw={600}>
          {remainingAmount} ₼
        </Text>
      </Flex>

      <Slider
        thumbChildren={<Check />}
        color={paidAmount > 0 ? 'teal' : 'gray'}
        label={null}
        value={paidPercentage}
        thumbSize={20}
        className={utilStyles.pointerEventsNone}
        styles={{
          thumb: { borderWidth: 2, padding: 2 },
        }}
      />
    </>
  );

  if (withLink) {
    return (
      <Card
        shadow='sm'
        padding='lg'
        radius='sm'
        withBorder
        className={styles.card}
        component={Link}
        to={`/payments/details/${installment._id}`}
      >
        {cardContent}
      </Card>
    );
  }

  return (
    <Card
      shadow='sm'
      padding='lg'
      radius='sm'
      withBorder
      className={styles.card}
    >
      {cardContent}
    </Card>
  );
};

export default InstallmentCard;
