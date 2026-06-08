import { Link } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import { alpha, useTheme } from '@mui/material/styles';
import { getDisplayName, IUser, paths } from '@seven-auto/libs';
import { AvatarShape } from 'modules/assets/illustrations';
import UserDisplayName from 'modules/atoms/user-display-name';
import Iconify from 'modules/components/iconify';
import Image from 'modules/components/image';
import { getMediaUrl } from 'modules/utils/get-media-url';
import { parseUserSocialLinks } from 'modules/utils/socials';
import { Fragment } from 'react';

// ----------------------------------------------------------------------

type Props = {
  user: IUser;
  onClick?: VoidFunction;
  actions?: React.ReactNode;
};

export default function UserCard({ user, onClick, actions }: Props) {
  const theme = useTheme();

  const socials = parseUserSocialLinks(user?.socials);

  return (
    <Card
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          e.stopPropagation();
          onClick();
        }
      }}
      sx={{
        cursor: 'pointer',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <AvatarShape
          sx={{
            left: 0,
            right: 0,
            zIndex: 10,
            mx: 'auto',
            bottom: -26,
            position: 'absolute',
          }}
        />
        <Link href={paths.userDetail(user.id)}>
          <Avatar
            alt={getDisplayName(user)}
            src={getMediaUrl(user.avatar) || ''}
            sx={{
              width: 64,
              height: 64,
              zIndex: 11,
              left: 0,
              right: 0,
              bottom: -32,
              mx: 'auto',
              position: 'absolute',
            }}
          >
            {getDisplayName(user).charAt(0)}
          </Avatar>
        </Link>

        <Image
          src={getMediaUrl(user.avatar) || ''}
          alt={getDisplayName(user)}
          ratio="16/9"
          overlay={alpha(theme.palette.grey[900], 0.48)}
        />
      </Box>
      <Link
        href={paths.userDetail(user.id)}
        sx={{
          color: 'inherit',
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'none',
          },
        }}
      >
        <ListItemText
          sx={{ mt: 7, mb: 1 }}
          primary={
            <UserDisplayName user={user} sx={{ justifyContent: 'center' }} />
          }
          // secondary={user.position}
          slotProps={{
            primary: {
              variant: 'subtitle1',
            },
            secondary: {
              component: 'span',
              sx: { mt: 0.5 },
            },
          }}
        />
      </Link>

      <Stack
        direction="row"
        sx={{
          mb: 2.5,
          height: 40,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {socials.map(
          (
            link: { url: string; icon: string; color: string },
            index: number,
          ) => {
            if (!link.url) return <Fragment key={index} />;
            return (
              <IconButton
                key={index}
                component={Link}
                href={link.url ?? '#'}
                sx={{
                  color: link.color,
                  '&:hover': {
                    bgcolor: alpha(link.color, 0.08),
                  },
                }}
              >
                <Iconify icon={link.icon} />
              </IconButton>
            );
          },
        )}
      </Stack>
      {actions && <Box sx={{ mt: 'auto' }}>{actions}</Box>}
    </Card>
  );
}
