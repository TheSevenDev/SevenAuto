import { paths } from '@seven-auto/libs';

// API
// ----------------------------------------------------------------------

export const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV;

export const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const WS_URL = process.env.NEXT_PUBLIC_WS_URL;
export const MAIN_URL = process.env.NEXT_PUBLIC_MAIN_URL;
export const ASSETS_URL = process.env.NEXT_PUBLIC_ASSETS_URL;
export const MEDIA_SECRET = process.env.NEXT_PUBLIC_MEDIA_SECRET;
export const SERVER_IP = process.env.NEXT_PUBLIC_SERVER_IP;
export const MAIN_DOMAIN = process.env.NEXT_PUBLIC_MAIN_DOMAIN;
export const COOKIE_DOMAIN = process.env.NEXT_PUBLIC_COOKIE_DOMAIN;

export const AFFILIATE_SERVICE_URL =
  process.env.NEXT_PUBLIC_AFFILIATE_SERVICE_URL;
export const AFFILIATE_SESSION_KEY =
  process.env.NEXT_PUBLIC_AFFILIATE_SESSION_KEY || 'seven-auto-aff-code';

// ROOT PATH AFTER LOGIN SUCCESSFUL
export const PATH_AFTER_LOGIN = paths.dashboard.root; // as '/dashboard'

export const COOKIE_NAME_LOCALE = 'NEXT_LOCALE';

export const MAP_API_KEY = process.env.NEXT_PUBLIC_MAP_API_KEY || '';
export const RECAPTCHA_SITE_KEY =
  process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '';

export const MAX_PRICE = 10000;
