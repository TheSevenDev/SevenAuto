'use client';

import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  EStatusProcess,
  handleErrorResponse,
  hasPermission,
  paths,
  permissions,
} from '@seven-auto/libs';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthContext } from 'modules/auth/hooks';
import { ConfirmDialog } from 'modules/components/custom-dialog';
import EmptyContent from 'modules/components/empty-content';
import Iconify from 'modules/components/iconify';
import Label from 'modules/components/label';
import { SplashScreen } from 'modules/components/loading-screen';
import { useSettingsContext } from 'modules/components/settings';
import { enqueueSnackbar } from 'modules/components/snackbar';
import { ICONS_NAME } from 'modules/const/icons';
import { queryName } from 'modules/const/query-name';
import { useBoolean } from 'modules/hooks/use-boolean';
import { useTranslate } from 'modules/locales';
import DashboardToolbar from 'modules/molecules/dashboard-toolbar';
import apiServices from 'modules/services/apiService';
import { getStatusProcessColor } from 'modules/utils/general';
import { useState } from 'react';

import DashboardPaymentEditForm from '../dashboard-payment-edit-form';

// ----------------------------------------------------------------------

interface IProps {
  id: string;
}

export default function DashboardPaymentDetailsView({ id }: IProps) {
  const settings = useSettingsContext();
  const { currentUser } = useAuthContext();
  const queryClient = useQueryClient();

  const [isApproving, setIsApproving] = useState(false);
  const confirmApprove = useBoolean();

  const [isRejecting, setIsRejecting] = useState(false);
  const confirmReject = useBoolean();

  const [isReopening, setIsReopening] = useState(false);
  const confirmReopen = useBoolean();
  const [reason, setReason] = useState<string>('');

  const { t } = useTranslate();

  const { data: payment, isFetching } = useQuery({
    queryKey: [queryName.GET_PAYMENT, id],
    queryFn: () => apiServices.payment.getPayment(id),
  });

  const hasApprove = hasPermission(currentUser, [permissions.PAYMENT_APPROVE]);

  const hasReject = hasPermission(currentUser, [permissions.PAYMENT_REJECT]);

  const hasReopen = hasPermission(currentUser, [permissions.PAYMENT_REOPEN]);

  const handleApprove = async () => {
    try {
      setIsApproving(true);
      const res = await apiServices.payment.approvePayment(id);
      if (res) {
        enqueueSnackbar(t('payments.approveSuccess'), {
          variant: 'success',
        });
      } else {
        enqueueSnackbar(t('payments.approveFailed'), {
          variant: 'error',
        });
      }
    } catch (error) {
      enqueueSnackbar(t(handleErrorResponse(error, 'payments.approveFailed')), {
        variant: 'error',
      });
    } finally {
      setIsApproving(false);
      confirmApprove.onFalse();
      queryClient.refetchQueries({
        queryKey: [queryName.GET_PAYMENT, id],
      });
    }
  };

  const handleReject = async () => {
    try {
      setIsRejecting(true);
      const res = await apiServices.payment.rejectPayment(id, reason);
      if (res) {
        setReason('');
        enqueueSnackbar(t('payments.rejectSuccess'), {
          variant: 'success',
        });
      } else {
        enqueueSnackbar(t('payments.rejectFailed'), {
          variant: 'error',
        });
      }
    } catch (error) {
      enqueueSnackbar(t(handleErrorResponse(error, 'payments.rejectFailed')), {
        variant: 'error',
      });
    } finally {
      setIsRejecting(false);
      confirmReject.onFalse();
      queryClient.refetchQueries({
        queryKey: [queryName.GET_PAYMENT, id],
      });
    }
  };

  const handleReopen = async () => {
    try {
      setIsReopening(true);
      const res = await apiServices.payment.reopenPayment(id, reason);
      if (res) {
        setReason('');
        enqueueSnackbar(t('payments.reopenSuccess'), {
          variant: 'success',
        });
      } else {
        enqueueSnackbar(t('payments.reopenFailed'), {
          variant: 'error',
        });
      }
    } catch (error) {
      enqueueSnackbar(t(handleErrorResponse(error, 'payments.reopenFailed')), {
        variant: 'error',
      });
    } finally {
      setIsReopening(false);
      confirmReopen.onFalse();
      queryClient.refetchQueries({
        queryKey: [queryName.GET_PAYMENT, id],
      });
    }
  };

  if (isFetching) return <SplashScreen />;
  if (!payment) return <EmptyContent title={t('payments.notFound')} />;

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <DashboardToolbar
        title={`${t('payments.label')} - ${payment.uniqueId?.toUpperCase()}`}
        backLink={paths.dashboard.payment.root}
        description={t('payments.label')}
        actions={
          <IconButton
            component="a"
            href={paths.checkout(payment.id)}
            target="_blank"
            rel="noreferrer"
            onClick={() => {
              queryClient.refetchQueries({
                queryKey: [queryName.GET_PAYMENT, id],
              });
            }}
          >
            <Iconify icon={ICONS_NAME.linkExternal} />
          </IconButton>
        }
      />

      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardHeader
          sx={{
            textTransform: 'capitalize',
          }}
          title={
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: 1,
              }}
            >
              <Typography variant="h6">{t('basic.status')}:</Typography>
              <Label
                variant="filled"
                color={getStatusProcessColor(payment.status)}
              >
                {t(`statusProcess.${payment.status}`)}
              </Label>
            </Box>
          }
          action={
            <>
              {(payment.status === EStatusProcess.PENDING ||
                payment.status === EStatusProcess.PROCESSING) && (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {hasApprove && (
                    <>
                      <Button
                        onClick={() => {
                          confirmApprove.onTrue();
                        }}
                        variant="contained"
                        color="success"
                        size="small"
                      >
                        {t(`payments.approve`)}
                      </Button>
                      <ConfirmDialog
                        open={confirmApprove.value}
                        onClose={() => {
                          confirmApprove.onFalse();
                        }}
                        title={t('payments.approveConfirm')}
                        content={t('payments.approveConfirmMessage')}
                        action={
                          <Button
                            variant="contained"
                            loading={isApproving}
                            color="success"
                            onClick={() => {
                              handleApprove();
                            }}
                          >
                            {t('payments.approve')}
                          </Button>
                        }
                      />
                    </>
                  )}
                  {hasReject && (
                    <>
                      <Button
                        onClick={() => {
                          confirmReject.onTrue();
                        }}
                        variant="contained"
                        color="error"
                        size="small"
                      >
                        {t(`payments.reject`)}
                      </Button>
                      <ConfirmDialog
                        maxWidth="sm"
                        open={confirmReject.value}
                        onClose={() => {
                          confirmReject.onFalse();
                        }}
                        title={t('payments.rejectConfirm')}
                        content={
                          <Stack spacing={2} sx={{ mt: 2 }}>
                            <TextField
                              label={t('basic.reason')}
                              autoFocus
                              value={reason}
                              onChange={(e) => setReason(e.target.value)}
                              multiline
                              fullWidth
                              rows={2}
                            />
                            <Typography variant="body1">
                              {t('payments.rejectConfirmMessage')}
                            </Typography>
                          </Stack>
                        }
                        action={
                          <Button
                            variant="contained"
                            loading={isRejecting}
                            color="error"
                            disabled={!reason}
                            onClick={() => {
                              handleReject();
                            }}
                          >
                            {t('payments.reject')}
                          </Button>
                        }
                      />
                    </>
                  )}
                </Box>
              )}

              {(payment.status === EStatusProcess.CANCELED ||
                payment.status === EStatusProcess.COMPLETED) &&
                hasReopen && (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      onClick={() => {
                        confirmReopen.onTrue();
                      }}
                      variant="contained"
                      color="warning"
                      size="small"
                    >
                      {t(`payments.reopen`)}
                    </Button>
                    <ConfirmDialog
                      maxWidth="sm"
                      open={confirmReopen.value}
                      onClose={() => {
                        confirmReopen.onFalse();
                      }}
                      title={t('payments.reopenConfirm')}
                      content={
                        <Stack spacing={2} sx={{ mt: 2 }}>
                          <TextField
                            label={t('basic.reason')}
                            autoFocus
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            multiline
                            fullWidth
                            rows={2}
                          />
                          <Typography variant="body1">
                            {t('payments.reopenConfirmMessage')}
                          </Typography>
                        </Stack>
                      }
                      action={
                        <Button
                          variant="contained"
                          loading={isReopening}
                          disabled={!reason}
                          color="warning"
                          onClick={() => {
                            handleReopen();
                          }}
                        >
                          {t('payments.reopen')}
                        </Button>
                      }
                    />
                  </Box>
                )}
            </>
          }
        />
        <CardContent>
          <DashboardPaymentEditForm
            currentData={payment}
            isReadOnly={payment.status !== EStatusProcess.PENDING}
            onCallback={() => {
              queryClient.refetchQueries({
                queryKey: [queryName.GET_PAYMENT, id],
              });
            }}
          />
        </CardContent>
      </Card>
    </Container>
  );
}
