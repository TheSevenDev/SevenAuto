'use client';

import { Grid, Typography } from '@mui/material';
import Container from '@mui/material/Container';
import { getDisplayName } from '@seven-auto/libs';
import { useAuthContext } from 'modules/auth/hooks';
import { useSettingsContext } from 'modules/components/settings';

// ----------------------------------------------------------------------

export default function OverviewAppView() {
  const { currentUser } = useAuthContext();

  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Typography
        variant="h4"
        sx={{
          mb: { xs: 1, md: 2 },
        }}
      >
        Hi {getDisplayName(currentUser) || 'there'}, Welcome back 👋
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>Download App</Grid>
      </Grid>
    </Container>
  );
}
