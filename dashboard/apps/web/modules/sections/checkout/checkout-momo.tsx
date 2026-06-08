'use client';

import { Divider } from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { IPayment, paymentCodePrefix, paymentMomoInfo } from '@seven-auto/libs';
import CopyIcon from 'modules/atoms/copy-icon';
import Image from 'modules/components/image';
import { useTranslate } from 'modules/locales';
import { fCurrency } from 'modules/utils/format-number';

// ----------------------------------------------------------------------

export default function CheckoutMomo({ payment }: { payment: IPayment }) {
  const { t } = useTranslate();

  return (
    <Stack spacing={2}>
      <Typography variant="h6">{t('checkouts.momoGuide')}</Typography>

      <Stack
        sx={{
          p: 2,
          borderRadius: 2,
          bgcolor: 'background.neutral',
        }}
        spacing={1}
      >
        <Box
          sx={{
            gap: 1,
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              md: 'repeat(2, 1fr)',
            },
          }}
        >
          <Box>
            <Typography
              variant="h6"
              sx={{
                mb: 0.5,
              }}
            >
              {t('checkouts.amountPay')}
            </Typography>
            <Typography
              sx={{
                color: 'primary.main',
              }}
              variant="h4"
            >
              {fCurrency(payment.price || 0)}đ{' '}
              <CopyIcon text={payment.price?.toString() || ''} />
            </Typography>
          </Box>
          <Box>
            <Typography
              variant="h6"
              sx={{
                mb: 0.5,
              }}
            >
              {t('basic.content')}
            </Typography>
            <Typography
              sx={{
                color: 'secondary.main',
              }}
              variant="h4"
            >
              {paymentCodePrefix}
              {payment.uniqueId?.toUpperCase()}
              <CopyIcon
                text={`${paymentCodePrefix}${payment.uniqueId?.toUpperCase()}`}
              />
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ borderStyle: 'dashed' }} />
        <Box
          sx={{
            gap: 1,
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              md: 'repeat(2, 1fr)',
            },
          }}
        >
          <Box>
            <Typography
              variant="h6"
              sx={{
                mb: 0.5,
              }}
            >
              {t('basic.phone')}
            </Typography>
            <Typography variant="body1">
              {paymentMomoInfo.phoneNumber}
              <CopyIcon text={paymentMomoInfo.phoneNumber} />
            </Typography>
          </Box>
          <Box>
            <Typography
              variant="h6"
              sx={{
                mb: 0.5,
              }}
            >
              {t('basic.name')}
            </Typography>
            <Typography variant="body1">
              {paymentMomoInfo.name}
              <CopyIcon text={paymentMomoInfo.name} />
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />
        <Stack
          spacing={1}
          sx={{
            mt: 2,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6">{t('checkouts.momoScan')}</Typography>
          <Image
            src="/assets/placeholder.svg"
            alt="momo-qr-code"
            sx={{
              borderRadius: 1,
              width: '360px',
              height: '360px',
            }}
          />
        </Stack>
      </Stack>
    </Stack>
  );
}
