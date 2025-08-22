import {
  Switch,
  Text,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { IconMoonStars, IconSun } from '@tabler/icons-react';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { useEffect } from 'react';

const ThemeSwitch = () => {
  const { setColorScheme, colorScheme } = useMantineColorScheme();
  const { themedColor } = useThemeColors();
  const { colors } = useMantineTheme();

  useEffect(() => {
    const metaTheme = document.querySelector('meta[name=theme-color]');
    if (metaTheme) {
      metaTheme.setAttribute(
        'content',
        colorScheme === 'dark' ? '#141414' : '#ffffff'
      );
    }
  }, [colorScheme]);

  return (
    <Switch
      size='md'
      px='xs'
      label={
        <Text
          size='xs'
          fw={600}
          c={themedColor(colors.blue[6], colors.blue[4])}
        >
          THEME
        </Text>
      }
      labelPosition='left'
      onLabel={<IconSun size={16} stroke={2} color={colors.gray[0]} />}
      offLabel={<IconMoonStars size={16} stroke={2} color={colors.blue[6]} />}
      checked={colorScheme === 'light'}
      onChange={(e) => {
        setColorScheme(e.target.checked ? 'light' : 'dark');
      }}
      styles={{
        labelWrapper: {
          justifyContent: 'center',
        },
      }}
    />
  );
};

export default ThemeSwitch;
