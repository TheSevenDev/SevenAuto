import { IBaseEntity, IFindMany, IOrderBy } from './utils';
import { ELanguage } from './utils';

export const EEmailTemplateKey = {
  WELCOME: 'welcome',
  CONFIRM_REGISTER: 'confirm_register',
  SEND_REGISTER_CODE: 'send_register_code',
  FORGOT_PASSWORD: 'forgot_password',

  // payment
  PAYMENT_CREATED: 'payment_created',
  PAYMENT_APPROVED: 'payment_approved',
  PAYMENT_REJECTED: 'payment_rejected',
  PAYMENT_REOPENED: 'payment_reopened',
};

export type EEmailTemplateKey =
  (typeof EEmailTemplateKey)[keyof typeof EEmailTemplateKey];

export type IEmailTemplate = IBaseEntity & {
  key: EEmailTemplateKey;
  variables: string[];
  name: string;
  title: string;
  content: string;
  langs: IEmailTemplateLang[];
};

export type IEmailTemplateLang = IBaseEntity & {
  emailTemplateId: string;
  emailTemplate?: IEmailTemplate;

  lang: ELanguage;
  title: string;
  content: string;
};

export type IEmailTemplateLangUpdate = {
  id?: string;
  lang: ELanguage;
  title: string;
  content: string;
};

export type IEmailTemplateUpdate = {
  id: string;
  name?: string;
  title?: string;
  content?: string;
  langs?: IEmailTemplateLangUpdate[];
};

export type IEmailSend = {
  email: string;
  title: string;
  textSend: string;
  replyTo?: string;
  fromName?: string;
  logo?: string;
};

export type IEmailSendMulti = Omit<IEmailSend, 'email'> & {
  listEmail: string[];
  useBcc?: boolean;
};

export type IEmailTemplateFindOne = {
  id?: string;
  key?: EEmailTemplateKey;
};

export type IEmailSendTest = {
  email: string;
  title: string;
  content: string;
  variables: Record<string, string>;
};

export type IEmailTemplateFindMany = IFindMany & {
  orderBy?: IOrderBy;
};
