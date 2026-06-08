import { enLang as en, viLang as vi } from '@seven-auto/libs';
import { headers } from 'next/headers';
import { getRequestConfig } from 'next-intl/server';

import apiServices from '../services/apiService';
import { getAppLocale } from './locale';

export default getRequestConfig(async () => {
  // Provide a static locale, fetch a user setting,
  // read from `cookies()`, `headers()`, etc.
  const headersList = await headers();
  const hostname = headersList.get('x-domain') || '';
  let locale = await getAppLocale();
  if (!locale || !['en', 'vi'].includes(locale)) {
    locale = 'vi';
  }
  apiServices.mainAxiosInstance.defaults.headers.common['Accept-Language'] =
    locale;
  // apiServices.affiliateAxiosInstance.defaults.headers.common[
  //   'Accept-Language'
  // ] = locale;
  // add domain
  apiServices.mainAxiosInstance.defaults.headers.common['X-Domain'] = hostname;
  // apiServices.affiliateAxiosInstance.defaults.headers.common['X-Domain'] =
  //   hostname;
  return {
    locale,
    messages: locale === 'en' ? en : vi,
  };
});
