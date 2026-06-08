import { Stack } from '@mui/material';
import Container from '@mui/material/Container';
import { SxProps, Theme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { m } from 'framer-motion';
import { ForbiddenIllustration } from 'modules/assets/illustrations';
import { MotionContainer, varBounce } from 'modules/components/animate';
import { useTranslate } from 'modules/locales';

interface IProps {
  sx?: SxProps<Theme>;
  actions?: React.ReactNode;
}

export default function NoPermission({ sx, actions }: IProps) {
  const { t } = useTranslate();

  return (
    <Container component={MotionContainer} sx={{ textAlign: 'center', ...sx }}>
      <m.div variants={varBounce().in}>
        <Typography variant="h3" sx={{ mb: 2 }}>
          {t('permissions.denied')}
        </Typography>
      </m.div>

      <m.div variants={varBounce().in}>
        <Typography sx={{ color: 'text.secondary' }}>
          {t('permissions.deniedMessage')}
        </Typography>
      </m.div>

      <m.div variants={varBounce().in}>
        <ForbiddenIllustration
          sx={{
            height: 260,
            my: { xs: 5, sm: 10 },
          }}
        />
      </m.div>
      <m.div variants={varBounce().in}>
        <Stack spacing={2} direction="row" sx={{ justifyContent: 'center' }}>
          {actions}
        </Stack>
      </m.div>
    </Container>
  );
}
