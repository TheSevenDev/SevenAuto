'use client';

import { Button } from '@mui/material';
import Container from '@mui/material/Container';
import { hasPermission, paths, permissions } from '@seven-auto/libs';
import { useQuery } from '@tanstack/react-query';
import { useAuthContext } from 'modules/auth/hooks';
import CustomBreadcrumbs from 'modules/components/custom-breadcrumbs';
import EmptyContent from 'modules/components/empty-content/empty-content';
import Iconify from 'modules/components/iconify';
import { LoadingScreen } from 'modules/components/loading-screen';
import { useSettingsContext } from 'modules/components/settings';
import { queryName } from 'modules/const/query-name';
import { useTranslate } from 'modules/locales';
import { RouterLink } from 'modules/routes/components';
import apiServices from 'modules/services/apiService';
import { useMemo } from 'react';

import PostNewEditForm from '../post-new-edit-form';
// ----------------------------------------------------------------------

type Props = {
  slug: string;
};

export default function PostEditView({ slug }: Props) {
  const settings = useSettingsContext();
  const { t } = useTranslate();
  const { currentUser } = useAuthContext();

  const { data: post, isFetching } = useQuery({
    queryKey: [queryName.GET_POST_BY_SLUG, slug],
    queryFn: () => apiServices.post.getPostBySlug(slug),
    refetchOnWindowFocus: false,
  });

  const isAdmin = useMemo(
    () => hasPermission(currentUser, [permissions.POST_MANAGE]),
    [currentUser],
  );

  const isAuthor = useMemo(
    () => post?.authorId === currentUser?.id,
    [post, currentUser],
  );

  const isAuthorOrAdmin = useMemo(
    () => isAuthor || isAdmin,
    [isAuthor, isAdmin],
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('posts.edit')}
        links={[
          {
            name: t('dashboard'),
            href: paths.dashboard.root,
          },
          {
            name: t('posts.title'),
            href: paths.dashboard.post.root,
          },
          {
            name: isAuthorOrAdmin ? post?.title : t('posts.notFound'),
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {isFetching ? (
        <LoadingScreen />
      ) : (
        <>
          {post && isAuthorOrAdmin ? (
            <PostNewEditForm currentPost={post} />
          ) : (
            <EmptyContent
              filled
              title={t('posts.notFound')}
              action={
                <Button
                  component={RouterLink}
                  href={paths.dashboard.post.root}
                  startIcon={
                    <Iconify icon="eva:arrow-ios-back-fill" width={16} />
                  }
                  sx={{ mt: 3 }}
                >
                  {t('basic.back')}
                </Button>
              }
              sx={{
                py: 20,
              }}
            />
          )}
        </>
      )}
    </Container>
  );
}
