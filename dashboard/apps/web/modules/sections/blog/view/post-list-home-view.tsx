'use client';

import { Pagination, paginationClasses } from '@mui/material';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { EPostStatus, IOrderBy, IPostFindMany } from '@seven-auto/libs';
import { useQuery } from '@tanstack/react-query';
import { useSettingsContext } from 'modules/components/settings';
import { queryName } from 'modules/const/query-name';
import apiServices from 'modules/services/apiService';
import { POST_SORT_OPTIONS } from 'modules/store/post';
import { useCallback, useState } from 'react';

import PostList from '../post-list';
import PostSearch from '../post-search';
import PostSort from '../post-sort';

// ----------------------------------------------------------------------
const PER_PAGE = 16;

export default function PostListHomeView() {
  const settings = useSettingsContext();

  const [filters, setFilters] = useState<IPostFindMany>({
    skip: 0,
    take: PER_PAGE,
    filter: '',
    status: EPostStatus.PUBLISHED,
    orderBy: { createdAt: 'desc' },
  });

  const { data, isLoading } = useQuery({
    queryKey: [queryName.GET_POST_LIST_HOME, filters],
    queryFn: () => apiServices.post.getPosts(filters),
  });

  const handleSortBy = useCallback((newValue: IOrderBy) => {
    setFilters((prev) => ({ ...prev, orderBy: newValue }));
  }, []);

  const handlePageChange = useCallback(
    (newPage: number) => {
      setFilters((prev) => ({
        ...prev,
        skip: (newPage - 1) * (filters?.take || 10),
      }));
    },
    [filters?.take],
  );

  const handleFilterChange = useCallback((filter: string) => {
    setFilters((prev) => ({ ...prev, filter: filter.trim(), skip: 0 }));
  }, []);

  const page = filters?.skip ? filters.skip / (filters?.take || 10) : 0;
  const totalPage = Math.ceil((data?.total || 0) / (filters?.take || 10));

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <Typography
        variant="h4"
        sx={{
          my: { xs: 3, md: 5 },
        }}
      >
        Blog
      </Typography>

      <Stack
        spacing={3}
        direction={{ xs: 'column', sm: 'row' }}
        sx={{
          mb: {
            xs: 3,
            md: 5,
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-end', sm: 'center' },
          },
        }}
      >
        <PostSearch onFilterChange={handleFilterChange} />

        <PostSort
          sort={filters.orderBy || { createdAt: 'desc' }}
          onSort={handleSortBy}
          sortOptions={POST_SORT_OPTIONS}
        />
      </Stack>

      <Stack spacing={3} sx={{ mb: { xs: 3, md: 5 } }}>
        <PostList posts={data?.items || []} loading={isLoading} />

        {totalPage > 1 && (
          <Pagination
            count={totalPage}
            page={page + 1}
            onChange={(_, value) => handlePageChange(value)}
            sx={{
              [`& .${paginationClasses.ul}`]: {
                justifyContent: 'center',
              },
            }}
          />
        )}
      </Stack>
    </Container>
  );
}
