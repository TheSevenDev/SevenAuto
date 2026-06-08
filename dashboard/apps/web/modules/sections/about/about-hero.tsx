import Box, { BoxProps } from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { m, MotionProps } from 'framer-motion';
import { MotionContainer, varFade } from 'modules/components/animate';
import { useTranslate } from 'modules/locales';

// ----------------------------------------------------------------------

export default function AboutHero() {
  const { t } = useTranslate();

  return (
    <Box
      sx={{
        height: { md: 560 },
        py: { xs: 10, md: 0 },
        overflow: 'hidden',
        position: 'relative',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundImage:
          'url(/assets/background/overlay_1.svg), url(/assets/images/about/hero.jpg)',
      }}
    >
      <Container component={MotionContainer}>
        <Box
          sx={{
            bottom: { md: 80 },
            position: { md: 'absolute' },
            textAlign: {
              xs: 'center',
              md: 'unset',
            },
          }}
        >
          <TextAnimate
            text={t('aboutUs.who')}
            variants={varFade().inRight}
            sx={{ color: 'primary.main' }}
          />

          <br />

          <Stack
            spacing={2}
            direction="row"
            sx={{ color: 'common.white', display: 'inline-flex' }}
          >
            <TextAnimate text={t('aboutUs.weAre')} />
          </Stack>

          <m.div variants={varFade().inRight}>
            <Typography
              variant="h4"
              sx={{
                mt: 3,
                color: 'common.white',
                fontWeight: 'fontWeightSemiBold',
              }}
            >
              {t('aboutUs.slogan')}
            </Typography>
          </m.div>
        </Box>
      </Container>
    </Box>
  );
}

// ----------------------------------------------------------------------

type TextAnimateProps = BoxProps &
  MotionProps & {
    text: string;
  };

function TextAnimate({ text, variants, sx, ...other }: TextAnimateProps) {
  return (
    <Box
      component={m.div}
      sx={{
        typography: 'h1',
        overflow: 'hidden',
        display: 'inline-flex',
        ...sx,
      }}
      {...other}
    >
      {text.split('').map((letter, index) => (
        <m.span key={index} variants={variants || varFade().inUp}>
          {letter === ' ' ? '\u00A0' : letter}
        </m.span>
      ))}
    </Box>
  );
}
