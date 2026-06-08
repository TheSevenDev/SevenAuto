export const websocketSendKey = 'sendMessage';
export const websocketReceiveKey = 'receiveMessage';

export enum EWebsocketMessageType {
  'SYSTEM' = 'SYSTEM',
  'NOTIFICATION' = 'NOTIFICATION',
}

export interface IWebsocketMessage {
  id: string;
  type: EWebsocketMessageType;
  data: Record<string, unknown>;
}

export interface IWebsocketOnlineUser {
  userIds: string[];
}

export interface ISystemNotification {
  title: string;
  content?: string;
}
