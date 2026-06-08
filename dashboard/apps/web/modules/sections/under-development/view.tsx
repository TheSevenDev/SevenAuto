'use client';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { MaintenanceIllustration } from 'modules/assets/illustrations';
import { RouterLink } from 'modules/routes/components';

// ----------------------------------------------------------------------

interface IProps {
  showTitle?: boolean;
  showButton?: boolean;
}

export default function UnderDevelopment({
  showTitle = true,
  showButton = true,
}: IProps) {
  return (
    <Stack sx={{ alignItems: 'center' }}>
      {showTitle && (
        <>
          <Typography variant="h3" sx={{ mb: 2 }}>
            Under Development
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            We are currently working hard on this page!
          </Typography>
        </>
      )}

      <MaintenanceIllustration sx={{ my: 10, height: 240 }} />
      {showButton && (
        <Button
          component={RouterLink}
          href="/"
          size="large"
          variant="contained"
        >
          Go to Home
        </Button>
      )}
    </Stack>
  );
}
