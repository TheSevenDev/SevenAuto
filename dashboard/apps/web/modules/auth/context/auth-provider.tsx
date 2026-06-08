'use client';

import {
  ActionMapType,
  IAuthConfirmRegisterCode,
  IAuthRegister,
  IAuthSendRegister,
  IUser,
  paths,
} from '@seven-auto/libs';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { queryName } from 'modules/const/query-name';
import apiServices from 'modules/services/apiService';
import { getCookie } from 'modules/utils/cookie-utils';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useReducer } from 'react';

import { AuthDialogStep, AuthStateType } from '../types';
import { AuthContext } from './auth-context';
import {
  setSession,
  STORAGE_KEY_ACCESS_TOKEN,
  STORAGE_KEY_REFRESH_TOKEN,
} from './utils';

// ----------------------------------------------------------------------

enum Types {
  INITIAL = 'INITIAL',
  SET_STATE = 'SET_STATE',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  LOGOUT = 'LOGOUT',
  OPEN_DIALOG = 'OPEN_DIALOG',
  SET_DIALOG_STEP = 'SET_DIALOG_STEP',
}

type Payload = {
  [Types.INITIAL]: {
    currentUser: IUser | null;
    accessToken: string;
  };
  [Types.SET_STATE]: Partial<AuthStateType>;
  [Types.LOGIN]: {
    currentUser: IUser | null;
    accessToken: string;
    refreshToken: string;
  };
  [Types.LOGOUT]: undefined;
  [Types.OPEN_DIALOG]: {
    dialogStep?: AuthDialogStep;
    openDialog: boolean;
    onDialogCallBack?: () => void;
  };
  [Types.SET_DIALOG_STEP]: {
    dialogStep: AuthDialogStep;
  };
};

type ActionsType = ActionMapType<Payload>[keyof ActionMapType<Payload>];

// ----------------------------------------------------------------------

const initialState: AuthStateType = {
  currentUser: null,
  accessToken: null,
  refreshToken: null,
  loading: true,
  openDialog: false,
  dialogStep: AuthDialogStep.LOGIN,
  onDialogCallBack: undefined,
};

const reducer = (state: AuthStateType, action: ActionsType) => {
  if (action.type === Types.INITIAL) {
    return {
      loading: false,
      accessToken: action.payload.accessToken,
      currentUser: action.payload.currentUser,
    };
  }
  if (action.type === Types.SET_STATE) {
    return {
      ...state,
      ...action.payload,
    };
  }
  if (action.type === Types.LOGIN) {
    return {
      ...state,
      currentUser: action.payload.currentUser,
      accessToken: action.payload.accessToken,
      refreshToken: action.payload.refreshToken,
    };
  }
  if (action.type === Types.LOGOUT) {
    return {
      ...state,
      currentUser: null,
      authenticated: false,
    };
  }

  if (action.type === Types.OPEN_DIALOG) {
    return {
      ...state,
      openDialog: action.payload.openDialog,
      onDialogCallBack: action.payload.onDialogCallBack,
    };
  }

  if (action.type === Types.SET_DIALOG_STEP) {
    return {
      ...state,
      dialogStep: action.payload.dialogStep,
    };
  }

  return state;
};

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const router = useRouter();
  const queryClient = useQueryClient();

  useQuery({
    queryKey: [queryName.GET_CURRENT_USER, state.accessToken],
    queryFn: async () => {
      const currentUser = await apiServices.auth.getCurrentUser();
      dispatch({
        type: Types.SET_STATE,
        payload: { currentUser: { ...currentUser } },
      });
      return currentUser;
    },
    enabled: !!state.accessToken,
  });

  const initialize = useCallback(async () => {
    try {
      const accessToken = getCookie(STORAGE_KEY_ACCESS_TOKEN);
      const refreshToken = getCookie(STORAGE_KEY_REFRESH_TOKEN);
      if (accessToken) {
        setSession({ accessToken, refreshToken });
        const currentUser = await apiServices.auth.getCurrentUser();
        dispatch({
          type: Types.INITIAL,
          payload: {
            currentUser: { ...currentUser },
            accessToken,
          },
        });
      } else {
        dispatch({
          type: Types.INITIAL,
          payload: {
            currentUser: null,
            accessToken: '',
          },
        });
      }
    } catch {
      dispatch({
        type: Types.INITIAL,
        payload: {
          currentUser: null,
          accessToken: '',
        },
      });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // SET STATE
  const setState = useCallback((newState: Partial<AuthStateType>) => {
    dispatch({
      type: Types.SET_STATE,
      payload: newState,
    });
  }, []);

  // LOGIN
  const login = useCallback(async (email: string, password: string) => {
    const data = { email, password };

    const authResponse = await apiServices.auth.login(data);

    const { accessToken, refreshToken, user } = authResponse;
    setSession({ accessToken, refreshToken });
    dispatch({
      type: Types.LOGIN,
      payload: {
        currentUser: user,
        accessToken,
        refreshToken,
      },
    });
    return user;
  }, []);

  // REGISTER
  const register = useCallback(async (data: IAuthRegister) => {
    const authResponse = await apiServices.auth.register(data);

    const { accessToken, refreshToken, user } = authResponse;
    if (accessToken && refreshToken && user) {
      setSession({ accessToken, refreshToken });
      dispatch({
        type: Types.LOGIN,
        payload: {
          currentUser: user,
          accessToken,
          refreshToken,
        },
      });
    } else if (user) {
      dispatch({
        type: Types.SET_STATE,
        payload: {
          currentUser: {
            ...user,
            email: data.email,
          },
        },
      });
    }
  }, []);

  const confirmRegister = useCallback(async (token: string) => {
    const data = {
      token,
    };
    const authResponse = await apiServices.auth.confirmRegister(data);

    const { accessToken, refreshToken, user } = authResponse;

    setSession({ accessToken, refreshToken });
    dispatch({
      type: Types.LOGIN,
      payload: {
        currentUser: user,
        accessToken,
        refreshToken,
      },
    });
  }, []);

  const confirmRegisterCode = useCallback(
    async (args: IAuthConfirmRegisterCode) => {
      const authResponse = await apiServices.auth.confirmRegisterCode(args);

      const { accessToken, refreshToken, user } = authResponse;

      setSession({ accessToken, refreshToken });
      dispatch({
        type: Types.LOGIN,
        payload: {
          currentUser: user,
          accessToken,
          refreshToken,
        },
      });
    },
    [],
  );

  // FORGOT PASSWORD
  const forgotPassword = useCallback(async (email: string) => {
    const data = {
      email,
    };
    await apiServices.auth.forgotPassword(data);
  }, []);

  // RESET PASSWORD
  const resetPassword = useCallback(async (token: string, password: string) => {
    const data = {
      token,
      password,
    };
    await apiServices.auth.resetPassword(data);
  }, []);

  // LOGOUT
  const logout = useCallback(async () => {
    await apiServices.auth.logout();

    setSession({ accessToken: '', refreshToken: '' });
    dispatch({
      type: Types.LOGOUT,
    });
    const searchParams = new URLSearchParams({
      returnTo: window.location.pathname,
    }).toString();
    const href = `${paths.auth.login}?${searchParams}`;
    router.push(href);
  }, [router]);

  // RESEND REGISTER
  const resendRegister = useCallback(async (data: IAuthSendRegister) => {
    await apiServices.auth.resendRegister(data);
  }, []);

  // OPEN DIALOG
  const setOpenDialog = useCallback(
    (value: boolean, callBack?: () => void, step = AuthDialogStep.LOGIN) => {
      dispatch({
        type: Types.OPEN_DIALOG,
        payload: {
          dialogStep: step,
          openDialog: value,
          onDialogCallBack: callBack,
        },
      });
    },
    [],
  );

  // SET DIALOG STEP
  const setDialogStep = useCallback((step: AuthDialogStep) => {
    dispatch({
      type: Types.SET_DIALOG_STEP,
      payload: {
        dialogStep: step,
      },
    });
  }, []);

  // Reload current user
  const reloadCurrentUser = useCallback(async () => {
    queryClient.invalidateQueries({
      queryKey: [queryName.GET_CURRENT_USER, state.accessToken],
    });
  }, [queryClient, state.accessToken]);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.currentUser
    ? 'authenticated'
    : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      currentUser: state.currentUser,
      accessToken: state.accessToken || '',
      openDialog: state.openDialog || false,
      dialogStep: state.dialogStep || AuthDialogStep.LOGIN,
      onDialogCallBack: state.onDialogCallBack,
      method: 'api',
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      //
      setState,
      login,
      register,
      logout,
      forgotPassword,
      resetPassword,
      confirmRegister,
      confirmRegisterCode,
      resendRegister,
      reloadCurrentUser,
      setOpenDialog,
      setDialogStep,
    }),
    [
      setState,
      login,
      logout,
      register,
      forgotPassword,
      resetPassword,
      confirmRegisterCode,
      confirmRegister,
      resendRegister,
      reloadCurrentUser,
      setOpenDialog,
      setDialogStep,
      state.currentUser,
      state.accessToken,
      state.openDialog,
      state.onDialogCallBack,
      state.dialogStep,
      status,
    ],
  );

  return (
    <AuthContext.Provider value={memoizedValue}>
      {children}
    </AuthContext.Provider>
  );
}
