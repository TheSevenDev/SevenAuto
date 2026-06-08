/**
 * Cookie utility functions for managing authentication tokens
 * Supports subdomain configuration
 * // TODO: Update cookieStore when all browsers support it
 * https://developer.mozilla.org/en-US/docs/Web/API/CookieStore
 */

import { COOKIE_DOMAIN } from 'modules/config-global';

export interface CookieOptions {
  expires?: number | Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

/**
 * Get domain for cookie to work with subdomains
 * Example: if COOKIE_DOMAIN is "sevenauto.com", cookies will work on *.sevenauto.com
 */
export const getCookieDomain = (): string | undefined => {
  if (typeof window === 'undefined') return undefined;

  // If COOKIE_DOMAIN is set, use it (without subdomain)
  if (COOKIE_DOMAIN) {
    return COOKIE_DOMAIN;
  }

  // Fallback: extract root domain from current hostname
  const { hostname } = window.location;

  // For localhost, return undefined to use default behavior
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return undefined;
  }

  // Extract root domain (e.g., "sub.example.com" -> ".example.com")
  const parts = hostname.split('.');
  if (parts.length >= 2) {
    return `.${parts.slice(-2).join('.')}`;
  }

  return undefined;
};

/**
 * Set a cookie
 */
export const setCookie = (
  name: string,
  value: string,
  options: CookieOptions = {},
): void => {
  if (typeof document === 'undefined') return;

  const defaultOptions: CookieOptions = {
    path: '/',
    domain: getCookieDomain(),
    ...(process.env.NODE_ENV === 'production' && {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    }),
    // expires: 365, // days  --> Remove for use session cookie
  };
  const finalOptions = { ...defaultOptions, ...options };

  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (finalOptions.expires) {
    let expires: Date;
    if (typeof finalOptions.expires === 'number') {
      expires = new Date();
      expires.setTime(
        expires.getTime() + finalOptions.expires * 24 * 60 * 60 * 1000,
      );
    } else {
      expires = finalOptions.expires;
    }
    cookieString += `; expires=${expires.toUTCString()}`;
  }

  if (finalOptions.path) {
    cookieString += `; path=${finalOptions.path}`;
  }

  if (finalOptions.domain) {
    cookieString += `; domain=${finalOptions.domain}`;
  }

  if (finalOptions.secure) {
    cookieString += '; secure';
  }

  if (finalOptions.sameSite) {
    cookieString += `; samesite=${finalOptions.sameSite}`;
  }

  document.cookie = cookieString;
};

/**
 * Get a cookie value by name
 */
export const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;

  const nameEQ = `${encodeURIComponent(name)}=`;
  const cookies = document.cookie.split(';');

  for (let i = 0; i < cookies.length; i += 1) {
    let cookie = cookies[i];
    while (cookie && cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1, cookie.length);
    }
    if (cookie && cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length, cookie.length));
    }
  }

  return null;
};

/**
 * Remove a cookie
 */
export const removeCookie = (name: string): void => {
  if (typeof document === 'undefined') return;

  // Set cookie with past expiration date to remove it
  setCookie(name, '', {
    expires: new Date(0),
    path: '/',
    domain: getCookieDomain(),
  });
};

/**
 * Check if cookies are available
 */
export const isCookieAvailable = (): boolean => {
  if (typeof document === 'undefined') return false;

  try {
    const testKey = '__cookie_test__';
    setCookie(testKey, 'test', { expires: 1 });
    const exists = getCookie(testKey) === 'test';
    removeCookie(testKey);
    return exists;
  } catch {
    return false;
  }
};

/**
 * Get all cookies as an object
 */
export const getAllCookies = (): Record<string, string> => {
  if (typeof document === 'undefined') return {};

  const cookies: Record<string, string> = {};
  const cookieArray = document.cookie.split(';');

  cookieArray.forEach((cookie) => {
    const [name, value] = cookie.split('=').map((c) => c.trim());
    if (name && value) {
      cookies[decodeURIComponent(name)] = decodeURIComponent(value);
    }
  });

  return cookies;
};
