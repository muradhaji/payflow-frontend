import { Menu, Button } from '@mantine/core';
import { IconWorld } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLang = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <Menu shadow='md' position='bottom-end'>
      <Menu.Target>
        <Button variant='light' leftSection={<IconWorld size={18} />} size='xs'>
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
