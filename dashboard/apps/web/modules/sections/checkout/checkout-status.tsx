'use client';

import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { paths } from '@seven-auto/libs';
import Iconify from 'modules/components/iconify';
import Image from 'modules/components/image';
import { useTranslate } from 'modules/locales';

// ----------------------------------------------------------------------

export default function CheckoutStatus({
  status,
}: {
  status: 'success' | 'processing' | 'failed' | 'cancel';
}) {
  const { t } = useTranslate();

  return (
    <Stack spacing={2}>
      <Stack
        sx={{
          p: {
            xs: 1,
            md: 5,
          },
          borderRadius: 2,
          bgcolor: 'background.neutral',
          alignItems: 'center',
        }}
        spacing={2}
      >
        <Image
          src={`/assets/images/checkout/${status}.png`}
          alt="momo-qr-code"
          sx={{
            borderRadius: 1,
            width: '100px',
            height: 'auto',
          }}
        />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Typography variant="h6">
            {t(`checkouts.status.${status}`)}
          </Typography>
          <Typography variant="body2">
            {t(`checkouts.status.${status}Description`)}
          </Typography>
        </Box>
        {(status === 'failed' || status === 'cancel') && (
          <Button
            component="a"
            href={paths.contact}
            target="_blank"
            variant="contained"
            size="large"
            color="info"
          >
            <Iconify icon="flat-color-icons:online-support" sx={{ mr: 1 }} />
            {t('common.contactSupport')}
          </Button>
        )}
      </Stack>
    </Stack>
  );
}
