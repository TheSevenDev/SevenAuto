import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { alpha, styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { paths } from '@seven-auto/libs';
import { useQuery } from '@tanstack/react-query';
import { m, useScroll } from 'framer-motion';
import lodash from 'lodash';
import { MotionContainer, varFade } from 'modules/components/animate';
import Iconify from 'modules/components/iconify';
import { queryName } from 'modules/const/query-name';
import { useResponsive } from 'modules/hooks/use-responsive';
import { HEADER } from 'modules/layouts/config-layout';
import { useTranslate } from 'modules/locales';
import { RouterLink } from 'modules/routes/components';
import apiServices from 'modules/services/apiService';
import { bgBlur, bgGradient, textGradient } from 'modules/theme/css';
import { fCommas } from 'modules/utils/format-number';
import { useCallback, useEffect, useRef, useState } from 'react';
import { TypeAnimation } from 'react-type-animation';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  ...bgGradient({
    color: alpha(
      theme.palette.background.default,
      theme.palette.mode === 'light' ? 0.9 : 0.94,
    ),
    imgUrl: '/assets/background/overlay_3.jpg',
  }),
  width: '100%',
  height: '100vh',
  position: 'relative',
  [theme.breakpoints.up('md')]: {
    top: 0,
    left: 0,
    position: 'fixed',
  },
}));

const StyledWrapper = styled('div')(({ theme }) => ({
  height: '100%',
  overflow: 'hidden',
  position: 'relative',
  [theme.breakpoints.up('md')]: {
    marginTop: HEADER.H_DESKTOP_OFFSET,
  },
}));

const StyledTextGradient = styled(m.h1)(({ theme }) => ({
  ...textGradient(
    `300deg, ${theme.palette.primary.main} 0%, ${theme.palette.warning.main} 25%, ${theme.palette.primary.main} 50%, ${theme.palette.warning.main} 75%, ${theme.palette.primary.main} 100%`,
  ),
  padding: 0,
  marginTop: 8,
  lineHeight: 1,
  fontWeight: 900,
  marginBottom: 24,
  letterSpacing: 8,
  textAlign: 'center',
  backgroundSize: '400%',
  fontSize: `${64 / 16}rem`,
  fontFamily: theme.typography.fontSecondaryFamily,
  [theme.breakpoints.up('md')]: {
    fontSize: `${96 / 16}rem`,
  },
}));

const StyledEllipseTop = styled('div')(({ theme }) => ({
  top: -80,
  width: 480,
  right: -80,
  height: 480,
  borderRadius: '50%',
  position: 'absolute',
  filter: 'blur(100px)',
  WebkitFilter: 'blur(100px)',
  backgroundColor: alpha(theme.palette.primary.darker, 0.12),
}));

const StyledEllipseBottom = styled('div')(({ theme }) => ({
  height: 400,
  bottom: -200,
  left: '10%',
  right: '10%',
  borderRadius: '50%',
  position: 'absolute',
  filter: 'blur(100px)',
  WebkitFilter: 'blur(100px)',
  backgroundColor: alpha(theme.palette.primary.darker, 0.12),
}));

type StyledPolygonProps = {
  opacity?: number;
  anchor?: 'left' | 'right';
};

const StyledPolygon = styled('div')<StyledPolygonProps>(
  ({ opacity = 1, anchor = 'left', theme }) => ({
    ...bgBlur({
      opacity,
      color: theme.palette.background.default,
    }),
    zIndex: 9,
    bottom: 0,
    height: 80,
    width: '50%',
    position: 'absolute',
    clipPath: 'polygon(0% 0%, 100% 100%, 0% 100%)',
    ...(anchor === 'left' && {
      left: 0,
      ...(theme.direction === 'rtl' && {
        transform: 'scale(-1, 1)',
      }),
    }),
    ...(anchor === 'right' && {
      right: 0,
      transform: 'scaleX(-1)',
      ...(theme.direction === 'rtl' && {
        transform: 'scaleX(1)',
      }),
    }),
  }),
);

// ----------------------------------------------------------------------

export default function HomeHero() {
  const { t } = useTranslate();
  const mdUp = useResponsive('up', 'md');

  const heroRef = useRef<HTMLDivElement | null>(null);

  const { scrollY } = useScroll();

  const [percent, setPercent] = useState(0);

  const getScroll = useCallback(() => {
    let heroHeight = 0;

    if (heroRef.current) {
      heroHeight = heroRef.current.offsetHeight;
    }

    scrollY.on('change', (scrollHeight) => {
      const scrollPercent = (scrollHeight * 100) / heroHeight;

      setPercent(Math.floor(scrollPercent));
    });
  }, [scrollY]);

  useEffect(() => {
    getScroll();
  }, [getScroll]);

  const { data: usersCount = 0, isLoading: isUsersCountLoading } = useQuery({
    queryKey: [queryName.GET_USERS_COUNT],
    queryFn: () => apiServices.user.getCount(),
  });

  const opacity = 1 - percent / 100;

  const hide = percent > 120;

  const renderDescription = (
    <Stack
      sx={{
        alignItems: 'center',
        justifyContent: 'center',
        height: 1,
        mx: 'auto',
        opacity: opacity > 0 ? opacity : 0,
        mt: {
          md: `-${HEADER.H_DESKTOP + percent * 2.5}px`,
        },
      }}
    >
      <m.div variants={varFade().in}>
        <Typography
          variant="h2"
          sx={{
            display: 'flex',
            gap: 1,
            flexDirection: { xs: 'column', md: 'row' },
          }}
        >
          {t('home.hero.title')}
          <TypeAnimation
            sequence={[
              t('home.hero.title1'),
              2000,
              t('home.hero.title2'),
              2000,
            ]}
            wrapper="span"
            speed={50}
            style={{
              fontSize: 'inherit',
              textDecoration: 'underline',
              display: 'inline-block',
            }}
            repeat={Infinity}
          />
        </Typography>
      </m.div>

      <m.div variants={varFade().in}>
        <StyledTextGradient
          animate={{ backgroundPosition: '200% center' }}
          transition={{
            repeatType: 'reverse',
            ease: 'linear',
            duration: 20,
            repeat: Infinity,
          }}
        >
          {isUsersCountLoading ? '...' : `${fCommas(usersCount * 4)}+`}
        </StyledTextGradient>
      </m.div>

      <m.div variants={varFade().in}>
        <Typography variant="h5" sx={{ textAlign: 'center' }}>
          {t('home.hero.description')}
        </Typography>
      </m.div>

      <m.div variants={varFade().in}>
        <Stack
          spacing={1.5}
          direction={{ xs: 'column-reverse', sm: 'row' }}
          sx={{ mt: 5, mb: 5 }}
        >
          <Stack spacing={2} sx={{ alignItems: 'center' }}>
            <Button
              component={RouterLink}
              href={paths.dashboard.root}
              color="inherit"
              size="large"
              variant="contained"
              startIcon={<Iconify icon="eva:flash-fill" width={24} />}
            >
              {lodash.capitalize(t('home.hero.action1'))}
            </Button>
          </Stack>

          <Button
            color="primary"
            size="large"
            variant="contained"
            startIcon={<Iconify icon="material-symbols:dashboard" width={24} />}
            target="_blank"
            rel="noopener"
            href={paths.dashboard.root}
            sx={{ borderColor: 'text.primary' }}
          >
            {lodash.capitalize(t('home.hero.action3'))}
          </Button>
        </Stack>
      </m.div>
    </Stack>
  );

  const renderPolygons = (
    <>
      <StyledPolygon />
      <StyledPolygon anchor="right" opacity={0.48} />
      <StyledPolygon
        anchor="right"
        opacity={0.48}
        sx={{ height: 48, zIndex: 10 }}
      />
      <StyledPolygon anchor="right" sx={{ zIndex: 11, height: 24 }} />
    </>
  );

  const renderEllipses = (
    <>
      {mdUp && <StyledEllipseTop />}
      <StyledEllipseBottom />
    </>
  );

  return (
    <>
      <StyledRoot
        ref={heroRef}
        sx={{
          ...(hide && {
            opacity: 0,
          }),
        }}
      >
        <StyledWrapper>
          <Container component={MotionContainer} sx={{ height: 1 }}>
            <Grid container columnSpacing={{ md: 10 }} sx={{ height: 1 }}>
              <Grid size={{ xs: 12, md: 12 }} sx={{ width: '100%' }}>
                {renderDescription}
              </Grid>

              {/* {mdUp && <Grid md={6}>{renderSlides}</Grid>} */}
            </Grid>
          </Container>

          {renderEllipses}
        </StyledWrapper>
      </StyledRoot>

      {mdUp && renderPolygons}

      <Box sx={{ height: { md: '100vh' } }} />
    </>
  );
}
