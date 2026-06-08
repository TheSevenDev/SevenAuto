'use client';

import { WebsocketContext } from './websocket-context';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function WebsocketConsumer({ children }: Props) {
  return (
    <WebsocketContext.Consumer>{() => children}</WebsocketContext.Consumer>
  );
}
