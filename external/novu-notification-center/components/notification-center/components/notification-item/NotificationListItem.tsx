import React from 'react';
import { Avatar as MAvatar } from '@mantine/core';
import { css, cx } from '@emotion/css';
import styled from '@emotion/styled';
import {
  IMessage,
  ButtonTypeEnum,
  IMessageAction,
  MessageActionStatusEnum,
  ActorTypeEnum,
  SystemAvatarIconEnum,
  IActor,
} from '@novu/shared';

import { useNovuTheme, useNotificationCenter } from '../../../../hooks';
import { getDefaultBellColors } from '../../../../utils/defaultTheme';
import { ActionContainer } from './ActionContainer';
import { INovuTheme } from '../../../../store/novu-theme.context';
import { When } from '../../../../shared/utils/When';
import { ColorScheme } from '../../../../shared/config/colors';
import {
  DotsHorizontal,
  ErrorIcon,
  Info,
  Success,
  Warning,
  Avatar,
  Up,
  Question,
  GradientDot,
} from '../../../../shared/icons';
import { colors } from '../../../../shared/config/colors';
import { useStyles } from '../../../../store/styles';
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from 'dayjs';
dayjs.extend(relativeTime);

const avatarSystemIcons = [
  {
    icon: <Warning />,
    type: SystemAvatarIconEnum.WARNING,
    iconColor: '#FFF000',
    containerBgColor: '#FFF00026',
  },
  {
    icon: <Info />,
    type: SystemAvatarIconEnum.INFO,
    iconColor: '#0000FF',
    containerBgColor: '#0000FF26',
  },
  {
    icon: <Up />,
    type: SystemAvatarIconEnum.UP,
    iconColor: colors.B70,
    containerBgColor: `${colors.B70}26`,
  },
  {
    icon: <Question />,
    type: SystemAvatarIconEnum.QUESTION,
    iconColor: colors.B70,
    containerBgColor: `${colors.B70}26`,
  },
  {
    icon: <Success />,
    type: SystemAvatarIconEnum.SUCCESS,
    iconColor: colors.success,
    containerBgColor: `${colors.success}26`,
  },
  {
    icon: <ErrorIcon />,
    type: SystemAvatarIconEnum.ERROR,
    iconColor: colors.error,
    containerBgColor: `${colors.error}26`,
  },
];

export function NotificationListItem({
  notification,
  onClick,
}: {
  notification: IMessage;
  onClick: (notification: IMessage, actionButtonType?: ButtonTypeEnum) => void;
}) {
  const { theme: novuTheme, colorScheme } = useNovuTheme();
  const { onActionClick, listItem } = useNotificationCenter();
  const unread = readSupportAdded(notification) ? !notification.read : !notification.seen;
  const [
    listItemReadStyles,
    listItemUnreadStyles,
    listItemLayoutStyles,
    listItemContentLayoutStyles,
    listItemTitleStyles,
    listItemTimestampStyles,
  ] = useStyles([
    'notifications.listItem.read',
    'notifications.listItem.unread',
    'notifications.listItem.layout',
    'notifications.listItem.contentLayout',
    'notifications.listItem.title',
    'notifications.listItem.timestamp',
  ]);

  function handleNotificationClick() {
    onClick(notification);
  }

  async function handleActionButtonClick(actionButtonType: ButtonTypeEnum) {
    onActionClick(notification.templateIdentifier, actionButtonType, notification);
  }

  if (listItem) {
    return listItem(notification, handleActionButtonClick, handleNotificationClick);
  }

  return (
    <div
      className={cx(
        'nc-notifications-list-item',
        listItemClassName,
        unread ? unreadNotificationStyles(novuTheme) : readNotificationStyles(novuTheme),
        unread ? css(listItemUnreadStyles) : css(listItemReadStyles)
      )}
      onClick={() => handleNotificationClick()}
      data-test-id="notification-list-item"
      role="button"
      tabIndex={0}
    >
      <NotificationItemContainer className={cx('nc-notifications-list-item-layout', css(listItemLayoutStyles))}>
        <NotificationContentContainer>
          {notification.actor && notification.actor.type !== ActorTypeEnum.NONE && (
            <AvatarContainer>
              <RenderAvatar actor={notification.actor} />
            </AvatarContainer>
          )}
          <NotificationTextContainer
            className={cx('nc-notifications-list-item-content-layout', css(listItemContentLayoutStyles))}
          >
            <TextContent
              className={cx('nc-notifications-list-item-title', css(listItemTitleStyles))}
              data-test-id="notification-content"
              dangerouslySetInnerHTML={{
                __html: notification.content as string,
              }}
            />
            <div
              className={cx(
                'nc-notifications-list-item-timestamp',
                timeMarkClassName(novuTheme, unread),
                css(listItemTimestampStyles)
              )}
            >
              {dayjs(notification.createdAt).fromNow()}
            </div>
          </NotificationTextContainer>
        </NotificationContentContainer>
        <ActionWrapper
          templateIdentifier={notification.templateIdentifier}
          actionStatus={notification?.cta?.action?.status}
          ctaAction={notification?.cta?.action}
          handleActionButtonClick={handleActionButtonClick}
        />
      </NotificationItemContainer>
      <SettingsActionWrapper style={{ display: 'none' }} novuTheme={novuTheme}>
        <DotsHorizontal />
      </SettingsActionWrapper>
      <When truthy={readSupportAdded(notification)}>
        {!notification.seen && <GradientDotWrapper />}
      </When>
    </div>
  );
}

function ActionWrapper({
  actionStatus,
  templateIdentifier,
  ctaAction,
  handleActionButtonClick,
}: {
  templateIdentifier: string;
  actionStatus: MessageActionStatusEnum;
  ctaAction: IMessageAction;
  handleActionButtonClick: (actionButtonType: ButtonTypeEnum) => void;
}) {
  const { actionsResultBlock } = useNotificationCenter();

  return (
    <>
      {actionsResultBlock && actionStatus === MessageActionStatusEnum.DONE ? (
        actionsResultBlock(templateIdentifier, ctaAction)
      ) : (
        <ActionContainerOrNone handleActionButtonClick={handleActionButtonClick} action={ctaAction} />
      )}
    </>
  );
}

export const readSupportAdded = (notification: IMessage) => typeof notification?.read !== 'undefined';

function ActionContainerOrNone({
  action,
  handleActionButtonClick,
}: {
  action: IMessageAction;
  handleActionButtonClick: (actionButtonType: ButtonTypeEnum) => void;
}) {
  return <>{action ? <ActionContainer onActionClick={handleActionButtonClick} action={action} /> : null}</>;
}

function GradientDotWrapper() {
  return (
    <GradientDot
      width={10}
      height={10}
    />
  );
}

function RenderAvatar({ actor }: { actor: IActor }) {
  if ([ActorTypeEnum.USER, ActorTypeEnum.SYSTEM_CUSTOM].includes(actor.type) && actor.data) {
    return (
      <MAvatar src={actor.data} radius="xl">
        <Avatar />
      </MAvatar>
    );
  }

  if (actor.type === ActorTypeEnum.SYSTEM_ICON) {
    const selectedIcon = avatarSystemIcons.filter((data) => data.type === actor.data);

    return selectedIcon.length > 0 ? (
      <SystemIconWrapper iconColor={selectedIcon[0].iconColor} containerBgColor={selectedIcon[0].containerBgColor}>
        {selectedIcon[0].icon}
      </SystemIconWrapper>
    ) : (
      <Avatar />
    );
  }

  return <Avatar />;
}

const NotificationItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: normal;
  width: 100%;
`;

const TextContent = styled.div`
  line-height: 16px;
`;

const SettingsActionWrapper = styled.div<{ novuTheme: INovuTheme }>`
  color: ${({ novuTheme }) => novuTheme.layout?.wrapper.secondaryFontColor};
`;

const unreadNotificationStyles = (novuTheme: INovuTheme) => css`
  background: ${novuTheme?.notificationItem?.unread?.background};
  box-shadow: ${novuTheme?.notificationItem?.unread?.boxShadow};
  color: ${novuTheme?.notificationItem?.unread?.fontColor};
  font-size: 14px;

  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    width: 5px;
    border-radius: 7px 0 0 7px;
    background: ${novuTheme?.notificationItem?.unread?.notificationItemBeforeBrandColor};
  }
`;

const readNotificationStyles = (novuTheme: INovuTheme) => css`
  color: ${novuTheme?.notificationItem?.read?.fontColor};
  background: ${novuTheme?.notificationItem?.read?.background};
  font-weight: 400;
  font-size: 14px;
`;

const listItemClassName = css`
  padding: 15px;
  position: relative;
  display: flex;
  line-height: 20px;
  justify-content: space-between;
  align-items: center;
  border-radius: 7px;
  margin: 10px 15px;

  &:hover {
    cursor: pointer;
  }
`;

const timeMarkClassName = (novuTheme: INovuTheme, unread?: boolean) => css`
  min-width: 55px;
  font-size: 12px;
  font-weight: 400;
  opacity: 0.5;
  line-height: 14.4px;
  color: #828299;
`;

const NotificationContentContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const AvatarContainer = styled.div`
  width: 40px;
  min-width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 40px;
  border: 1px solid ${colors.B40};
  overflow: hidden;
`;

const NotificationTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const SystemIconWrapper = styled.div<{ containerBgColor: string; iconColor: string }>`
  width: 100%;
  height: 100%;
  cursor: pointer;
  background-color: ${({ containerBgColor }) => containerBgColor};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  color: ${({ iconColor }) => iconColor};

  & > svg {
    width: 20px;
    height: 20px;
  }
`;
