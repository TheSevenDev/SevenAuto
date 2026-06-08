'use client';

import { createContext } from 'react';

import { WebsocketContextType } from './types';

// ----------------------------------------------------------------------

export const WebsocketContext = createContext({} as WebsocketContextType);
