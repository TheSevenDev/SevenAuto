import { AxiosInstance } from 'axios';

import { apiEndpoints } from '../constants/endpoints';
import {
  IAuthChangePassword,
  IAuthConfirmRegister,
  IAuthConfirmRegisterCode,
  IAuthForgotPassword,
  IAuthLogin,
  IAuthLoginWithEmail,
  IAuthRefreshToken,
  IAuthRegister,
  IAuthResetPassword,
  IAuthResponse,
  IAuthSendRegister,
  IUser,
} from '../types';
import { requireApiResponse } from './utils';

export class AuthServiceClass {
  private _client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this._client = client;
  }

  public async getCurrentUser(): Promise<IUser> {
    const res = await this._client.request({
      url: apiEndpoints.auth.getMe.path,
      method: apiEndpoints.auth.getMe.method,
    });

    return requireApiResponse<IUser>(res);
  }

  public async login(data: IAuthLogin): Promise<IAuthResponse> {
    const res = await this._client.request({
      url: apiEndpoints.auth.login.path,
      method: apiEndpoints.auth.login.method,
      data,
    });

    return requireApiResponse<IAuthResponse>(res);
  }

  public async loginByAdmin(data: IAuthLoginWithEmail): Promise<IAuthResponse> {
    const res = await this._client.request({
      url: apiEndpoints.auth.loginByAdmin.path,
      method: apiEndpoints.auth.loginByAdmin.method,
      data,
    });

    return requireApiResponse<IAuthResponse>(res);
  }

  public async logout(): Promise<boolean> {
    const res = await this._client.request({
      url: apiEndpoints.auth.logout.path,
      method: apiEndpoints.auth.logout.method,
    });

    return requireApiResponse<boolean>(res);
  }

  public async refreshToken(data: IAuthRefreshToken): Promise<IAuthResponse> {
    const res = await this._client.request({
      url: apiEndpoints.auth.refreshToken.path,
      method: apiEndpoints.auth.refreshToken.method,
      data,
    });

    return requireApiResponse<IAuthResponse>(res);
  }

  public async register(data: IAuthRegister): Promise<IAuthResponse> {
    const res = await this._client.request({
      url: apiEndpoints.auth.register.path,
      method: apiEndpoints.auth.register.method,
      data,
    });

    return requireApiResponse<IAuthResponse>(res);
  }

  public async resendRegister(data: IAuthSendRegister): Promise<boolean> {
    const res = await this._client.request({
      url: apiEndpoints.auth.resendRegister.path,
      method: apiEndpoints.auth.resendRegister.method,
      data,
    });

    return requireApiResponse<boolean>(res);
  }

  public async forgotPassword(data: IAuthForgotPassword): Promise<boolean> {
    const res = await this._client.request({
      url: apiEndpoints.auth.forgotPassword.path,
      method: apiEndpoints.auth.forgotPassword.method,
      data,
    });

    return requireApiResponse<boolean>(res);
  }

  public async resetPassword(data: IAuthResetPassword): Promise<boolean> {
    const res = await this._client.request({
      url: apiEndpoints.auth.resetPassword.path,
      method: apiEndpoints.auth.resetPassword.method,
      data,
    });

    return requireApiResponse<boolean>(res);
  }

  public async confirmRegister(
    data: IAuthConfirmRegister,
  ): Promise<IAuthResponse> {
    const res = await this._client.request({
      url: apiEndpoints.auth.confirmRegister.path,
      method: apiEndpoints.auth.confirmRegister.method,
      data,
    });

    return requireApiResponse<IAuthResponse>(res);
  }

  public async confirmRegisterCode(
    data: IAuthConfirmRegisterCode,
  ): Promise<IAuthResponse> {
    const res = await this._client.request({
      url: apiEndpoints.auth.confirmRegisterCode.path,
      method: apiEndpoints.auth.confirmRegisterCode.method,
      data,
    });

    return requireApiResponse<IAuthResponse>(res);
  }

  public async changePassword(data: IAuthChangePassword): Promise<boolean> {
    const res = await this._client.request({
      url: apiEndpoints.auth.changePassword.path,
      method: apiEndpoints.auth.changePassword.method,
      data,
    });

    return requireApiResponse<boolean>(res);
  }
}
