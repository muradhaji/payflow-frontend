import { useState, useMemo } from 'react';
import {
  Button,
  Flex,
  Grid,
  Paper,
  Text,
  useMantineTheme,
} from '@mantine/core';
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronUp,
  IconFolderX,
} from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import EmptyState from '../../common/EmptyState/EmptyState';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../../hooks/useThemeColors';

interface MonthlyData {
  label: string;
  amount: number;
}

interface YearlyData {
  year: number;
  months: MonthlyData[];
}

interface MonthlyStatsProps {
  data: YearlyData[];
}

const MonthlyStats = ({ data }: MonthlyStatsProps) => {
  const { t } = useTranslation();
  const { themedColor } = useThemeColors();
  const { colors } = useMantineTheme();
  const isSmallScreen = useMediaQuery('(max-width: 36em)');

  const sortedData = useMemo(
    () => [...data].sort((a, b) => a.year - b.year),
    [data]
  );

  const currentYear = new Date().getFullYear();
  const initialYear = sortedData.reduce(
    (prev, curr) =>
      Math.abs(curr.year - currentYear) < Math.abs(prev.year - currentYear)
        ? curr
        : prev,
    { year: currentYear, months: [] }
  ).year;

  const [year, setYear] = useState(initialYear);

  const currentYearData = sortedData.find((d) => d.year === year) ?? {
    months: [],
  };

  const changeYear = (direction: 1 | -1) => {
    const index = sortedData.findIndex((d) => d.year === year);
    const newIndex = index + direction;
    if (newIndex >= 0 && newIndex < sortedData.length) {
      setYear(sortedData[newIndex].year);
    }
  };

  return (
    <Paper withBorder radius='sm' p='sm'>
      <Flex
        direction={{ base: 'column', xs: 'row' }}
        align={{ xs: 'stretch' }}
        gap='md'
      >
        <Flex
          direction={{ base: 'row-reverse', xs: 'column' }}
          justify='space-between'
          align='center'
          gap='md'
        >
          <Button
            variant='subtle'
            color={themedColor('blue', 'blue.4')}
            size='xs'
            disabled={
              !sortedData.length ||
              sortedData.findIndex((d) => d.year === year) ===
                sortedData.length - 1
            }
            onClick={() => changeYear(1)}
          >
            {isSmallScreen ? (
              <IconChevronRight size={20} />
            ) : (
              <IconChevronUp size={20} />
            )}
          </Button>

          <Text size='xl' fw={700} c={themedColor('blue', 'blue.4')}>
            {year}
          </Text>

          <Button
            variant='subtle'
            color={themedColor('blue', 'blue.4')}
            size='xs'
            disabled={
              !sortedData.length ||
              sortedData.findIndex((d) => d.year === year) === 0
            }
            onClick={() => changeYear(-1)}
          >
            {isSmallScreen ? (
              <IconChevronLeft size={20} />
            ) : (
              <IconChevronDown size={20} />
            )}
          </Button>
        </Flex>

        {currentYearData.months.length > 0 ? (
          <Grid flex={1} gutter='xs'>
            {currentYearData.months.map((month) => (
              <Grid.Col
                key={month.label}
                span={12 / Math.min(currentYearData.months.length, 4)}
              >
                <Paper
                  radius='sm'
                  shadow='md'
                  p='xs'
                  style={{
                    background: `linear-gradient(-60deg, ${themedColor(
                      colors.blue[3],
                      colors.dark[3]
                    )} 0%, ${themedColor(
                      colors.blue[5],
                      colors.dark[5]
                    )} 100%)`,
                  }}
                >
                  <Text ta='center' c='white' size='sm' fw={500}>
                    {month.label}
                  </Text>
                  <Text ta='center' c='white' size='xs' fw={600}>
                    {month.amount.toLocaleString()} ₼
                  </Text>
                </Paper>
              </Grid.Col>
            ))}
          </Grid>
        ) : (
          <Flex flex={1} align='center' justify='center'>
            <EmptyState
              icon={<IconFolderX size={32} color={colors.gray[5]} />}
              description={t('components.monthlyStats.empty.description', {
                year,
              })}
              my='0'
            />
          </Flex>
        )}
      </Flex>
    </Paper>
  );
};

export default MonthlyStats;
