'use client';

import { NotificationContext } from './notification-context';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function NotificationConsumer({ children }: Props) {
  return (
    <NotificationContext.Consumer>
      {() => children}
    </NotificationContext.Consumer>
  );
}
