import { IUserSocialCard } from './user';
import { IBaseEntity } from './utils';

export type ISiteInfo = {
  siteName?: string;
  siteTitle?: string;
  siteDescription?: string;
  siteKeywords?: string;
  siteAuthor?: string;
  siteCopyright?: string;
  siteLanguage?: string;
  siteIcon?: string;
  siteImage?: string;
  siteLogo?: string;
  siteTextLogo?: string;
  siteEmail?: string;
  sitePhone?: string;
  siteAddress?: string;
  siteSocial?: string;
  siteFooter?: string;
  siteHeader?: string;
  gtmId?: string;
  gaId?: string;
  pixelId?: string;
  facebookAppId?: string;
  customCss?: string;
};

export type IOption = IBaseEntity & {
  key?: string;
  value?: string;
};

export type ITableTemp = IBaseEntity & {
  key?: string;
  type?: number;
  value?: string;
};

export type ICacheDb = IBaseEntity & {
  key?: string;
  type?: number;
  value?: string;
};

export enum ESeedData {
  USER = 'user',
  PERMISSION = 'permission',
}

export enum ESocialDisplay {
  NONE = 'none',
  SMALL = 'small',
  LARGE = 'large',
}

export interface ISocialImageData {
  imageSize: {
    width: number;
    height: number;
  };
  title?: string;
  content?: string;
  background?: string;
  link?: string;
  user?: IUserSocialCard | null;
  logo: ESocialDisplay;
  qrCode: ESocialDisplay;
  showUser: ESocialDisplay;
  showWatermark?: boolean;
}
export interface ISeedData {
  type: ESeedData;
}
