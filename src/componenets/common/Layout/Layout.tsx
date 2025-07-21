import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { Flex, Stack } from '@mantine/core';
import { Outlet } from 'react-router-dom';
import utilStyles from '../../../styles/utils.module.css';

export default function Layout() {
  return (
    <Stack bg='gray.2' mih='100dvh' gap={0}>
      <Header />
      <Flex direction='column' p='sm' className={utilStyles.flexFill}>
        <Outlet />
      </Flex>
      <Footer />
    </Stack>
  );
}
