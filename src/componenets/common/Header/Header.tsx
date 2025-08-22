import { Link } from 'react-router-dom';

import { Card, Flex, Text, Title } from '@mantine/core';

import UserMenu from '../UserMenu/UserMenu';
import ResponsiveContainer from '../ResponsiveContainer/ResponsiveContainer';
import { useThemeColors } from '../../../hooks/useThemeColors';

function Header() {
  const { themedColor } = useThemeColors();

  return (
    <Card bg={themedColor('gray.1', 'dark.7')} radius={0} p='sm' shadow='lg'>
      <ResponsiveContainer>
        <Flex justify='space-between' align='center'>
          <Link to='/'>
            <Title order={2} size='h2' fw={700}>
              <Text c={themedColor('blue', 'blue.4')} span inherit>
                Pay
              </Text>
              <Text c={themedColor('gray.9', 'dark.0')} span inherit>
                Flow
              </Text>
            </Title>
          </Link>

          <UserMenu />
        </Flex>
      </ResponsiveContainer>
    </Card>
  );
}

export default Header;
