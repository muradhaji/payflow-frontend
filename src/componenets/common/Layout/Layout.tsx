import { Flex, Stack } from '@mantine/core';
import { Outlet } from 'react-router-dom';

import Header from '../Header/Header';
import Footer from '../Footer/Footer';

import utilStyles from '../../../styles/utils.module.css';
import { useThemeColors } from '../../../hooks/useThemeColors';

export default function Layout() {
  const { themedColor } = useThemeColors();

  return (
    <Stack bg={themedColor('gray.2', 'dark.9')} mih='100dvh' gap={0}>
      <Header />
      <Flex direction='column' p='sm' className={utilStyles.flexFill}>
        <Outlet />
      </Flex>
      <Footer />
    </Stack>
  );
}
