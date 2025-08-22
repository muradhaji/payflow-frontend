import { useMantineColorScheme, type MantineColor } from '@mantine/core';
import { useCallback } from 'react';

export function useThemeColors() {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const themedColor = useCallback(
    (lightColor: MantineColor, darkColor: MantineColor) =>
      isDark ? darkColor : lightColor,
    [isDark]
  );

  return { isDark, themedColor };
}
