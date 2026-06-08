import {
  Avatar,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  ListItemText,
} from '@mui/material';
import Box, { BoxProps } from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {
  EPaymentType,
  EStatusProcess,
  getDisplayName,
  handleErrorResponse,
  IPayment,
} from '@seven-auto/libs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import CreditIcon from 'modules/atoms/credit-icon';
import UserDisplayName from 'modules/atoms/user-display-name';
import { useAuthContext } from 'modules/auth/hooks';
import { ConfirmDialog } from 'modules/components/custom-dialog';
import Label from 'modules/components/label';
import { enqueueSnackbar } from 'modules/components/snackbar';
import { queryName } from 'modules/const/query-name';
import { useBoolean } from 'modules/hooks/use-boolean';
import { useTranslate } from 'modules/locales';
import apiServices from 'modules/services/apiService';
import { fCurrency, fNumber } from 'modules/utils/format-number';
import { getStatusProcessColor } from 'modules/utils/general';
import { getMediaUrl } from 'modules/utils/get-media-url';
import { useState } from 'react';

import PaymentMethods from '../payment/payment-methods';

// ----------------------------------------------------------------------

interface IProps extends BoxProps {
  payment: IPayment;
  setPayment: (newValue: IPayment) => void;
}

export default function CheckoutSummary({
  payment,
  setPayment,
  sx,
  ...other
}: IProps) {
  const { t } = useTranslate();
  const { currentUser, setOpenDialog } = useAuthContext();
  const changePayment = useBoolean();
  const [currentMethod, setCurrentMethod] = useState<EPaymentType>(
    payment.type || EPaymentType.MOMO,
  );
  const confirmCancel = useBoolean();
  const queryClient = useQueryClient();

  const mutationCancel = useMutation({
    mutationFn: () => apiServices.payment.cancelPayment(payment.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryName.GET_PAYMENTS] });
      queryClient.invalidateQueries({
        queryKey: [queryName.GET_PAYMENT_SUMMARY],
      });
      queryClient.refetchQueries({
        queryKey: [queryName.GET_PAYMENT, payment.id],
      });
      enqueueSnackbar(t('basic.cancelSuccess'), {
        variant: 'success',
      });
      setPayment({
        ...payment,
        status: EStatusProcess.CANCELED,
      });
      changePayment.onFalse();
    },
    onError: (error) => {
      enqueueSnackbar(t(handleErrorResponse(error, 'basic.cancelFailed')), {
        variant: 'error',
      });
    },
  });

  const mutationUpdatePayment = useMutation({
    mutationFn: (type: EPaymentType) =>
      apiServices.payment.updatePayment(payment.id, {
        type,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryName.GET_PAYMENTS] });
      queryClient.invalidateQueries({
        queryKey: [queryName.GET_PAYMENT_SUMMARY],
      });
      queryClient.refetchQueries({
        queryKey: [queryName.GET_PAYMENT, payment.id],
      });
      enqueueSnackbar(t('basic.changeSuccess'), {
        variant: 'success',
      });
      setPayment({
        ...payment,
        type: currentMethod,
      });
      changePayment.onFalse();
    },
    onError: (error) => {
      enqueueSnackbar(t(handleErrorResponse(error, 'basic.changeFailed')), {
        variant: 'error',
      });
    },
  });

  return (
    <Stack spacing={2}>
      <Box
        sx={{
          p: 3,
          borderRadius: 2,
          bgcolor: 'background.neutral',
          ...sx,
        }}
        {...other}
      >
        <Typography variant="h6" sx={{ mb: 5 }}>
          {t('payments.summary')}
        </Typography>

        <Stack spacing={2}>
          <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              {t('payments.orderCode')}
            </Typography>
            <Label color="success">
              {payment.uniqueId?.toUpperCase() || 'N/A'}
            </Label>
          </Stack>
          <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              {t('basic.status')}
            </Typography>
            <Label color={getStatusProcessColor(payment.status)}>
              {t(`payments.status.${payment.status}`)}
            </Label>
          </Stack>
          {payment.amount && (
            <Stack
              sx={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                {t('credits.label')}
              </Typography>
              <Label color="primary">
                + {fNumber(payment.amount || 0)}
                <CreditIcon sx={{ ml: 0.5 }} />
              </Label>
            </Stack>
          )}
          {payment.content && (
            <Stack
              sx={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <Typography
                variant="body1"
                sx={{ color: 'text.secondary', whiteSpace: 'pre-wrap' }}
              >
                {payment.content}
              </Typography>
            </Stack>
          )}
          <Divider sx={{ borderStyle: 'dashed' }} />
          <Stack direction="column" spacing={1}>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              {t('payments.method')}
            </Typography>
            <Stack
              direction="row"
              spacing={1}
              sx={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Chip
                label={t(`payments.methods.${payment.type}`)}
                color="info"
              />
              {payment.status === EStatusProcess.PENDING && (
                <Button
                  onClick={() => {
                    if (!currentUser) {
                      setOpenDialog(true, async () => {});
                      return;
                    }
                    changePayment.onTrue();
                  }}
                  variant="text"
                  size="small"
                >
                  {t('basic.change')}
                </Button>
              )}
            </Stack>
          </Stack>
          <Divider sx={{ borderStyle: 'dashed' }} />
          {payment.user && (
            <Stack direction="column" spacing={1}>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                {t('payments.customer')}
              </Typography>
              <Stack
                spacing={1}
                sx={{ flexDirection: 'row', alignItems: 'center' }}
              >
                <Avatar
                  src={getMediaUrl(payment.user?.avatar, 'sm')}
                  alt={getDisplayName(payment.user)}
                  sx={{
                    width: 40,
                    height: 40,
                  }}
                >
                  {getDisplayName(payment.user)?.charAt(0).toUpperCase()}
                </Avatar>
                <ListItemText
                  primary={
                    <UserDisplayName
                      user={payment.user}
                      sx={{ fontWeight: 500 }}
                    />
                  }
                  secondary={payment.user?.email}
                />
              </Stack>
            </Stack>
          )}
          <Divider sx={{ borderStyle: 'dashed' }} />
          <Stack
            sx={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="subtitle1">
              {t('payments.paymentPrice')}
            </Typography>
            <Typography variant="subtitle1">
              {fCurrency(payment.price || 0)}đ
            </Typography>
          </Stack>
        </Stack>
      </Box>
      {payment.status === EStatusProcess.PENDING &&
        payment.userId === currentUser?.id && (
          <Button
            variant="contained"
            color="warning"
            onClick={() => {
              confirmCancel.onTrue();
            }}
          >
            {t('basic.cancel')}
          </Button>
        )}
      <ConfirmDialog
        open={confirmCancel.value}
        onClose={confirmCancel.onFalse}
        title={t('basic.cancel')}
        content={t('common.areYouSureWantToCancel')}
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              mutationCancel.mutate();
              confirmCancel.onFalse();
            }}
          >
            {t('basic.confirm')}
          </Button>
        }
      />
      <Dialog open={changePayment.value} fullWidth>
        <DialogContent sx={{ p: 3 }}>
          <PaymentMethods method={currentMethod} setMethod={setCurrentMethod} />
        </DialogContent>

        <DialogActions
          sx={{
            borderTop: (theme) => `solid 1px ${theme.palette.divider}`,
          }}
        >
          <Button
            onClick={() => mutationUpdatePayment.mutate(currentMethod)}
            loading={mutationUpdatePayment.isPending}
            color="primary"
            variant="contained"
          >
            {t('basic.save')}
          </Button>
          <Button onClick={() => changePayment.onFalse()} variant="contained">
            {t('basic.cancel')}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
