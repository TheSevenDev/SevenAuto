'use server';

import { cookies } from 'next/headers';

import { COOKIE_NAME_LOCALE } from '../config-global';
import { locales } from './config-lang';

// In this example the locale is read from a cookie. You could alternatively
// also read it from a database, backend service, or any other source.

export async function getAppLocale() {
  const cookieStore = await cookies();
  const currentLocal = cookieStore.get(COOKIE_NAME_LOCALE)?.value || 'vi';
  return currentLocal;
}

export type Locale = (typeof locales)[number];

export async function setAppLocale(locale: Locale) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME_LOCALE, locale);
}
