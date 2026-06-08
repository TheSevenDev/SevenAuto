import {
  IAuthConfirmRegisterCode,
  IAuthRegister,
  IAuthSendRegister,
  IUser,
} from '@seven-auto/libs';

// ----------------------------------------------------------------------

export type AuthStateType = {
  status?: string;
  loading: boolean;
  currentUser: IUser | null;
  accessToken?: string | null;
  refreshToken?: string | null;
  openDialog?: boolean;
  dialogStep?: AuthDialogStep;
  onDialogCallBack?: () => void;
};

export enum AuthDialogStep {
  LOGIN = 'login',
  REGISTER = 'register',
  FORGOT = 'forgot',
  RESET = 'reset',
  CONFIRM = 'confirm',
}

// ----------------------------------------------------------------------

type CanRemove = {
  setState: (state: Partial<AuthStateType>) => void;
  login: (email: string, password: string) => Promise<IUser>;
  register: (args: IAuthRegister) => Promise<void>;
  //
  loginWithGoogle?: () => Promise<void>;
  loginWithFacebook?: () => Promise<void>;
  loginWithTwitter?: () => Promise<void>;
  //
  confirmRegister: (token: string) => Promise<void>;
  confirmRegisterCode: (args: IAuthConfirmRegisterCode) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  resendRegister: (args: IAuthSendRegister) => Promise<void>;
  setOpenDialog: (
    value: boolean,
    onDialogCallBack?: () => Promise<void>,
    step?: AuthDialogStep,
  ) => void;
  setDialogStep: (step: AuthDialogStep) => void;
  reloadCurrentUser: () => Promise<void>;
};

export type AuthContextType = CanRemove & {
  currentUser: IUser | null;
  accessToken: string | null;
  openDialog: boolean;
  dialogStep: AuthDialogStep;
  onDialogCallBack?: () => void;
  method: string;
  loading: boolean;
  authenticated: boolean;
  unauthenticated: boolean;
  logout: () => Promise<void>;
};
