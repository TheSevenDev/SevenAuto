import {
  Alert,
  Box,
  Button,
  Divider,
  Fab,
  Stack,
  TextField,
  Theme,
  Typography,
} from '@mui/material';
import {
  conversionRateCreditToCommission,
  EBalanceType,
  handleErrorResponse,
  ITransactionConvertCommission,
} from '@seven-auto/libs';
import { useMutation } from '@tanstack/react-query';
import CommissionIcon from 'modules/atoms/commission-icon';
import CreditIcon from 'modules/atoms/credit-icon';
import { useAuthContext } from 'modules/auth/hooks';
import Iconify from 'modules/components/iconify';
import { enqueueSnackbar } from 'modules/components/snackbar';
import { useResponsive } from 'modules/hooks/use-responsive';
import { useTranslate } from 'modules/locales';
import apiServices from 'modules/services/apiService';
import { getBalanceColorBg, getBalanceThemeColor } from 'modules/utils/balance';
import { fNumber } from 'modules/utils/format-number';
import { useState } from 'react';

interface IProps {
  onCallBack: () => void;
}

export default function ConvertCommissionForm({ onCallBack }: IProps) {
  const { t } = useTranslate();
  const { currentUser, reloadCurrentUser } = useAuthContext();
  const [amount, setAmount] = useState<number>(0);
  const mdUp = useResponsive('up', 'md');

  const { mutate: convertCommission, isPending } = useMutation({
    mutationFn: (data: ITransactionConvertCommission) =>
      apiServices.transaction.convertCommission(data),

    onSuccess: () => {
      reloadCurrentUser();
      enqueueSnackbar(t('payments.convertCommissionSuccess'), {
        variant: 'success',
      });
      onCallBack();
    },
    onError: (error) => {
      enqueueSnackbar(
        t(handleErrorResponse(error, 'payments.convertCommissionFailed')),
        {
          variant: 'error',
        },
      );
    },
  });

  const handleConvertCommission = async () => {
    await convertCommission({
      amount: Math.floor(amount * conversionRateCreditToCommission),
    });
  };

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
        <Stack spacing={1} sx={{ width: 1 }}>
          <Typography variant="subtitle1">
            {t(`balance.types.${EBalanceType.COMMISSION}`)}
          </Typography>
          <Box
            sx={{
              width: 1,
              display: 'flex',
              justifyContent: 'space-between',
              position: 'relative',
              p: 1.5,
              borderRadius: 1,
              cursor: 'pointer',
              overflow: 'visible',
              backgroundColor: getBalanceColorBg(EBalanceType.COMMISSION),
              boxShadow: (theme: Theme) =>
                `0 0 0 2px ${
                  theme.palette[getBalanceThemeColor(EBalanceType.COMMISSION)]
                    .main
                }`,
            }}
          >
            <Typography variant="subtitle1">
              {fNumber(currentUser?.commissions || 0) || 0}
            </Typography>
            <CommissionIcon />
          </Box>
          <TextField
            sx={{ mt: 2 }}
            label={t('basic.amount')}
            type="number"
            autoFocus
            required
            fullWidth
            variant="outlined"
            disabled
            value={amount * conversionRateCreditToCommission}
          />
        </Stack>
        <Box>
          <Fab size="small" color="primary">
            <Iconify icon="bi:arrow-right" />
          </Fab>
        </Box>
        <Stack spacing={1} sx={{ width: 1 }}>
          <Typography variant="subtitle1">{t('credits.credits')}</Typography>
          <Box
            sx={{
              width: 1,
              display: 'flex',
              justifyContent: 'space-between',
              position: 'relative',
              p: 1.5,
              borderRadius: 1,
              cursor: 'pointer',
              overflow: 'visible',
              backgroundColor: getBalanceColorBg(EBalanceType.CREDIT),
              boxShadow: (theme: Theme) =>
                `0 0 0 2px ${
                  theme.palette[getBalanceThemeColor(EBalanceType.CREDIT)].main
                }`,
            }}
          >
            <Typography variant="subtitle1">
              {fNumber(currentUser?.credits || 0) || 0}
            </Typography>
            <CreditIcon />
          </Box>
          <TextField
            sx={{ mt: 2 }}
            label={t('basic.receiveAmount')}
            type="number"
            fullWidth
            variant="outlined"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            slotProps={{
              input: {
                inputProps: {
                  type: 'number',
                  min: 1,
                  max:
                    (currentUser?.commissions || 0) /
                    conversionRateCreditToCommission,
                },
                endAdornment: mdUp ? (
                  <Button
                    onClick={() =>
                      setAmount(
                        Math.floor(
                          (currentUser?.commissions || 0) /
                            conversionRateCreditToCommission,
                        ) || 0,
                      )
                    }
                    color="primary"
                  >
                    {t('basic.max')}
                  </Button>
                ) : null,
              },
            }}
          />
        </Stack>
      </Stack>
      <Alert severity="info" sx={{ borderRadius: 1 }}>
        {t('payments.convertCommissionInfo')}
      </Alert>
      <Divider />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Button
          loading={isPending}
          onClick={handleConvertCommission}
          disabled={amount <= 0 || amount > (currentUser?.commissions || 0)}
          variant="contained"
          color="primary"
        >
          {t('basic.convert')}
        </Button>
      </Box>
    </Stack>
  );
}
