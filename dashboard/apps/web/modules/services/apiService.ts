import { ApiServiceClass, ELanguage } from '@seven-auto/libs';
import {
  setSession,
  STORAGE_KEY_REFRESH_TOKEN,
} from 'modules/auth/context/utils';
import {
  AFFILIATE_SERVICE_URL,
  AFFILIATE_SESSION_KEY,
  API_URL,
} from 'modules/config-global';
import { getCookie } from 'modules/utils/cookie-utils';
import { getLocale } from 'next-intl/server';

const apiServices = new ApiServiceClass(
  API_URL || '',
  AFFILIATE_SERVICE_URL || '',
  () => getLocale(),
  () =>
    (typeof window !== 'undefined' && localStorage.getItem('locale')) ||
    ELanguage.VI,
  () => getCookie(AFFILIATE_SESSION_KEY) || '',
  () => getCookie(STORAGE_KEY_REFRESH_TOKEN) || '',
  (session) => setSession(session),
);

export default apiServices;
