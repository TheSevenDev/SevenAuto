import { SxProps } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Iconify from 'modules/components/iconify';
import Label, { LabelColor, LabelVariant } from 'modules/components/label';
import { RouterLink } from 'modules/routes/components';

// ----------------------------------------------------------------------

type Props = {
  backLink: string;
  title: string;
  description?: string;
  label?: {
    variant?: LabelVariant;
    color?: LabelColor;
    text: string;
  };
  actions?: React.ReactNode;
  sx?: SxProps;
};

export default function DashboardTopToolbar({
  backLink,
  title,
  description,
  label,
  actions,
  sx,
}: Props) {
  return (
    <Stack
      spacing={3}
      direction={{ xs: 'column', md: 'row' }}
      sx={{ mb: { xs: 3, md: 5 }, ...sx }}
    >
      <Stack spacing={1} direction="row" sx={{ alignItems: 'flex-start' }}>
        <IconButton component={RouterLink} href={backLink}>
          <Iconify icon="eva:arrow-ios-back-fill" />
        </IconButton>

        <Stack spacing={0.5}>
          <Stack spacing={1} direction="row" sx={{ alignItems: 'center' }}>
            <Typography variant="h4">{title}</Typography>
            {label?.text && (
              <Label variant={label.variant} color={label.color}>
                {label.text}
              </Label>
            )}
          </Stack>

          {description && (
            <Typography variant="body2" sx={{ color: 'text.disabled' }}>
              {description}
            </Typography>
          )}
        </Stack>
      </Stack>

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
    </Stack>
  );
}
