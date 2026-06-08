import { Button } from '@mui/material';
import Box, { BoxProps } from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {
  EPaymentType,
  handleErrorResponse,
  paths,
  paymentPackages,
} from '@seven-auto/libs';
import { useAuthContext } from 'modules/auth/hooks';
import { enqueueSnackbar } from 'modules/components/snackbar';
import { useTranslate } from 'modules/locales';
import apiServices from 'modules/services/apiService';
import { fCurrency } from 'modules/utils/format-number';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// ----------------------------------------------------------------------

interface IProps extends BoxProps {
  paymentOption: {
    package: string;
    method: EPaymentType;
  };
}

export default function PaymentSummary({
  paymentOption,
  sx,
  ...other
}: IProps) {
  const { t } = useTranslate();
  const router = useRouter();
  const { currentUser, setOpenDialog } = useAuthContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onCheckout = async () => {
    if (!currentUser) {
      setOpenDialog(true, async () => {});
      return;
    }
    const currentPackage = paymentPackages.find(
      (option) => option.key === paymentOption.package,
    );
    const amount = currentPackage?.credits || 0;
    const price = currentPackage?.price || 0;

    if (amount === 0) {
      enqueueSnackbar(t('payments.invalidPackage'), {
        variant: 'error',
      });
      return;
    }
    try {
      const res = await apiServices.payment.createPayment({
        amount,
        type: paymentOption.method,
        userId: currentUser?.id || '',
        price,
      });
      if (res && res.id) {
        router.push(paths.checkout(res.id));
      } else {
        enqueueSnackbar(t('basic.submitFailed'), {
          variant: 'error',
        });
      }
    } catch (error) {
      enqueueSnackbar(t(handleErrorResponse(error, 'basic.submitFailed')), {
        variant: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const price =
    paymentPackages.find((option) => option.key === paymentOption.package)
      ?.price || 0;

  const renderPrice = (
    <Stack direction="row" sx={{ justifyContent: 'flex-end' }}>
      <Typography variant="h2">{fCurrency(price)}</Typography>
      <Typography variant="h4">đ</Typography>
    </Stack>
  );

  return (
    <Box
      sx={{
        p: 5,
        borderRadius: 2,
        bgcolor: 'background.neutral',
        ...sx,
      }}
      {...other}
    >
      <Typography variant="h6" sx={{ mb: 5 }}>
        {t('payments.summary')}
      </Typography>

      <Stack spacing={2.5}>
        <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {t('payments.paymentPrice')}
          </Typography>
        </Stack>
        {renderPrice}
        <Divider sx={{ borderStyle: 'dashed' }} />
        <Stack
          direction="row"
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="subtitle1">
            {t('payments.totalBilled')}
          </Typography>
          <Typography variant="subtitle1">{fCurrency(price)}đ</Typography>
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />
      </Stack>
      <Button
        fullWidth
        size="large"
        variant="contained"
        sx={{ mt: 5, mb: 3 }}
        onClick={onCheckout}
        loading={isSubmitting}
      >
        {t('payments.checkout')}
      </Button>

      {/* <Stack alignItems="center" spacing={1}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify
            icon="solar:shield-check-bold"
            sx={{ color: 'success.main' }}
          />
          <Typography variant="subtitle2">
            Secure credit card payment
          </Typography>
        </Stack>

        <Typography
          variant="caption"
          sx={{ color: 'text.disabled', textAlign: 'center' }}
        >
          This is a secure 128-bit SSL encrypted payment
        </Typography>
      </Stack> */}
    </Box>
  );
}
