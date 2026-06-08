'use client';

import { useContext } from 'react';

import { NotificationContext } from './notification-context';

// ----------------------------------------------------------------------

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);

  if (!context)
    throw new Error(
      'useNotificationContext context must be use inside NotificationProvider',
    );

  return context;
};
