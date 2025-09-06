import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Menu, Button, Stack, useMantineTheme } from '@mantine/core';

import {
  IconLogin,
  IconMenu2,
  IconUserX,
  IconWallet,
} from '@tabler/icons-react';

import { useAuth } from '../../../hooks/useAuth';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { useAppDispatch } from '../../../app/hooks';

import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import LogOutButton from '../LogOutButton/LogOutButton';
import ThemeSwitch from '../ThemeSwitch/ThemeSwitch';

import { openDeleteModal } from '../../../features/auth/authSlice';

const UserMenu = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAuth();
  const { t } = useTranslation();
  const { themedColor } = useThemeColors();
  const { colors } = useMantineTheme();

  return (
    <Menu shadow='md' position='bottom-end'>
      <Menu.Target>
        <Button
          variant='filled'
          color={themedColor(colors.blue[6], colors.blue[4])}
          rightSection={<IconMenu2 size={18} />}
          size='xs'
          tt='uppercase'
        >
          {isAuthenticated && user ? user.username : t('buttons.menu.label')}
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Stack gap='0'>
          <Button
            component={Link}
            to='/payments'
            leftSection={
              <IconWallet
                size={16}
                color={themedColor(colors.blue[6], colors.blue[4])}
              />
            }
            variant='subtle'
            color={themedColor(colors.blue[6], colors.blue[4])}
            size='xs'
            justify='flex-start'
          >
            {t('buttons.payments.label')}
          </Button>

          <Menu.Divider />

          <Stack gap='xs'>
            <LanguageSwitcher />
            <ThemeSwitch />
          </Stack>

          <Menu.Divider />

          {isAuthenticated ? (
            <>
              <Button
                onClick={() => {
                  dispatch(openDeleteModal());
                }}
                variant='subtle'
                leftSection={
                  <IconUserX
                    size={16}
                    color={themedColor(colors.red[6], colors.red[4])}
                  />
                }
                color={themedColor(colors.red[6], colors.red[4])}
                size='xs'
                justify='flex-start'
              >
                {t('buttons.deleteUser.label')}
              </Button>

              <LogOutButton />
            </>
          ) : (
            <Button
              variant='subtle'
              color={themedColor(colors.blue[6], colors.blue[4])}
              justify='flex-start'
              leftSection={
                <IconLogin
                  size={16}
                  color={themedColor(colors.blue[6], colors.blue[4])}
                />
              }
              component={Link}
              to='/login'
              size='xs'
            >
              {t('buttons.login.label')}
            </Button>
          )}
        </Stack>
      </Menu.Dropdown>
    </Menu>
  );
};

export default UserMenu;
