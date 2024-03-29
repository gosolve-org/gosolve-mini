import React from 'react';
import Loader from 'components/common/layout/Loader';

export const NotificationLoader = () => {
  return (
    <div
      style={{
        textAlign: 'center',
        minHeight: 300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Loader size={40} />
    </div>
  );
};
