import { IUser } from './user';

export enum AuthVerifyType {
  LINK = 'link',
  CODE = 'code',
}

export type IAuthLoginWithEmail = {
  email: string;
};

export type IAuthLogin = IAuthLoginWithEmail & {
  password: string;
};

export type IAuthRefreshToken = {
  refreshToken: string;
};

export type IAuthInfoToken = {
  userId: string;
};

export type IAuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: IUser;
};

export type IAuthForgotPassword = {
  email: string;
};

export type IAuthResetPassword = {
  password: string;
  token: string;
};

export type IAuthChangePassword = {
  oldPassword: string;
  newPassword: string;
};

export type IAuthRegister = {
  fullname: string;
  email: string;
  password: string;
  verifyType?: AuthVerifyType;
  referrerId?: string;
};

export type IAuthConfirmRegister = {
  token: string;
};

export type IAuthConfirmRegisterCode = {
  email: string;
  code: string;
};

export type IAuthSendRegister = {
  email: string;
  verifyType?: AuthVerifyType;
};
