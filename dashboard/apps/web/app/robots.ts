import { MAIN_URL } from 'modules/config-global';
import type { MetadataRoute } from 'next';

// ----------------------------------------------------------------------
// robots.txt — allow all bots to index public pages, block admin /
// API / payment. Reference sitemap to make Google/Bing/Perplexity crawl faster.
//
// Note: Common crawlers match disallow rules on the URL path only; query strings
// (e.g. `/page/x?preview=draft`) are not reliably blocked here. Draft/noindex is
// enforced via `generateMetadata` on the preview route instead.

export default function robots(): MetadataRoute.Robots {
  const baseUrl = (MAIN_URL || 'http://localhost:7272').replace(/\/$/, '');
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard',
          '/dashboard/*',
          '/api',
          '/api/*',
          '/payment',
          '/payment/*',
          '/checkout',
          '/checkout/*',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
