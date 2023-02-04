import React from 'react';
import { ActionIcon } from '@mantine/core';
import { css, cx } from '@emotion/css';

import { ArrowLeft } from '../../../../../shared/icons';
import { useNovuTheme, useScreens } from '../../../../../hooks';
import { ScreensEnum } from '../../../../../shared/enums/screens.enum';
import { useStyles } from '../../../../../store/styles';

export function UserPreferenceHeader() {
  const { theme } = useNovuTheme();
  const { setScreen } = useScreens();
  const [headerStyles, headerTitleStyles, backButtonStyles] = useStyles([
    'header.root',
    'header.title',
    'header.backButton',
  ]);

  return (
    <div className={cx('nc-header', headerClassName, css(headerStyles))}>
      <ActionIcon
        className={cx(
          'nc-header-back-button',
          css`
            color: ${theme.header.fontColor};
          `,
          css(backButtonStyles)
        )}
        data-test-id="go-back-btn"
        variant="transparent"
        onClick={() => setScreen(ScreensEnum.NOTIFICATIONS)}
      >
        <ArrowLeft style={{ marginLeft: '15px' }} />
      </ActionIcon>
      <div className={cx('nc-header-title', titleClassName(theme.header.fontColor), css(headerTitleStyles))}>
        Settings
      </div>
    </div>
  );
}

const titleClassName = (fontColor: string) => css`
  color: ${fontColor};
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 24px;
  text-align: left;
`;

const headerClassName = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 55px;
  gap: 10px;
`;
