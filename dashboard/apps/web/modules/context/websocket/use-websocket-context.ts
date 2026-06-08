'use client';

import { useContext } from 'react';

import { WebsocketContext } from './websocket-context';

// ----------------------------------------------------------------------

export const useWebsocketContext = () => {
  const context = useContext(WebsocketContext);

  if (!context)
    throw new Error(
      'useWebsocketContext context must be use inside WebsocketProvider',
    );

  return context;
};
