import { applyNormalizeQueryParams } from './normalize-query-params';
import { transformOrderBy } from './transform-order-by';

describe('orderBy query normalization', () => {
  it('merges bracket notation into orderBy', () => {
    const query: Record<string, unknown> = {
      take: '12',
      'orderBy[updatedAt]': 'desc',
    };
    applyNormalizeQueryParams(query);
    expect(query).toEqual({ take: '12', orderBy: { updatedAt: 'desc' } });
  });

  it('merges multiple bracket fields', () => {
    const query: Record<string, unknown> = {
      'orderBy[createdAt]': 'desc',
      'orderBy[id]': 'asc',
    };
    applyNormalizeQueryParams(query);
    expect(query.orderBy).toEqual({ createdAt: 'desc', id: 'asc' });
  });

  it('normalizes sort direction case', () => {
    const query: Record<string, unknown> = {
      'orderBy[title]': 'ASC',
    };
    applyNormalizeQueryParams(query);
    expect(query.orderBy).toEqual({ title: 'asc' });
  });

  it('merges types[] bracket notation into types', () => {
    const query: Record<string, unknown> = {
      select: 'basic',
      take: 10,
      skip: 0,
      'types[]': 'IMAGE',
    };
    applyNormalizeQueryParams(query);
    expect(query).toEqual({
      select: 'basic',
      take: 10,
      skip: 0,
      types: 'IMAGE',
    });
  });

  it('merges multiple types[] values', () => {
    const query: Record<string, unknown> = {
      'types[]': ['IMAGE', 'VIDEO'],
    };
    applyNormalizeQueryParams(query);
    expect(query.types).toEqual(['IMAGE', 'VIDEO']);
  });

  it('merges includeIds[] bracket notation into includeIds', () => {
    const query: Record<string, unknown> = {
      'includeIds[]': ['a', 'b'],
    };
    applyNormalizeQueryParams(query);
    expect(query.includeIds).toEqual(['a', 'b']);
  });

  it('merges levels[0] and levels[1] into levels', () => {
    const query: Record<string, unknown> = {
      'levels[0]': 'BASIC',
      'levels[1]': 'PREMIUM',
    };
    applyNormalizeQueryParams(query);
    expect(query.levels).toEqual(['BASIC', 'PREMIUM']);
  });
});

describe('transformOrderBy', () => {
  it('parses object from normalized query', () => {
    expect(
      transformOrderBy({ publishDate: 'desc' }, { createdAt: 'desc' }),
    ).toEqual({ publishDate: 'desc' });
  });

  it('parses field_desc string', () => {
    expect(transformOrderBy('updatedAt_desc')).toEqual({ updatedAt: 'desc' });
  });

  it('uses module-specific fallback', () => {
    expect(transformOrderBy(undefined, { publishDate: 'desc' })).toEqual({
      publishDate: 'desc',
    });
  });
});
