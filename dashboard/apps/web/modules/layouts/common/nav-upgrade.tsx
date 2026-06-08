import { Link } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { getDisplayName, paths } from '@seven-auto/libs';
import UserDisplayName from 'modules/atoms/user-display-name';
import { useAuthContext } from 'modules/auth/hooks';
import { getMediaUrl } from 'modules/utils/get-media-url';

// ----------------------------------------------------------------------

export default function NavUpgrade() {
  const { currentUser } = useAuthContext();

  return (
    <Stack
      sx={{
        px: 2,
        py: 5,
        textAlign: 'center',
      }}
    >
      <Stack sx={{ alignItems: 'center' }}>
        <Link href={paths.dashboard.user.profile}>
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={getMediaUrl(currentUser?.avatar, 'sm')}
              alt={getDisplayName(currentUser)}
              sx={{ width: 48, height: 48 }}
            />
          </Box>
        </Link>
        <Stack spacing={0.5} sx={{ mt: 1.5, mb: 2 }}>
          <UserDisplayName user={currentUser} />
          <Typography variant="body2" noWrap sx={{ color: 'text.disabled' }}>
            {currentUser?.email}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}
