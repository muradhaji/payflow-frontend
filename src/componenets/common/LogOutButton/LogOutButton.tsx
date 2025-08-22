import { useTranslation } from 'react-i18next';
import { Button, useMantineTheme } from '@mantine/core';
import { IconLogout } from '@tabler/icons-react';

import { useAppDispatch } from '../../../app/hooks';
import { logout } from '../../../features/auth/authSlice';
import { persistor } from '../../../app/store';
import { useThemeColors } from '../../../hooks/useThemeColors';

function LogOutButton() {
  const dispatch = useAppDispatch();

  const { t } = useTranslation();
  const { themedColor } = useThemeColors();
  const { colors } = useMantineTheme();

  const handleLogout = () => {
    dispatch(logout());
    persistor.purge();
  };

  return (
    <Button
      onClick={handleLogout}
      variant='subtle'
      leftSection={
        <IconLogout
          size={16}
          color={themedColor(colors.red[6], colors.red[4])}
        />
      }
      color={themedColor(colors.red[6], colors.red[4])}
      size='xs'
      justify='flex-start'
    >
      {t('buttons.logout.label')}
    </Button>
  );
}

export default LogOutButton;
