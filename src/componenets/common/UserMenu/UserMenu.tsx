import { Menu, Button, Stack } from '@mantine/core';
import { IconUser, IconWallet } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import LogOutButton from '../LogOutButton/LogOutButton';
import { useAuth } from '../../../hooks/useAuth';

const UserMenu = () => {
  const { isAuthenticated, user } = useAuth();
  const { t } = useTranslation();

  return (
    <Menu shadow='md' position='bottom-end'>
      <Menu.Target>
        <Button
          variant='filled'
          leftSection={<IconUser size={18} />}
          size='xs'
          tt='uppercase'
        >
          {isAuthenticated && user ? user.username : t('buttons.profile.label')}
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Stack gap='0'>
          <Button
            component={Link}
            to='/payments'
            leftSection={<IconWallet size={16} />}
            variant='subtle'
            size='xs'
            justify='space-between'
          >
            {t('buttons.payments.label')}
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
