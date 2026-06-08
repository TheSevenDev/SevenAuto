import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Iconify from 'modules/components/iconify';
import { RouterLink } from 'modules/routes/components';

// ----------------------------------------------------------------------

type Props = {
  title: string;
  description?: string;
  backLink?: string;
  status?: React.ReactNode;
  actions?: React.ReactNode;
};

export default function DashboardToolbar({
  title,
  description,
  backLink,
  status,
  actions,
}: Props) {
  return (
    <Stack
      spacing={3}
      direction={{ xs: 'column', md: 'row' }}
      sx={{
        mb: { xs: 3, md: 5 },
      }}
    >
      <Stack spacing={1} direction="row" sx={{ alignItems: 'flex-start' }}>
        {backLink && (
          <IconButton component={RouterLink} href={backLink}>
            <Iconify icon="eva:arrow-ios-back-fill" />
          </IconButton>
        )}

        <Stack spacing={0.5}>
          <Stack spacing={1} direction="row" sx={{ alignItems: 'center' }}>
            <Typography variant="h4">{title}</Typography>
            {status && status}
          </Stack>
          {description && (
            <Typography variant="body2" sx={{ color: 'text.disabled' }}>
              {description}
            </Typography>
          )}
        </Stack>
      </Stack>

      {actions && (
        <Stack
          spacing={1.5}
          direction="row"
          sx={{
            flexGrow: 1,
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          {actions}
        </Stack>
      )}
    </Stack>
  );
}
