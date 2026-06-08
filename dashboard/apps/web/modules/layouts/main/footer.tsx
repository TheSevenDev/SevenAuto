import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { paths } from '@seven-auto/libs';
import Iconify from 'modules/components/iconify';
import Logo from 'modules/components/logo';
import SiteName from 'modules/components/site-name';
import { MAIN_URL } from 'modules/config-global';
import { useGlobalContext } from 'modules/context/global/use-global-context';
import { useTranslate } from 'modules/locales';
import { usePathname } from 'modules/routes/hooks';
import { Fragment } from 'react';

// ----------------------------------------------------------------------

interface ILinkItem {
  icon: string;
  name: string;
  href: string;
  target?: string;
}

interface ILink {
  headline: string;
  children: ILinkItem[];
}

export default function Footer() {
  const pathname = usePathname();
  const { siteInfo } = useGlobalContext();
  const { t } = useTranslate();

  const socials = JSON.parse(siteInfo?.siteSocial || '[]');

  const homePage = pathname === '/';

  const LINKS: ILink[] = [
    {
      headline: t('footer.company'),
      children: [
        {
          icon: '',
          name: t('footer.aboutUs'),
          href: paths.about,
        },
        { icon: '', name: t('footer.contact'), href: paths.contact },
        { icon: '', name: t('footer.faqs'), href: paths.faqs },
      ],
    },
    {
      headline: t('footer.legal'),
      children: [],
    },
    {
      headline: t('footer.contact'),
      children: [
        {
          icon: 'eva:email-outline',
          name: siteInfo?.siteEmail || '',
          href: `mailto:${siteInfo?.siteEmail}`,
        },
        {
          icon: 'eva:phone-outline',
          name: siteInfo?.sitePhone || '',
          href: `tel:${siteInfo?.sitePhone}`,
        },
      ],
    },
  ];

  const copyRight = (
    <Typography variant="caption" component="div">
      © {new Date().getFullYear()}. All rights reserved made by
      <Link href={MAIN_URL}> {siteInfo?.siteCopyright} </Link>
    </Typography>
  );

  const simpleFooter = (
    <Box
      component="footer"
      sx={{
        py: 5,
        textAlign: 'center',
        position: 'relative',
        bgcolor: 'background.default',
      }}
    >
      <Container>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mb: 1,
            gap: 1,
          }}
        >
          <Logo />
          <SiteName />
        </Box>

        {copyRight}
      </Container>
    </Box>
  );

  const mainFooter = (
    <Box
      component="footer"
      sx={{
        position: 'relative',
        bgcolor: 'background.default',
      }}
    >
      <Divider />

      <Container
        sx={{
          pt: 10,
          pb: 5,
          textAlign: { xs: 'center', md: 'unset' },
        }}
      >
        <Stack
          direction="row"
          sx={{
            mb: { xs: 1, md: 3 },
            justifyContent: { xs: 'center', md: 'flex-start' },
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Logo />
          <SiteName />
        </Stack>
        <Grid
          container
          sx={{
            justifyContent: { xs: 'center', md: 'space-between' },
          }}
        >
          <Grid size={{ xs: 8, md: 3 }}>
            <Typography
              variant="body2"
              sx={{
                maxWidth: 270,
                mx: { xs: 'auto', md: 'unset' },
              }}
            >
              {siteInfo?.siteDescription}
            </Typography>

            <Stack
              direction="row"
              sx={{
                justifyContent: { xs: 'center', md: 'flex-start' },
                mt: 3,
                mb: { xs: 5, md: 0 },
              }}
            >
              {socials.map(
                (
                  link: { url: string; icon: string; color: string },
                  index: number,
                ) => {
                  if (!link.url) return null;
                  return (
                    <Link
                      key={`social-${index}`}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <IconButton
                        key={link.url + link.icon}
                        sx={{
                          '&:hover': {
                            bgcolor: alpha(link.color, 0.08),
                          },
                        }}
                      >
                        <Iconify color={link.color} icon={link.icon} />
                      </IconButton>
                    </Link>
                  );
                },
              )}
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={3} direction={{ xs: 'column', md: 'row' }}>
              {LINKS.map((list) => (
                <Stack
                  key={list.headline}
                  spacing={2}
                  sx={{
                    width: 1,
                    alignItems: { xs: 'center', md: 'flex-start' },
                  }}
                >
                  <Typography component="div" variant="overline">
                    {list.headline}
                  </Typography>

                  {list.children.map((link, index) => {
                    if (!link.name) return <Fragment key={index} />;
                    return (
                      <Link
                        key={index}
                        href={link.href}
                        color="inherit"
                        variant="body2"
                        target={link.target || '_self'}
                        sx={{ display: 'flex', alignItems: 'center' }}
                      >
                        {link && link.icon && (
                          <Iconify
                            icon={link.icon}
                            color="primary.main"
                            sx={{ width: 20, height: 20, mr: 0.5 }}
                          />
                        )}
                        {link.name}
                      </Link>
                    );
                  })}
                </Stack>
              ))}
            </Stack>
          </Grid>
        </Grid>
        {copyRight}
      </Container>
    </Box>
  );

  return homePage ? simpleFooter : mainFooter;
}
