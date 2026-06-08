import { applyNormalizeQueryParams } from './normalize-query-params';
import { transformArray } from './transform.array';

describe('transformArray', () => {
  it('splits comma-separated strings and trims values', () => {
    expect(transformArray('IMAGE, VIDEO ,FILE', 'string')).toEqual([
      'IMAGE',
      'VIDEO',
      'FILE',
    ]);
  });

  it('passes through arrays', () => {
    expect(transformArray(['A', 'B'], 'string')).toEqual(['A', 'B']);
  });

  it('returns empty array for empty input', () => {
    expect(transformArray(null, 'string')).toEqual([]);
  });
});

describe('array query normalization + transformArray', () => {
  it('normalizes types[0] indexed brackets then transforms', () => {
    const query: Record<string, unknown> = {
      'types[0]': 'IMAGE',
      'types[1]': 'VIDEO',
    };
    applyNormalizeQueryParams(query);
    expect(transformArray(query.types as string | unknown[], 'string')).toEqual(
      ['IMAGE', 'VIDEO'],
    );
  });

  it('normalizes categories[] then transforms comma string from client', () => {
    const query: Record<string, unknown> = {
      categories: 'slug-a,slug-b',
    };
    expect(
      transformArray(query.categories as string | unknown[], 'string'),
    ).toEqual(['slug-a', 'slug-b']);
  });

  it('normalizes status[] for user filters', () => {
    const query: Record<string, unknown> = {
      'status[]': ['ACTIVE', 'INACTIVE'],
    };
    applyNormalizeQueryParams(query);
    expect(
      transformArray(query.status as string | unknown[], 'string'),
    ).toEqual(['ACTIVE', 'INACTIVE']);
  });
});
