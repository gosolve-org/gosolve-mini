import { useContext } from 'react';
import { ColorScheme } from '../index';
import { INovuTheme, ThemeContext } from '../store/novu-theme.context';

export function useNovuTheme(): {
  theme: INovuTheme;
  colorScheme: ColorScheme;
} {
  const { colorScheme, theme } = useContext(ThemeContext);

  return {
    colorScheme,
    theme,
  };
}
