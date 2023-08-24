import React from 'react';
import { INovuPopoverTheme, INovuTheme, ThemeContext } from './novu-theme.context';
import { ColorScheme } from '../index';
import { getDefaultTheme } from '../utils/defaultTheme';

export interface INovuThemePopoverProvider {
  light?: INovuPopoverTheme;
  dark?: INovuPopoverTheme;
  common?: ICommonTheme;
}

export interface INovuThemeProvider {
  light?: INovuTheme;
  dark?: INovuTheme;
  common?: ICommonTheme;
}

export interface ICommonTheme {
}

interface INovuThemeProviderProps {
  children: React.ReactNode;
  colorScheme: ColorScheme;
}

export function NovuThemeProvider(props: INovuThemeProviderProps) {
  const { theme } = getDefaultTheme({ colorScheme: props.colorScheme });

  return (
    <ThemeContext.Provider value={{ colorScheme: props.colorScheme, theme: { ...theme } }}>
      {props.children}
    </ThemeContext.Provider>
  );
}
