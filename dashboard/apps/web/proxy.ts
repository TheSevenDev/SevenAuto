import { NextRequest, NextResponse } from 'next/server';

import { MAIN_URL } from './modules/config-global';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip proxy for static files and Next.js internal paths
  // Handle both /_next/ and /next/ (in case of reverse proxy rewrite)
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/next/static/') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/static/') ||
    pathname.match(
      /\.(ico|png|jpg|jpeg|gif|webp|svg|woff|woff2|ttf|eot|otf|css|js)$/,
    )
  ) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  const ref = url.searchParams.get('ref');

  if (ref) {
    const targetUrl = url.searchParams.get('target');

    url.searchParams.delete('ref');
    url.searchParams.delete('utm_source');
    url.searchParams.delete('utm_medium');
    url.searchParams.delete('utm_campaign');
    url.searchParams.delete('utm_term');
    url.searchParams.delete('utm_content');

    const redirectUrl = targetUrl || MAIN_URL;
    const finalUrl = redirectUrl?.startsWith('http')
      ? redirectUrl
      : `${MAIN_URL}${redirectUrl?.startsWith('/') ? redirectUrl : `/${redirectUrl}`}`;

    return NextResponse.redirect(finalUrl || url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot|otf)).*)',
  ],
};
