'use client';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { EPostStatus, IOrderBy, IPostSummary, paths } from '@seven-auto/libs';
import CustomBreadcrumbs from 'modules/components/custom-breadcrumbs';
import Iconify from 'modules/components/iconify';
import Label from 'modules/components/label';
import { useSettingsContext } from 'modules/components/settings';
import { useTranslate } from 'modules/locales';
import { RouterLink } from 'modules/routes/components';
import {
  getPostStatusColor,
  POST_SORT_OPTIONS,
  usePostStore,
} from 'modules/store/post';
import { useCallback, useState } from 'react';

import PostListHorizontal from '../post-list-horizontal';
import PostSearch from '../post-search';
import PostSort from '../post-sort';
// ----------------------------------------------------------------------

export default function PostListView() {
  const settings = useSettingsContext();
  const { t } = useTranslate();

  const TABS = [
    { value: 'all', label: t('basic.all') },
    { value: EPostStatus.DRAFT, label: t(`posts.status.${EPostStatus.DRAFT}`) },
    {
      value: EPostStatus.PUBLISHED,
      label: t(`posts.status.${EPostStatus.PUBLISHED}`),
    },
    {
      value: EPostStatus.SCHEDULED,
      label: t(`posts.status.${EPostStatus.SCHEDULED}`),
    },
    // { value: EPostStatus.TRASH, label: t(`posts.status.${EPostStatus.TRASH}`) },
    { value: 'hot', label: t('posts.hot') },
  ];

  const [tab, setTab] = useState<string>('all');

  const { posts, summary, isLoading, total, filters, setFilters } =
    usePostStore();

  const handleSortBy = useCallback(
    (newValue: IOrderBy) => {
      setFilters({ orderBy: newValue });
    },
    [setFilters],
  );

  const handleChangeTab = useCallback(
    (event: React.SyntheticEvent, newValue: EPostStatus) => {
      setTab(newValue);
      if (newValue === 'all') {
        newValue = '';
      }

      if (newValue === 'hot') {
        setFilters({ hot: true, status: undefined });
      } else {
        setFilters({
          hot: undefined,
          status: newValue,
        });
      }
    },
    [setFilters],
  );

  const handleChangePage = (newPage: number) => {
    setFilters({ ...filters, skip: (newPage - 1) * (filters?.take || 10) });
  };

  const handleFilterChange = useCallback(
    (filter: string) => {
      setFilters({
        filter: filter.trim(),
        skip: 0,
      });
    },
    [setFilters],
  );

  const page = filters?.skip ? filters.skip / (filters?.take || 10) : 0;
  const totalPage = Math.ceil(total / (filters?.take || 10));

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('posts.list')}
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Blog',
            href: paths.dashboard.post.root,
          },
          {
            name: t('posts.list'),
          },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.post.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            {t('posts.new')}
          </Button>
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Stack
        spacing={3}
        direction={{ xs: 'column', sm: 'row' }}
        sx={{
          mb: { xs: 3, md: 5 },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-end', sm: 'center' },
        }}
      >
        <PostSearch onFilterChange={handleFilterChange} />

        <PostSort
          sort={filters.orderBy || { createdAt: 'desc' }}
          onSort={handleSortBy}
          sortOptions={POST_SORT_OPTIONS}
        />
      </Stack>

      <Tabs
        value={tab}
        onChange={handleChangeTab}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        {TABS.map((item) => (
          <Tab
            key={item.value}
            iconPosition="end"
            value={item.value}
            label={item.label}
            icon={
              <Label
                variant={item.value === tab ? 'soft' : 'filled'}
                color={
                  item.value === 'all'
                    ? 'primary'
                    : getPostStatusColor(item.value as EPostStatus)
                }
              >
                {item.value === 'all'
                  ? summary?.total
                  : summary?.[item.value.toLowerCase() as keyof IPostSummary] ||
                    '-'}
              </Label>
            }
            sx={{ textTransform: 'capitalize' }}
          />
        ))}
      </Tabs>
      <PostListHorizontal
        posts={posts}
        loading={isLoading}
        totalPage={totalPage}
        page={page + 1}
        onPageChange={handleChangePage}
      />
    </Container>
  );
}
