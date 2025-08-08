import { Card, Group, Text } from '@mantine/core';
import utilStyles from '../../../styles/utils.module.css';

const colorMap: Record<string, string> = {
  current: 'red',
  remaining: 'orange',
  paid: 'green',
  default: 'gray',
};

interface FilterHeaderProps {
  title: string;
  amount: number;
  type: 'current' | 'remaining' | 'paid' | 'all';
}

const FilterHeader = ({ title, amount, type }: FilterHeaderProps) => {
  const color = colorMap[type] ?? colorMap.default;

  return (
    <Card shadow='sm' radius='sm' withBorder mb='md' px='md' py='sm' bg='white'>
      <Group justify='space-between' gap='md' wrap='wrap'>
        <Text size='lg' fw={700} c='gray.8' className={utilStyles.capitalize}>
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
