import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';

import { apiEndpoints } from '../constants/endpoints';
import { prepareQueryParams } from '../utils/prepare-query-params';
import { AuthServiceClass } from './auth.service';
import { EmailServiceClass } from './email.service';
import { EmailTemplateServiceClass } from './email-template.service';
import { GeneralServiceClass } from './general-service';
import { MediaServiceClass } from './media.service';
import { NotificationServiceClass } from './notification.service';
import { PaymentServiceClass } from './payment.service';
import { PostServiceClass } from './post.service';
import { RoleServiceClass } from './role.service';
import { TransactionServiceClass } from './transaction.service';
import { UserServiceClass } from './user.service';
import { WebsocketServiceClass } from './websocket.service';

export {
  handleApiResponse,
  handleErrorResponse,
  requireApiResponse,
} from './utils';

export class ApiServiceClass {
  mainAxiosInstance: AxiosInstance;
  placeholderAxiosInstance: AxiosInstance;
  getLanguageServerSide?: () => Promise<string>;
  getLanguageClientSide?: () => string;
  getAffiliateCookie?: () => string;
  getRefreshTokenCookie?: () => string;
  setSession?: (session: { accessToken: string; refreshToken: string }) => void;

  API_URL: string;
  PLACEHOLDER_API_URL: string;

  // Service
  auth: AuthServiceClass;
  email: EmailServiceClass;
  emailTemplate: EmailTemplateServiceClass;
  general: GeneralServiceClass;
  media: MediaServiceClass;
  notification: NotificationServiceClass;
  payment: PaymentServiceClass;
  post: PostServiceClass;
  role: RoleServiceClass;
  user: UserServiceClass;
  websocket: WebsocketServiceClass;
  transaction: TransactionServiceClass;

  constructor(
    API_URL: string,
    PLACEHOLDER_API_URL: string,
    getLanguageServerSide?: () => Promise<string>,
    getLanguageClientSide?: () => string,
    getAffiliateCookie?: () => string,
    getRefreshTokenCookie?: () => string,
    setSession?: (session: {
      accessToken: string;
      refreshToken: string;
    }) => void,
  ) {
    this.API_URL = API_URL;
    this.PLACEHOLDER_API_URL = PLACEHOLDER_API_URL;
    this.getLanguageServerSide = getLanguageServerSide;
    this.getLanguageClientSide = getLanguageClientSide;
    this.getAffiliateCookie = getAffiliateCookie;
    this.getRefreshTokenCookie = getRefreshTokenCookie;
    this.setSession = setSession;

    this.mainAxiosInstance = this.createAxiosInstance({
      baseURL: API_URL,
    });
    this.placeholderAxiosInstance = this.createAxiosInstance({
      baseURL: PLACEHOLDER_API_URL,
    });

    // Service
    this.auth = new AuthServiceClass(this.mainAxiosInstance);
    this.email = new EmailServiceClass(this.mainAxiosInstance);
    this.emailTemplate = new EmailTemplateServiceClass(this.mainAxiosInstance);
    this.general = new GeneralServiceClass(this.mainAxiosInstance);
    this.media = new MediaServiceClass(this.mainAxiosInstance);
    this.notification = new NotificationServiceClass(this.mainAxiosInstance);
    this.payment = new PaymentServiceClass(this.mainAxiosInstance);
    this.post = new PostServiceClass(this.mainAxiosInstance);
    this.role = new RoleServiceClass(this.mainAxiosInstance);
    this.user = new UserServiceClass(this.mainAxiosInstance);
    this.websocket = new WebsocketServiceClass(this.mainAxiosInstance);
    this.transaction = new TransactionServiceClass(this.mainAxiosInstance);
  }

  private createAxiosInstance = ({
    baseURL,
  }: {
    baseURL: string;
  }): AxiosInstance => {
    const instance = axios.create({
      baseURL,
    });

    // Request interceptor
    instance.interceptors.request.use(async (config) => {
      // add language
      if (typeof window === 'undefined' && this.getLanguageServerSide) {
        const acceptLanguage = await this.getLanguageServerSide();
        config.headers['Accept-Language'] = acceptLanguage;
      } else if (this.getLanguageClientSide) {
        const locale = this.getLanguageClientSide();
        config.headers['Accept-Language'] = locale;
        if (this.getAffiliateCookie) {
          const affiliateCookie = this.getAffiliateCookie();
          if (affiliateCookie) {
            config.headers['x-affiliate-session'] = affiliateCookie;
          }
        }
      }

      // add timezone
      config.headers.Timezone =
        Intl.DateTimeFormat().resolvedOptions().timeZone;

      if (
        config.params &&
        typeof config.params === 'object' &&
        !Array.isArray(config.params)
      ) {
        config.params = prepareQueryParams(
          config.params as Record<string, unknown>,
        );
      }

      return config;
    });

    // Response interceptor
    instance.interceptors.response.use(
      (res: AxiosResponse) => res,
      async (error: AxiosError) => this.interceptorsError(error),
    );

    return instance;
  };

  public fetcher = async (args: string | [string, AxiosRequestConfig]) => {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await this.mainAxiosInstance.get(url, { ...config });

    return res.data;
  };

  private interceptorsError = async (error: AxiosError) => {
    const originalRequest = error.config;
    if (typeof window !== 'undefined') {
      const refreshTokenStorage = this.getRefreshTokenCookie?.();

      if (error.response?.status === 401 && refreshTokenStorage) {
        try {
          const authResponse = await this.mainAxiosInstance.post(
            apiEndpoints.auth.refreshToken.path,
            {
              refreshToken: refreshTokenStorage,
            },
          );
          const accessToken = authResponse?.data?.data?.accessToken;
          const refreshToken = authResponse?.data?.data?.refreshToken;
          if (accessToken && refreshToken) {
            this.setSession?.({ accessToken, refreshToken });
            if (originalRequest) {
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              return await this.mainAxiosInstance(originalRequest);
            }
          }
        } catch (refreshTokenError) {
          return Promise.reject(refreshTokenError);
        }
      }
    }

    return Promise.reject(error);
  };

  public setAuthorizationToken = (token: string) => {
    this.mainAxiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
    this.placeholderAxiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
  };

  public clearAuthorizationToken = () => {
    this.mainAxiosInstance.defaults.headers.common.Authorization = undefined;
    this.placeholderAxiosInstance.defaults.headers.common.Authorization =
      undefined;
  };
}
