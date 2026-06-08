'use client';

import { Stack } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { m } from 'framer-motion';
import { PageNotFoundIllustration } from 'modules/assets/illustrations';
import { MotionContainer, varBounce } from 'modules/components/animate';
import { RouterLink } from 'modules/routes/components';

// ----------------------------------------------------------------------

export default function NotFoundBox() {
  return (
    <Stack
      sx={{
        m: 'auto',
        maxWidth: 500,
        textAlign: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <MotionContainer>
        <m.div variants={varBounce().in}>
          <Typography variant="h3" sx={{ mb: 2 }}>
            Sorry, Page Not Found!
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <Typography sx={{ color: 'text.secondary' }}>
            Sorry, we couldn’t find the page you’re looking for. Perhaps you’ve
            mistyped the URL? Be sure to check your spelling.
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <PageNotFoundIllustration
            sx={{
              height: 180,
              my: { xs: 2, sm: 4 },
            }}
          />
        </m.div>

        <Button
          component={RouterLink}
          href="/"
          size="large"
          variant="contained"
        >
          Go to Home
        </Button>
      </MotionContainer>
    </Stack>
  );
}
