'use client';

import { ActionMapType, ISiteInfo } from '@seven-auto/libs';
import { useCallback, useEffect, useMemo, useReducer } from 'react';

import { GlobalContext } from './global-context';
import { GlobalStateType } from './types';

// ----------------------------------------------------------------------

enum Types {
  INITIAL = 'INITIAL',
  SET_GLOBAL_LOADING = 'SET_GLOBAL_LOADING',
}

type Payload = {
  [Types.INITIAL]: {
    siteInfo: ISiteInfo;
    globalLoading: boolean;
  };
  [Types.SET_GLOBAL_LOADING]: {
    loading: boolean;
  };
};

type ActionsType = ActionMapType<Payload>[keyof ActionMapType<Payload>];

// ----------------------------------------------------------------------

const reducer = (state: GlobalStateType, action: ActionsType) => {
  if (action.type === Types.INITIAL) {
    return {
      siteInfo: action.payload.siteInfo,
      globalLoading: action.payload.globalLoading,
    };
  }
  if (action.type === Types.SET_GLOBAL_LOADING) {
    return {
      ...state,
      globalLoading: action.payload.loading,
    };
  }

  return state;
};

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
  siteInfo: ISiteInfo;
};

export function GlobalProvider({ siteInfo, children }: Props) {
  const [state, dispatch] = useReducer(reducer, {
    siteInfo,
    globalLoading: false,
  });

  const setGlobalLoading = useCallback((loading: boolean) => {
    dispatch({
      type: Types.SET_GLOBAL_LOADING,
      payload: { loading },
    });
  }, []);

  useEffect(() => {
    dispatch({
      type: Types.INITIAL,
      payload: {
        siteInfo,
        globalLoading: false,
      },
    });
  }, [siteInfo]);

  // ----------------------------------------------------------------------

  const memoizedValue = useMemo(
    () => ({
      siteInfo: state.siteInfo,
      globalLoading: state.globalLoading,
      setGlobalLoading,
    }),
    [setGlobalLoading, state.globalLoading, state.siteInfo],
  );

  return (
    <GlobalContext.Provider value={memoizedValue}>
      {children}
    </GlobalContext.Provider>
  );
}
