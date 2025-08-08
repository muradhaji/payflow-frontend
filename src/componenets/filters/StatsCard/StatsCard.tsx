import {
  Box,
  Group,
  Paper,
  Progress,
  SimpleGrid,
  Stack,
  Text,
} from '@mantine/core';

import { useTranslation } from 'react-i18next';

import { calculatePercentageDecimal } from '../../../utils/math';

import classes from './StatsCard.module.css';

type DebtStatsCardProps = {
  total: number;
  paid: number;
  remaining: number;
};

const StatsCard = ({ total, paid, remaining }: DebtStatsCardProps) => {
  const { t } = useTranslation();

  return (
    <Paper withBorder p='md' radius='sm'>
      <Stack gap='lg'>
        <Group gap='xs'>
          <Text fz='xl' fw={700}>
            {t('components.statsCard.totalLabel')}
          </Text>
          <Text fz='xl' fw={700}>
            ₼ {total}
          </Text>
        </Group>

        <Progress.Root size={24} classNames={{ label: classes.progressLabel }}>
          <Progress.Section value={paid} color='teal.5' key='paid'>
            {paid > 10 && (
              <Progress.Label>
                {calculatePercentageDecimal(paid, total)}%
              </Progress.Label>
            )}
          </Progress.Section>
          <Progress.Section value={remaining} color='red.5' key='remaining'>
            {remaining > 10 && (
              <Progress.Label>
                {calculatePercentageDecimal(remaining, total)}%
              </Progress.Label>
            )}
          </Progress.Section>
        </Progress.Root>

        <SimpleGrid cols={{ base: 1, xs: 2 }}>
          <Box
            key='paid'
            style={{
              borderBottomColor: `var(--mantine-color-teal-6)`,
            }}
            className={classes.stat}
          >
            <Text fz='xs' c='dimmed' fw={700}>
              {t('components.statsCard.paid')}
            </Text>
            <Group justify='space-between' align='flex-end' gap={0}>
              <Text fw={700}>{paid} ₼</Text>
              <Text c='teal.5' fw={700} size='sm' className={classes.statCount}>
                {calculatePercentageDecimal(paid, total)}%
              </Text>
            </Group>
          </Box>
          <Box
            key='remaining'
            style={{
              borderBottomColor: `var(--mantine-color-red-5)`,
            }}
            className={classes.stat}
          >
            <Text fz='xs' c='dimmed' fw={700}>
              {t('components.statsCard.remaining')}
            </Text>

            <Group justify='space-between' align='flex-end' gap={0}>
              <Text fw={700}>{remaining} ₼</Text>
              <Text c='red.5' fw={700} size='sm' className={classes.statCount}>
                {calculatePercentageDecimal(remaining, total)}%
              </Text>
            </Group>
          </Box>
        </SimpleGrid>
      </Stack>
    </Paper>
  );
};

export default StatsCard;
