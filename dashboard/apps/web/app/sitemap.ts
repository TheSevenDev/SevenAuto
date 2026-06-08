import { MAIN_URL } from 'modules/config-global';
import { fetchPostEntries } from 'modules/seo/sitemap-sources';
import type { MetadataRoute } from 'next';

// ----------------------------------------------------------------------
// Dynamic sitemap.
// Includes:
//   - Static public pages (home, about, contact, faqs, pricing, list pages…)
//   - Published landing pages (`/page/:slug`)
//   - Published posts (`/post/:slug`)
//   - Knowledge / Challenge / Coach (best-effort)
//
// Each dynamic source is wrapped in try/catch in the helper — if API does not allow listing
// public, we still return a valid sitemap (containing at least the static pages).
// Revalidate 10 minutes to let Google crawl the new content.

export const revalidate = 600;

type StaticEntry = {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
};

const STATIC_ENTRIES: StaticEntry[] = [
  { path: '/', priority: 1.0, changeFrequency: 'weekly' },
  { path: '/about-us', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/contact-us', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/faqs', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/pricing', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/post', priority: 0.7, changeFrequency: 'daily' },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (MAIN_URL || 'http://localhost:3000').replace(/\/$/, '');

  const staticEntries: MetadataRoute.Sitemap = STATIC_ENTRIES.map((entry) => ({
    url: `${baseUrl}${entry.path}`,
    lastModified: new Date(),
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));

  // Fetch in parallel to reduce total build time for sitemap.
  const dynamicGroups = await Promise.all([fetchPostEntries({ baseUrl })]);

  return [...staticEntries, ...dynamicGroups.flat()];
}
