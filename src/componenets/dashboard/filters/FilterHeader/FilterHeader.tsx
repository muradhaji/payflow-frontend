import { Card, Group, Text } from '@mantine/core';
import utilStyles from '../../../../styles/utils.module.css';

interface FilterHeaderProps {
  title: string;
  amount: number;
}

const FilterHeader = ({ title, amount }: FilterHeaderProps) => {
  return (
    <Card shadow='sm' radius='sm' withBorder mb='md' px='md' py='sm' bg='white'>
      <Group justify='space-between' gap='md' wrap='wrap'>
        <Text size='lg' fw={700} c='gray.8' className={utilStyles.capitalize}>
          {title}
        </Text>
        <Text size='md' fw={700} c='red.6'>
          {amount}₼
        </Text>
      </Group>
    </Card>
  );
};

export default FilterHeader;
