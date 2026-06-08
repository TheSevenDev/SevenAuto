import { Box } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import { paths } from '@seven-auto/libs';
import Logo from 'modules/components/logo';
import SiteName from 'modules/components/site-name';
import { useOffSetTop } from 'modules/hooks/use-off-set-top';
import { useTranslate } from 'modules/locales';
import { RouterLink } from 'modules/routes/components';
import { bgBlur } from 'modules/theme/css';

import { HEADER } from '../config-layout';
import HeaderShadow from './header-shadow';
import ThemeButton from './theme-button';

// ----------------------------------------------------------------------

export default function HeaderSimple() {
  const theme = useTheme();
  const { t } = useTranslate();
  const offsetTop = useOffSetTop(HEADER.H_DESKTOP);

  return (
    <AppBar>
      <Toolbar
        sx={{
          justifyContent: 'space-between',
          height: {
            xs: HEADER.H_MOBILE,
            md: HEADER.H_DESKTOP,
          },
          transition: theme.transitions.create(['height'], {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.shorter,
          }),
          ...(offsetTop && {
            ...bgBlur({
              color: theme.palette.background.default,
            }),
            height: {
              md: HEADER.H_DESKTOP_OFFSET,
            },
          }),
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Logo />
          <SiteName />
        </Box>

        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <ThemeButton />
          <Link
            href={paths.faqs}
            component={RouterLink}
            color="inherit"
            sx={{ typography: 'subtitle2' }}
          >
            {t('need_help')}
          </Link>
        </Stack>
      </Toolbar>

      {offsetTop && <HeaderShadow />}
    </AppBar>
  );
}
