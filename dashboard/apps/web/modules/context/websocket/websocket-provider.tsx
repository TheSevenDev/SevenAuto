'use client';

import {
  ActionMapType,
  EWebsocketMessageType,
  INotification,
  IWebsocketMessage,
  websocketReceiveKey,
  websocketSendKey,
} from '@seven-auto/libs';
import { useAuthContext } from 'modules/auth/hooks';
import { WS_URL } from 'modules/config-global';
import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

import { useNotificationContext } from '../notification/use-notification-context';
import { WebsocketStateType } from './types';
import { WebsocketContext } from './websocket-context';

// ----------------------------------------------------------------------

enum Types {
  INITIALIZED = 'INITIALIZED',
  SET_LAST_MESSAGE = 'SET_LAST_MESSAGE',
  SET_MESSAGES = 'SET_MESSAGES',
}

type Payload = {
  [Types.INITIALIZED]: {
    initialized: boolean;
  };
  [Types.SET_MESSAGES]: {
    messages: IWebsocketMessage[];
  };
  [Types.SET_LAST_MESSAGE]: {
    lastMessage: IWebsocketMessage;
  };
};

type ActionsType = ActionMapType<Payload>[keyof ActionMapType<Payload>];

// ----------------------------------------------------------------------

const initialState: WebsocketStateType = {
  initialized: false,
  lastMessage: null,
  messages: [],
};

const reducer = (
  state: WebsocketStateType,
  action: ActionsType,
): WebsocketStateType => {
  if (action.type === Types.INITIALIZED) {
    return {
      ...state,
      initialized: true,
    };
  }
  if (action.type === Types.SET_MESSAGES) {
    return {
      ...state,
      messages: action.payload.messages,
    };
  }

  return state;
};

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function WebsocketProvider({ children }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { currentUser } = useAuthContext();
  const { pushNotification } = useNotificationContext();
  const socketRef = useRef<Socket | null>(null);

  // ----------------------------------------------------------------------

  const initialize = useCallback(async () => {
    if (!currentUser) return;
    const socket = io(WS_URL, {
      path: '/wss',
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 3,
      transports: ['websocket'],
      query: { userId: currentUser.id },
    });
    socketRef.current = socket;
    listenEvents();
    dispatch({ type: Types.INITIALIZED, payload: { initialized: true } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const setMessages = useCallback((messages: IWebsocketMessage[]) => {
    dispatch({
      type: Types.SET_MESSAGES,
      payload: { messages },
    });
  }, []);

  const sendMessage = useCallback((data: IWebsocketMessage) => {
    socketRef.current?.emit(websocketSendKey, data);
  }, []);

  // ----------------------------------------------------------------------
  const handleMessages = (data: IWebsocketMessage) => {
    if (data.type === EWebsocketMessageType.NOTIFICATION) {
      pushNotification(data.data as INotification);
    }
  };
  // ----------------------------------------------------------------------
  const listenEvents = () => {
    socketRef.current?.on('error', (error: unknown) => {
      console.log('Websocket error', error);
    });

    // Listen to connection status
    socketRef.current?.on(websocketReceiveKey, (data: IWebsocketMessage) => {
      setMessages([...state.messages, data]);
      dispatch({
        type: Types.SET_LAST_MESSAGE,
        payload: { lastMessage: data },
      });
      handleMessages(data);
    });

    socketRef.current?.on('connect', () => {
      console.log('Websocket connected');
    });

    socketRef.current?.on('disconnect', () => {
      console.log('Websocket disconnected');
    });
  };

  // ----------------------------------------------------------------------
  useEffect(() => {
    if (!state.initialized) {
      initialize();
    }
  }, [initialize, state.initialized, currentUser]);

  useEffect(
    () =>
      // cleanup
      () => {
        socketRef.current?.off('receiveMessage');
        socketRef.current?.disconnect();
      },
    [],
  );

  // ----------------------------------------------------------------------

  const memoizedValue = useMemo(
    () => ({
      ...state,
      sendMessage,
    }),
    [state, sendMessage],
  );

  return (
    <WebsocketContext.Provider value={memoizedValue}>
      {children}
    </WebsocketContext.Provider>
  );
}
