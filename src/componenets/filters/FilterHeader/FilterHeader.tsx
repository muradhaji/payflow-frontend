import { Card, Group, Text } from '@mantine/core';

const colorMap: Record<string, string> = {
  overdue: 'red.5',
  current: 'orange.5',
  remaining: 'dark.5',
  paid: 'teal.5',
  default: 'indigo.5',
};

interface FilterHeaderProps {
  title: string;
  amount: number;
  type: 'overdue' | 'current' | 'remaining' | 'paid' | 'all';
}

const FilterHeader = ({ title, amount, type }: FilterHeaderProps) => {
  const color = colorMap[type] ?? colorMap.default;

  return (
    <Card shadow='sm' radius='sm' withBorder mb='md' px='md' py='sm' bg='white'>
      <Group justify='space-between' gap='md' wrap='wrap'>
        <Text size='lg' fw={700} c='gray.8' tt='uppercase'>
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
