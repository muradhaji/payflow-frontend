import { Box, Text } from '@mantine/core';
import ResponsiveContainer from '../ResponsiveContainer/ResponsiveContainer';

function Footer() {
  return (
    <Box p='sm' bg='gray.1'>
      <ResponsiveContainer>
        <Text size='sm' c='gray.7' ta={{ base: 'center', xs: 'left' }}>
          © 2025 | Murad Hajiyev
        </Text>
      </ResponsiveContainer>
    </Box>
  );
}

export default Footer;
