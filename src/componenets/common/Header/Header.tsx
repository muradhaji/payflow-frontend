import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Card, Flex, Text, Title } from '@mantine/core';
import { showNotification } from '@mantine/notifications';

import { IconCheck, IconX } from '@tabler/icons-react';

import { useThemeColors } from '../../../hooks/useThemeColors';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';

import UserMenu from '../UserMenu/UserMenu';
import ResponsiveContainer from '../ResponsiveContainer/ResponsiveContainer';
import DeleteUserModal from '../DeleteUser/DeleteUserModal';

import {
  closeDeleteModal,
  deleteMe,
  logout,
} from '../../../features/auth/authSlice';
import { persistor } from '../../../app/store';

import type { DeleteCredentials } from '../../../types/auth';

import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../../constants/messages';

function Header() {
  const { t } = useTranslation();
  const { themedColor } = useThemeColors();

  const dispatch = useAppDispatch();
  const { modalOpened, loading } = useAppSelector((state) => state.auth.delete);

  const handleDelete = async (data: DeleteCredentials) => {
    const result = await dispatch(deleteMe(data));

    if (deleteMe.fulfilled.match(result)) {
      showNotification({
        message: t(
          `apiSuccessMessages.${
            result.payload?.message || SUCCESS_MESSAGES.COMMON
          }`
        ),
        color: 'green',
        icon: <IconCheck />,
      });
      dispatch(closeDeleteModal());
      dispatch(logout());
      persistor.purge();
    } else {
      showNotification({
        message: t(
          `apiErrorMessages.${result.payload || ERROR_MESSAGES.UNKNOWN}`
        ),
        color: 'red',
        icon: <IconX />,
      });
    }
  };

  return (
    <>
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
      <DeleteUserModal
        opened={modalOpened}
        onClose={() => {
          dispatch(closeDeleteModal());
        }}
        onConfirm={handleDelete}
        confirmLoading={loading}
      />
    </>
  );
}

export default Header;
