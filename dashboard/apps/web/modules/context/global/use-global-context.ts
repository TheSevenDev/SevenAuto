'use client';

import { useContext } from 'react';

import { GlobalContext } from './global-context';

// ----------------------------------------------------------------------

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);

  if (!context)
    throw new Error(
      'useGlobalContext context must be use inside GlobalProvider',
    );

  return context;
};
