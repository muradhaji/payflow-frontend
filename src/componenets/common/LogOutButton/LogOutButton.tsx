import { useTranslation } from 'react-i18next';
import { Button } from '@mantine/core';
import { IconLogout } from '@tabler/icons-react';

import { useAppDispatch } from '../../../app/hooks';
import { logout } from '../../../features/auth/authSlice';
import { persistor } from '../../../app/store';

function LogOutButton() {
  const dispatch = useAppDispatch();

  const { t } = useTranslation();

  const handleLogout = () => {
    dispatch(logout());
    persistor.purge();
  };

  return (
    <Button
      onClick={handleLogout}
      variant='subtle'
      leftSection={<IconLogout size={16} color='red' />}
      color='red'
      size='xs'
      justify='flex-start'
    >
      {t('buttons.logout.label')}
    </Button>
  );
}

export default LogOutButton;
