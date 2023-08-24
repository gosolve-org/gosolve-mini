import React, { ReactElement } from 'react';

import { GradientDot } from '../../shared/icons';
import { useUnseenCount } from '../../hooks';

const gradientDotStyle: React.CSSProperties = {
  position: 'absolute',
  top: '-3%',
  right: '10%',
  width: '12px',
  height: '12px',
};

export interface INotificationBellProps {
  unseenCount?: number;
  bellIcon: ReactElement
}

export function NotificationBell(props: INotificationBellProps) {
  const { unseenCount } = useUnseenCount();

  return (
    <div className='relative'>
      {props.bellIcon}
      {unseenCount > 0 ? (
        <GradientDot style={gradientDotStyle} />
      ) : null}
    </div>
  );
}
