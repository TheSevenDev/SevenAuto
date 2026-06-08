import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { IPost } from '@seven-auto/libs';
import Iconify from 'modules/components/iconify';
import { useTranslate } from 'modules/locales';

import PostItem from './post-item';
import { PostItemSkeleton } from './post-skeleton';

// ----------------------------------------------------------------------

type Props = {
  posts: IPost[];
  loading?: boolean;
  disabledIndex?: boolean;
};

export default function PostList({ posts, loading, disabledIndex }: Props) {
  const { t } = useTranslate();

  const renderSkeleton = (
    <>
      {[...Array(16)].map((_, index) => (
        <Grid
          key={index}
          size={{
            xs: 12,
            sm: 6,
            md: 3,
          }}
        >
          <PostItemSkeleton />
        </Grid>
      ))}
    </>
  );

  const renderList = (
    <>
      {posts.map((post, index) => (
        <Grid
          key={post.id}
          size={{
            xs: 12,
            sm: 6,
            md: !disabledIndex && index === 0 ? 6 : 3,
          }}
        >
          <PostItem post={post} index={!disabledIndex ? index : undefined} />
        </Grid>
      ))}
    </>
  );

  return (
    <>
      <Grid container spacing={3}>
        {loading ? renderSkeleton : renderList}
      </Grid>

      {posts.length > 8 && (
        <Stack
          sx={{
            alignItems: 'center',
            mt: 8,
            mb: { xs: 10, md: 15 },
          }}
        >
          <Button
            size="large"
            variant="outlined"
            startIcon={
              <Iconify icon="svg-spinners:12-dots-scale-rotate" width={24} />
            }
          >
            {t('basic.loadMore')}
          </Button>
        </Stack>
      )}
    </>
  );
}
