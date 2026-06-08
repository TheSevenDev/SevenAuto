import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import { alpha, useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { getDisplayName, IPost, paths } from '@seven-auto/libs';
import { AvatarShape } from 'modules/assets/illustrations';
import Iconify from 'modules/components/iconify';
import Image from 'modules/components/image';
import TextMaxLine from 'modules/components/text-max-line';
import { useResponsive } from 'modules/hooks/use-responsive';
import { RouterLink } from 'modules/routes/components';
import { fShortenNumber } from 'modules/utils/format-number';
import { fDate } from 'modules/utils/format-time';
import { getMediaUrl } from 'modules/utils/get-media-url';

// ----------------------------------------------------------------------

type Props = {
  post: IPost;
  index?: number;
};

export default function PostItem({ post, index }: Props) {
  const theme = useTheme();

  const mdUp = useResponsive('up', 'md');

  const { title, media, views, author, createdAt, slug } = post;

  const latestPost = index === 0 || index === 1 || index === 2;

  if (mdUp && latestPost) {
    return (
      <Card>
        {author && (
          <Link component={RouterLink} href={paths.userDetail(author.id)}>
            <Avatar
              alt={getDisplayName(author)}
              src={getMediaUrl(author?.avatar)}
              sx={{
                top: 24,
                left: 24,
                zIndex: 9,
                position: 'absolute',
              }}
            >
              {getDisplayName(author).charAt(0)}
            </Avatar>
          </Link>
        )}

        <PostContent
          title={title || ''}
          slug={slug || ''}
          createdAt={createdAt}
          totalViews={views || 0}
          totalLikes={0}
          totalComments={0}
          index={index}
        />
        <Link component={RouterLink} href={paths.post.details(slug || '')}>
          <Image
            alt={title}
            src={getMediaUrl(media)}
            overlay={alpha(theme.palette.grey[900], 0.48)}
            sx={{
              width: 1,
              height: 360,
            }}
          />
        </Link>
      </Card>
    );
  }

  return (
    <Card>
      <Box sx={{ position: 'relative' }}>
        <AvatarShape
          sx={{
            left: 0,
            zIndex: 9,
            width: 88,
            height: 36,
            bottom: -16,
            position: 'absolute',
          }}
        />

        {author && (
          <Link component={RouterLink} href={paths.userDetail(author.id)}>
            <Avatar
              alt={getDisplayName(author)}
              src={getMediaUrl(author?.avatar)}
              sx={{
                left: 24,
                zIndex: 9,
                bottom: -24,
                position: 'absolute',
              }}
            >
              {getDisplayName(author).charAt(0)}
            </Avatar>
          </Link>
        )}

        <Link component={RouterLink} href={paths.post.details(slug || '')}>
          <Image alt={title} src={getMediaUrl(media)} ratio="4/3" />
        </Link>
      </Box>

      <PostContent
        title={title || ''}
        slug={slug || ''}
        totalViews={views || 0}
        totalLikes={0}
        totalComments={0}
        createdAt={createdAt}
      />
    </Card>
  );
}

// ----------------------------------------------------------------------

type PostContentProps = {
  title: string;
  slug: string;
  index?: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  createdAt: Date | string | number;
};

export function PostContent({
  title,
  slug,
  createdAt,
  totalViews,
  totalLikes,
  totalComments,
  index,
}: PostContentProps) {
  const mdUp = useResponsive('up', 'md');

  const linkTo = paths.post.details(slug);

  const latestPostLarge = index === 0;

  const latestPostSmall = index === 1 || index === 2;

  return (
    <CardContent
      sx={{
        pt: 6,
        width: 1,
        ...((latestPostLarge || latestPostSmall) && {
          pt: 0,
          zIndex: 9,
          bottom: 0,
          position: 'absolute',
          color: 'common.white',
        }),
      }}
    >
      <Typography
        variant="caption"
        component="div"
        sx={{
          mb: 1,
          color: 'text.disabled',
          ...((latestPostLarge || latestPostSmall) && {
            opacity: 0.64,
            color: 'common.white',
          }),
        }}
      >
        {fDate(createdAt)}
      </Typography>

      <Link color="inherit" component={RouterLink} href={linkTo}>
        <TextMaxLine
          variant={mdUp && latestPostLarge ? 'h5' : 'subtitle2'}
          line={2}
          persistent
        >
          {title}
        </TextMaxLine>
      </Link>

      <Stack
        spacing={1.5}
        direction="row"
        sx={{
          mt: 3,
          justifyContent: 'flex-end',
          typography: 'caption',
          color: 'text.disabled',
          ...((latestPostLarge || latestPostSmall) && {
            opacity: 0.64,
            color: 'common.white',
          }),
        }}
      >
        {totalComments > 0 && (
          <Stack direction="row" sx={{ alignItems: 'center' }}>
            <Iconify
              icon="eva:message-circle-fill"
              width={16}
              sx={{ mr: 0.5 }}
            />
            {fShortenNumber(totalComments)}
          </Stack>
        )}

        {totalViews > 0 && (
          <Stack direction="row" sx={{ alignItems: 'center' }}>
            <Iconify icon="solar:eye-bold" width={16} sx={{ mr: 0.5 }} />
            {fShortenNumber(totalViews)}
          </Stack>
        )}

        {totalLikes > 0 && (
          <Stack direction="row" sx={{ alignItems: 'center' }}>
            <Iconify icon="solar:share-bold" width={16} sx={{ mr: 0.5 }} />
            {fShortenNumber(totalLikes)}
          </Stack>
        )}
      </Stack>
    </CardContent>
  );
}
