import Loader from 'common/components/layout/Loader';
import React from 'react';

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
