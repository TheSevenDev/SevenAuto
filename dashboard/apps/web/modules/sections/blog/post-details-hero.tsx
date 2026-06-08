import { Fab } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import { alpha, useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { getDisplayName, IPost, paths } from '@seven-auto/libs';
import UserDisplayName from 'modules/atoms/user-display-name';
import Iconify from 'modules/components/iconify';
import SocialShare from 'modules/molecules/social-share';
import { bgGradient } from 'modules/theme/css';
import { fDate } from 'modules/utils/format-time';
import { getMediaUrl } from 'modules/utils/get-media-url';
import { truncateText } from 'modules/utils/truncate';

// ----------------------------------------------------------------------

type IProps = {
  post: IPost;
};

export default function PostDetailsHero({ post }: IProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        height: 480,
        overflow: 'hidden',
        ...bgGradient({
          imgUrl: post?.media ? getMediaUrl(post.media) : '',
          startColor: `${alpha(theme.palette.grey[900], 0.64)} 0%`,
          endColor: `${alpha(theme.palette.grey[900], 0.64)} 100%`,
        }),
      }}
    >
      <Container sx={{ height: 1, position: 'relative' }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            zIndex: 9,
            color: 'common.white',
            position: 'absolute',
            maxWidth: 480,
            pt: { xs: 2, md: 8 },
          }}
        >
          {post?.title}
        </Typography>

        <Stack
          sx={{
            left: 0,
            width: 1,
            bottom: 0,
            position: 'absolute',
          }}
        >
          {post?.author && post?.createdAt && (
            <Stack
              sx={{
                alignItems: 'center',
                flexDirection: 'row',
                px: { xs: 2, md: 3 },
                pb: { xs: 3, md: 8 },
              }}
            >
              <Avatar
                alt={getDisplayName(post?.author)}
                src={getMediaUrl(post?.author.avatar)}
                sx={{ width: 64, height: 64, mr: 2 }}
              >
                {getDisplayName(post?.author).charAt(0)}
              </Avatar>

              <ListItemText
                sx={{ color: 'common.white' }}
                primary={<UserDisplayName user={post?.author} />}
                secondary={fDate(post?.createdAt)}
                slotProps={{
                  primary: { variant: 'subtitle1', sx: { mb: 0.5 } },
                  secondary: { color: 'inherit', sx: { opacity: 0.64 } },
                }}
              />
            </Stack>
          )}

          <SocialShare
            link={paths.post.details(post.slug || '')}
            title={truncateText(post.description || '', 300)}
            type="post"
            id={post.id}
          >
            <Fab
              color="primary"
              aria-label="add"
              sx={{
                position: 'absolute',
                bottom: { xs: 32, md: 64 },
                right: { xs: 16, md: 24 },
              }}
            >
              <Iconify icon="solar:share-bold" />
            </Fab>
          </SocialShare>
        </Stack>
      </Container>
    </Box>
  );
}
