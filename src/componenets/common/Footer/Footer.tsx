import { Box, Text } from '@mantine/core';

import ResponsiveContainer from '../ResponsiveContainer/ResponsiveContainer';

import { useThemeColors } from '../../../hooks/useThemeColors';

function Footer() {
  const { themedColor } = useThemeColors();

  return (
    <Box p='sm' bg={themedColor('gray.1', 'dark.7')}>
      <ResponsiveContainer>
        <Text
          size='sm'
          c={themedColor('gray.7', 'gray.4')}
          ta={{ base: 'center', xs: 'left' }}
        >
          © 2025 | Murad Hajiyev
        </Text>
      </ResponsiveContainer>
    </Box>
  );
}

export default Footer;
