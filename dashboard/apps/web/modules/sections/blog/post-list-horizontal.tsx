import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';
import { IPost } from '@seven-auto/libs';

import PostItemHorizontal from './post-item-horizontal';
import { PostItemSkeleton } from './post-skeleton';

// ----------------------------------------------------------------------

type Props = {
  posts: IPost[];
  totalPage: number;
  page: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
};

export default function PostListHorizontal({
  totalPage,
  page,
  posts,
  loading,
  onPageChange,
}: Props) {
  const renderSkeleton = (
    <>
      {[...Array(16)].map((_, index) => (
        <PostItemSkeleton key={index} variant="horizontal" />
      ))}
    </>
  );

  const renderList = (
    <>
      {posts.map((post) => (
        <PostItemHorizontal key={post.id} post={post} />
      ))}
    </>
  );

  return (
    <>
      <Box
        sx={{
          gap: 3,
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(1, 1fr)',
            md: 'repeat(2, 1fr)',
          },
        }}
      >
        {loading ? renderSkeleton : renderList}
      </Box>
      {totalPage > 1 && (
        <Pagination
          count={totalPage}
          page={page}
          onChange={(_, value) => onPageChange(value)}
          sx={{
            mt: 8,
            [`& .${paginationClasses.ul}`]: {
              justifyContent: 'center',
            },
          }}
        />
      )}
    </>
  );
}
