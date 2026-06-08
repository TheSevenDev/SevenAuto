import apiServices from 'modules/services/apiService';
import type { MetadataRoute } from 'next';

// ----------------------------------------------------------------------
// Dynamic data source for /sitemap.xml.
//
// Each function tries to fetch a list of 1 model, map to sitemap entry. Wrap in
// try/catch — if API error (timeout, 401 in staging environment, …) then skip
// that source to avoid breaking the sitemap.
//
// Note: Next.js allows a maximum of 50,000 URLs / 50MB per sitemap file. Currently
// set `PAGE_SIZE = 1000` for each type; if exceeds that limit then split into multiple sitemaps.

const PAGE_SIZE = 1000;

type Source = {
  baseUrl: string;
};

export async function fetchPostEntries({
  baseUrl,
}: Source): Promise<MetadataRoute.Sitemap> {
  try {
    const result = await apiServices.post.getPosts({
      status: 'PUBLISHED',
      take: PAGE_SIZE,
    });
    return (result.items ?? [])
      .filter((post) => Boolean(post.slug))
      .map((post) => ({
        url: `${baseUrl}/post/${post.slug}`,
        lastModified: pickDate(post.updatedAt, post.publishDate),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
  } catch {
    return [];
  }
}

// ----------------------------------------------------------------------

function pickDate(...values: Array<Date | string | undefined>): Date {
  const found = values.find((v) => Boolean(v));
  if (!found) return new Date();
  return found instanceof Date ? found : new Date(found);
}
