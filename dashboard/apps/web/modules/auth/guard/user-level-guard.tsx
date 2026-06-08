import { Button } from '@mui/material';
import Container from '@mui/material/Container';
import { SxProps, Theme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { EUserLevel, hasUserLevel, paths } from '@seven-auto/libs';
import { m } from 'framer-motion';
import { ForbiddenIllustration } from 'modules/assets/illustrations';
import { MotionContainer, varBounce } from 'modules/components/animate';

import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------

type UserLevelGuardProp = {
  hasContent?: boolean;
  level?: EUserLevel;
  children: React.ReactNode;
  sx?: SxProps<Theme>;
};

export default function UserLevelGuard({
  hasContent,
  level,
  children,
  sx,
}: UserLevelGuardProp) {
  const { currentUser } = useAuthContext();

  if (typeof level !== 'undefined') {
    const hasLevel = hasUserLevel(currentUser, level);
    if (!hasLevel) {
      return hasContent ? (
        <Container
          component={MotionContainer}
          sx={{ textAlign: 'center', ...sx }}
        >
          <m.div variants={varBounce().in}>
            <Typography variant="h3" sx={{ mb: 2 }}>
              Please upgrade your plan
            </Typography>
          </m.div>

          <m.div variants={varBounce().in}>
            <Typography sx={{ color: 'text.secondary' }}>
              You do not have permission to access this page
            </Typography>
          </m.div>

          <m.div variants={varBounce().in}>
            <Button
              component="a"
              target="_blank"
              href={paths.pricing}
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              Upgrade Plan
            </Button>
          </m.div>

          <m.div variants={varBounce().in}>
            <ForbiddenIllustration
              sx={{
                height: 260,
                my: { xs: 5, sm: 10 },
              }}
            />
          </m.div>
        </Container>
      ) : null;
    }
  }

  return <>{children}</>;
}
