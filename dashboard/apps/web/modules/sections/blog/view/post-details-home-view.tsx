'use client';

import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { IPost, paths } from '@seven-auto/libs';
import CustomBreadcrumbs from 'modules/components/custom-breadcrumbs';
import { ContentView } from 'modules/components/editor';
import { useTranslate } from 'modules/locales';

import PostDetailsHero from '../post-details-hero';

// ----------------------------------------------------------------------

type Props = {
  post: IPost;
};

export default function PostDetailsHomeView({ post }: Props) {
  const { t } = useTranslate();

  // const renderSkeleton = <PostDetailsSkeleton />;

  // const renderError = (
  //   <Container sx={{ my: 10 }}>
  //     <EmptyContent
  //       filled
  //       title={t('posts.notFound')}
  //       action={
  //         <Button
  //           component={RouterLink}
  //           href={paths.post.root}
  //           startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
  //           sx={{ mt: 3 }}
  //         >
  //           {t('basic.back')}
  //         </Button>
  //       }
  //       sx={{ py: 10 }}
  //     />
  //   </Container>
  // );

  const renderPost = post && (
    <>
      <PostDetailsHero post={post} />

      <Container
        maxWidth={false}
        sx={{
          py: 3,
          mb: 5,
          borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
        }}
      >
        <CustomBreadcrumbs
          links={[
            {
              name: t('nav.home'),
              href: '/',
            },
            {
              name: t('nav.posts'),
              href: paths.post.root,
            },
            {
              name: post?.title,
            },
          ]}
          sx={{ maxWidth: 720, mx: 'auto' }}
        />
      </Container>

      <Container maxWidth={false}>
        <Stack sx={{ maxWidth: 720, mx: 'auto' }}>
          <Typography variant="subtitle1" sx={{ mb: 5 }}>
            {post.description}
          </Typography>
          <ContentView content={post.content || ''} />

          <Stack
            spacing={3}
            sx={{
              py: 3,
              borderTop: (theme) => `dashed 1px ${theme.palette.divider}`,
              borderBottom: (theme) => `dashed 1px ${theme.palette.divider}`,
            }}
          >
            {/* <Stack direction="row" flexWrap="wrap" spacing={1}>
              {post.tags.map((tag) => (
                <Chip key={tag} label={tag} variant="soft" />
              ))}
            </Stack> */}

            {/* <Stack direction="row" alignItems="center">
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

              <AvatarGroup>
                {post.favoritePerson.map((person) => (
                  <Avatar
                    key={person.name}
                    alt={person.name}
                    src={person.avatarUrl}
                  />
                ))}
              </AvatarGroup>
            </Stack> */}
          </Stack>

          {/* <Stack direction="row" sx={{ mb: 3, mt: 5 }}>
            <Typography variant="h4">Comments</Typography>

            <Typography variant="subtitle2" sx={{ color: 'text.disabled' }}>
              ({post.comments.length})
            </Typography>
          </Stack>

          <PostCommentForm />

          <Divider sx={{ mt: 5, mb: 2 }} />

          <PostCommentList comments={post.comments} /> */}
        </Stack>
      </Container>
    </>
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const renderLatestPosts = (
    <>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Recent Posts
      </Typography>

      {/* <PostList
        posts={latestPosts.slice(latestPosts.length - 4)}
        loading={latestPostsLoading}
        disabledIndex
      /> */}
    </>
  );

  return (
    <>
      {/* {postLoading && renderSkeleton} */}

      {/* {postError && renderError} */}

      {post && renderPost}

      {/* <Container sx={{ pb: 15 }}>
        {!!latestPosts.length && renderLatestPosts}
      </Container> */}
    </>
  );
}
