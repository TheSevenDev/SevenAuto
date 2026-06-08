'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import { getFullAddress, IUser } from '@seven-auto/libs';
import Iconify from 'modules/components/iconify';
import { useTranslate } from 'modules/locales';
import {
  getSocialUserNameFromUrl,
  parseUserSocialLinks,
} from 'modules/utils/socials';

// ----------------------------------------------------------------------

type Props = {
  info: IUser;
};

export default function Home({ info }: Props) {
  const { t } = useTranslate();

  const socials = parseUserSocialLinks(info?.socials);

  const fullAddress = getFullAddress(info);

  const renderAbout = (
    <Card>
      <CardHeader title={t('users.about')} />

      <Stack spacing={2} sx={{ p: 3 }}>
        {info?.about && (
          <Box sx={{ typography: 'body2', whiteSpace: 'pre-line' }}>
            {info?.about}
          </Box>
        )}
        {fullAddress && (
          <Stack direction="row" spacing={2}>
            <Iconify icon="mingcute:location-fill" width={24} />

            <Box sx={{ typography: 'body2' }}>
              {t(`users.liveAt`)}{' '}
              <Link variant="subtitle2" color="inherit">
                {fullAddress}
              </Link>
            </Box>
          </Stack>
        )}
        {info?.email && (
          <Stack direction="row" sx={{ typography: 'body2' }}>
            <Iconify icon="fluent:mail-24-filled" width={24} sx={{ mr: 2 }} />
            {info?.email}
          </Stack>
        )}
        {info?.phone && (
          <Stack direction="row" spacing={2}>
            <Iconify icon="ic:round-phone" width={24} />

            <Box sx={{ typography: 'body2' }}>
              <Link variant="subtitle2" color="inherit">
                {info?.phone}
              </Link>
            </Box>
          </Stack>
        )}
      </Stack>
    </Card>
  );

  const renderSocials = (
    <Card>
      <CardHeader title={t('users.social')} />

      <Stack spacing={2} sx={{ p: 3 }}>
        {socials.map(
          (
            link: { url: string; icon: string; color: string },
            index: number,
          ) => {
            if (!link.url) return null;
            return (
              <Stack
                key={`social-${index}`}
                spacing={2}
                direction="row"
                sx={{ wordBreak: 'break-all', typography: 'body2' }}
              >
                <Iconify
                  icon={link.icon}
                  width={24}
                  sx={{
                    flexShrink: 0,
                    color: link.color,
                  }}
                />
                <Link
                  sx={{
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'none',
                    },
                  }}
                  href={link.url}
                  target="_blank"
                  color="inherit"
                >
                  @{getSocialUserNameFromUrl(link.url)}
                </Link>
              </Stack>
            );
          },
        )}
      </Stack>
    </Card>
  );

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 4 }}>
        <Stack spacing={3}>
          {renderAbout}
          {renderSocials}
        </Stack>
      </Grid>
      <Grid size={{ xs: 12, md: 8 }}>{/* TODO: Add feed */}</Grid>
    </Grid>
  );
}
