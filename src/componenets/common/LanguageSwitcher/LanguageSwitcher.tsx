import { Menu, Button, useMantineTheme } from '@mantine/core';
import { IconWorld } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../../hooks/useThemeColors';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const { themedColor } = useThemeColors();
  const { colors } = useMantineTheme();

  const changeLang = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <Menu shadow='md' position='bottom-end'>
      <Menu.Target>
        <Button
          variant='subtle'
          color={themedColor(colors.blue[6], colors.blue[4])}
          justify='flex-start'
          leftSection={
            <IconWorld
              size={16}
              color={themedColor(colors.blue[6], colors.blue[4])}
            />
          }
          size='xs'
        >
          {i18n.language.toUpperCase()}
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item onClick={() => changeLang('az')}>AZ</Menu.Item>
        <Menu.Item onClick={() => changeLang('en')}>EN</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default LanguageSwitcher;
