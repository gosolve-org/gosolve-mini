import {
  defaultDarkTheme,
  defaultLightTheme,
  defaultNotificationBellDarkTheme,
  defaultNotificationBellLightTheme,
} from '../shared/config/themeDefaultValues';
import { ICommonTheme, INovuThemeProvider } from '../store/novu-theme-provider.context';
import { INotificationBellColors, INovuTheme } from '../store/novu-theme.context';
import { ColorScheme } from '../index';

interface IDefaultThemeProps {
  colorScheme?: ColorScheme;
}

export function getDefaultTheme(props: IDefaultThemeProps): {
  theme: INovuTheme;
} {
  const theme =
    props.colorScheme === 'light' ? defaultLightTheme : defaultDarkTheme;

  return {
    theme,
  };
}

interface IDefaultBellColors {
  colorScheme?: ColorScheme;
}

export function getDefaultBellColors(props: IDefaultBellColors): { bellColors: INotificationBellColors } {
  const colorScheme = props?.colorScheme ? props?.colorScheme : 'light';

  const bellColors =
    colorScheme === 'light' ? defaultNotificationBellLightTheme : defaultNotificationBellDarkTheme;

  return {
    bellColors,
  };
}
