// ----------------------------------------------------------------------

import { IWebsocketMessage } from '@seven-auto/libs';

export type WebsocketStateType = {
  initialized: boolean;
  lastMessage: IWebsocketMessage | null;
  messages: IWebsocketMessage[];
};

// ----------------------------------------------------------------------

export type WebsocketContextType = {
  initialized: boolean;
  lastMessage: IWebsocketMessage | null;
  messages: IWebsocketMessage[];
  sendMessage: (message: IWebsocketMessage) => void;
};
