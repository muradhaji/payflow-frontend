import {
  Center,
  Flex,
  Paper,
  RingProgress,
  Stack,
  Text,
  useMantineTheme,
  type MantineColor,
} from '@mantine/core';

import { type TablerIcon } from '@tabler/icons-react';

import { Link, type LinkProps } from 'react-router-dom';

type StatsRingProps = {
  label: string;
  stats: number;
  percentage: number;
  color: MantineColor;
  Icon?: TablerIcon;
} & Pick<LinkProps, 'to'>;

const FilterCard = ({
  to,
  label,
  stats,
  percentage,
  color,
  Icon,
}: StatsRingProps) => {
  const theme = useMantineTheme();

  const [base, shade] = color.includes('.')
    ? (color.split('.') as [keyof typeof theme.colors, string])
    : [color as keyof typeof theme.colors, '6'];
  const parsedShade = parseInt(shade);
  const hexColor = theme.colors[base]?.[parsedShade] ?? color;

  return (
    <Paper component={Link} to={to} withBorder radius='sm' p='xs'>
      <Flex align='center' gap='sm' wrap='nowrap'>
        <RingProgress
          size={80}
          roundCaps
          thickness={8}
          sections={[{ value: percentage, color }]}
          label={
            Icon ? (
              <Center>
                <Icon size={24} color={hexColor} />
              </Center>
            ) : null
          }
        />

        <Stack gap={0}>
          <Text size='sm' fw={700}>
            {label}
          </Text>
          <Text fw={700} size='xl'>
            {stats} ₼
          </Text>
        </Stack>
      </Flex>
    </Paper>
  );
};

export default FilterCard;
