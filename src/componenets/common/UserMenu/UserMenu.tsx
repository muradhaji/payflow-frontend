import { Menu, Button, Stack } from '@mantine/core';
import { LayoutDashboard, UserRound } from 'lucide-react';
import LogOutButton from '../LogOutButton/LogOutButton';
import { useAuth } from '../../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const UserMenu = () => {
  const { isAuthenticated, user } = useAuth();
  const { t } = useTranslation();

  return (
    <Menu shadow='md' position='bottom-end'>
      <Menu.Target>
        <Button
          variant='filled'
          leftSection={<UserRound size={18} />}
          size='xs'
        >
          {isAuthenticated && user ? user.username.toUpperCase() : 'Profile'}
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Stack gap='0'>
          <Button
            component={Link}
            to='/dashboard'
            leftSection={<LayoutDashboard size={14} />}
            variant='subtle'
            size='xs'
          >
            {t('common.buttons.dashboard.label')}
          </Button>
          <Menu.Divider />
          <Menu.Target>
            <LogOutButton />
          </Menu.Target>
        </Stack>
      </Menu.Dropdown>
    </Menu>
  );
};

export default UserMenu;
