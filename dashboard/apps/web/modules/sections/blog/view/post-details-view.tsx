'use client';

import { Button } from '@mui/material';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { hasPermission, paths, permissions } from '@seven-auto/libs';
import { useQuery } from '@tanstack/react-query';
import { useAuthContext } from 'modules/auth/hooks';
import { ContentView } from 'modules/components/editor';
import EmptyContent from 'modules/components/empty-content/empty-content';
import Iconify from 'modules/components/iconify';
import { queryName } from 'modules/const/query-name';
import { useTranslate } from 'modules/locales';
import { RouterLink } from 'modules/routes/components';
import apiServices from 'modules/services/apiService';
import { useMemo } from 'react';

import PostDetailsHero from '../post-details-hero';
import PostDetailsToolbar from '../post-details-toolbar';
import { PostDetailsSkeleton } from '../post-skeleton';

// ----------------------------------------------------------------------

type Props = {
  slug: string;
};

export default function PostDetailsView({ slug }: Props) {
  const { t } = useTranslate();

  const { data: post, isFetching } = useQuery({
    queryKey: [queryName.GET_POST_BY_SLUG, slug],
    queryFn: () => apiServices.post.getPostBySlug(slug),
  });

  const { currentUser } = useAuthContext();

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

  const renderError = (
    <EmptyContent
      filled
      title={t('posts.notFound')}
      action={
        <Button
          component={RouterLink}
          href={paths.dashboard.post.root}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
          sx={{ mt: 3 }}
        >
          {t('basic.back')}
        </Button>
      }
      sx={{
        py: 20,
      }}
    />
  );

  const renderPost = post && (
    <>
      <PostDetailsToolbar post={post} />

      <PostDetailsHero post={post} />

      <Stack
        sx={{
          maxWidth: 720,
          mx: 'auto',
          mt: { xs: 5, md: 10 },
        }}
      >
        <Typography variant="subtitle1" sx={{ mb: 5 }}>
          {post.description}
        </Typography>

        <ContentView content={post.content || ''} />

        {/* <Stack
          spacing={3}
          sx={{
            py: 3,
            borderTop: (theme) => `dashed 1px ${theme.palette.divider}`,
            borderBottom: (theme) => `dashed 1px ${theme.palette.divider}`,
          }}
        >
          <Stack direction="row" flexWrap="wrap" spacing={1}>
            {post.tags.map((tag) => (
              <Chip key={tag} label={tag} variant="soft" />
            ))}
          </Stack>

          <Stack direction="row" sx={{ alignItems: 'center' }}>
            <FormControlLabel
              control={
                <Checkbox
                  defaultChecked
                  size="small"
                  color="error"
                  icon={<Iconify icon="solar:heart-bold" />}
                  checkedIcon={<Iconify icon="solar:heart-bold" />}
                />
              }
              label={fShortenNumber(post.totalFavorites)}
              sx={{ mr: 1 }}
            />

            <AvatarGroup
              sx={{
                [`& .${avatarGroupClasses.avatar}`]: {
                  width: 32,
                  height: 32,
                },
              }}
            >
              {post.favoritePerson.map((person) => (
                <Avatar
                  key={person.name}
                  alt={person.name}
                  src={person.avatarUrl}
                />
              ))}
            </AvatarGroup>
          </Stack>
        </Stack>

        <Stack direction="row" sx={{ mb: 3, mt: 5 }}>
          <Typography variant="h4">Comments</Typography>

          <Typography variant="subtitle2" sx={{ color: 'text.disabled' }}>
            ({post.comments.length})
          </Typography>
        </Stack>

        <PostCommentForm />

        <Divider sx={{ mt: 5, mb: 2 }} />

        <PostCommentList comments={post.comments} /> */}
      </Stack>
    </>
  );

  return (
    <Container maxWidth={false}>
      {isFetching && <PostDetailsSkeleton />}

      {(!post || !isAuthorOrAdmin) && renderError}

      {post && isAuthorOrAdmin && renderPost}
    </Container>
  );
}
