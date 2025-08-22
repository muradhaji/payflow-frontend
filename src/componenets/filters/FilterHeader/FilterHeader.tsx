import { Card, Group, Text } from '@mantine/core';
import { useThemeColors } from '../../../hooks/useThemeColors';

const colorMap: Record<string, string> = {
  overdue: 'red.5',
  current: 'orange.5',
  paid: 'teal.5',
  default: 'indigo.5',
};

interface FilterHeaderProps {
  title: string;
  amount: number;
  type: 'overdue' | 'current' | 'remaining' | 'paid' | 'all';
}

const FilterHeader = ({ title, amount, type }: FilterHeaderProps) => {
  const { themedColor } = useThemeColors();

  const color =
    type === 'remaining'
      ? themedColor('dark.5', 'gray.3')
      : colorMap[type] ?? colorMap.default;

  return (
    <Card shadow='sm' radius='sm' withBorder mb='md' px='md' py='sm'>
      <Group justify='space-between' gap='md' wrap='wrap'>
        <Text size='lg' fw={700} tt='uppercase'>
          {title}
        </Text>
        <Text size='md' fw={700} c={color}>
          {amount}₼
        </Text>
      </Group>
    </Card>
  );
};

export default FilterHeader;
