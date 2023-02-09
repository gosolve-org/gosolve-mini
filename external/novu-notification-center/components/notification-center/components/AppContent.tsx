import React from 'react';
import { MantineProvider } from '@mantine/core';
import { css } from '@emotion/css';

import { Layout } from './layout/Layout';
import { Main } from './Main';
import { useNovuTheme } from '../../../hooks';
import { ScreenProvider } from '../../../store/screens-provider.context';

export function AppContent() {
  const { theme } = useNovuTheme();

  const primaryColor = theme.loaderColor;
  const dir = 'ltr';

  return (
    <MantineProvider>
      <ScreenProvider>
        <div className={wrapperClassName(primaryColor, dir)}>
          <Layout>
            <Main />
          </Layout>
        </div>
      </ScreenProvider>
    </MantineProvider>
  );
}

const wrapperClassName = (primaryColor: string, dir: string) => css`
  margin: 0;
  color: #333737;
  direction: ${dir};
  width: 420px;
  z-index: 999;

  ::-moz-selection {
    background: ${primaryColor};
  }

  *::selection {
    background: ${primaryColor};
  }
`;
