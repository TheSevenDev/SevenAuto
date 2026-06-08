'use client';

import { Button, Stack, Typography } from '@mui/material';
import { AuthVerifyType, handleErrorResponse, paths } from '@seven-auto/libs';
import EmailInboxIcon from 'modules/assets/icons/email-inbox-icon';
import { useAuthContext } from 'modules/auth/hooks';
import Iconify from 'modules/components/iconify';
import { useSnackbar } from 'modules/components/snackbar';
import { useTranslate } from 'modules/locales';
import { useRouter, useSearchParams } from 'modules/routes/hooks';
import { useCallback, useEffect, useState } from 'react';

const verifyMinLimit = 3;

let interval: NodeJS.Timeout;
const VerifyEmailView = () => {
  const router = useRouter();
  const queryParams = useSearchParams();
  const { enqueueSnackbar } = useSnackbar();
  const { resendRegister, logout, currentUser } = useAuthContext();
  const [checked, setChecked] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { t } = useTranslate();
  const [isResending, setIsResending] = useState(false);

  const startCountdown = useCallback((count: number) => {
    setCountdown(count);
    clearInterval(interval);
    interval = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);
  }, []);

  const handleResendCode = useCallback(async () => {
    try {
      setIsResending(true);
      await resendRegister({
        email: currentUser?.email || '',
        verifyType: AuthVerifyType.LINK,
      });
      startCountdown(verifyMinLimit * 60);
    } catch (error) {
      enqueueSnackbar(t(handleErrorResponse(error)), {
        variant: 'error',
      });
    } finally {
      setIsResending(false);
    }
  }, [enqueueSnackbar, t, resendRegister, currentUser?.email, startCountdown]);

  useEffect(() => {
    if (currentUser?.updatedAt && !checked) {
      setChecked(true);
      const updateBetween =
        Date.now() - new Date(currentUser.updatedAt).getTime();
      if (updateBetween < verifyMinLimit * 60 * 1000) {
        startCountdown(
          Math.round((verifyMinLimit * 60 * 1000 - updateBetween) / 1000) + 1,
        );
      }
    }
  }, [checked, startCountdown, currentUser]);

  useEffect(() => {
    if (currentUser && currentUser.isVerified) {
      enqueueSnackbar(t('auth.form.email_verified'), {
        variant: 'warning',
      });
      const returnTo = queryParams.get('returnTo');
      router.push(returnTo || paths.dashboard.root);
    }
  }, [enqueueSnackbar, t, queryParams, router, currentUser]);

  const renderForm = (
    <Stack spacing={3} sx={{ alignItems: 'center' }}>
      <Button
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        disabled={countdown > 0 || !checked || isResending}
        onClick={handleResendCode}
      >
        {t('auth.form.resend_link')}{' '}
        {countdown > 0 && (
          <>
            {t('basic.after')}{' '}
            <Typography
              variant="body2"
              sx={{ ml: 0.5, fontWeight: 'bold', width: 24 }}
            >
              {countdown}s
            </Typography>
          </>
        )}
      </Button>
      <Button
        color="inherit"
        onClick={() => {
          logout();
          router.push(paths.auth.login);
        }}
        sx={{
          alignItems: 'center',
          display: 'inline-flex',
          cursor: 'pointer',
        }}
      >
        <Iconify icon="eva:arrow-ios-back-fill" width={16} />
        {t('auth.form.logout')}
      </Button>
    </Stack>
  );

  const renderHead = (
    <>
      <EmailInboxIcon sx={{ height: 96 }} />

      <Stack spacing={1} sx={{ my: 5 }}>
        <Typography variant="h3">{t('auth.verify_email.label')}</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {t('auth.verify_email.description')}
        </Typography>
      </Stack>
    </>
  );

  return (
    <>
      {renderHead}
      {renderForm}
    </>
  );
};

export default VerifyEmailView;
