'use client';

import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import { useAuthContext } from 'modules/auth/hooks';
import { AuthDialogStep } from 'modules/auth/types';
import Scrollbar from 'modules/components/scrollbar';
import { useTranslate } from 'modules/locales';
import { usePathname } from 'modules/routes/hooks';
import React, { useEffect } from 'react';

import ConfirmVerifyCodeForm from './confirm-verify-code-form';
import ForgotPasswordForm from './forgot-password-form';
import LoginForm from './login-form';
import RegisterForm from './register-form';

const AuthDialog = () => {
  const { t } = useTranslate();
  const pathname = usePathname();
  const { currentUser, accessToken, setOpenDialog, dialogStep, openDialog } =
    useAuthContext();

  useEffect(() => {
    setOpenDialog(false, undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (currentUser && accessToken && currentUser.isVerified) return null;

  return (
    <Dialog
      open={openDialog}
      maxWidth="xs"
      // onClose={() => {
      //   setOpenDialog(false, undefined);
      // }}
      sx={{
        zIndex: (theme) => theme.zIndex.modal + 10,
      }}
      fullWidth
    >
      <DialogContent sx={{ p: 3 }}>
        <Scrollbar>
          {dialogStep === AuthDialogStep.LOGIN && <LoginForm />}
          {dialogStep === AuthDialogStep.REGISTER && <RegisterForm />}
          {dialogStep === AuthDialogStep.FORGOT && <ForgotPasswordForm />}
          {dialogStep === AuthDialogStep.CONFIRM && <ConfirmVerifyCodeForm />}
        </Scrollbar>
      </DialogContent>

      <DialogActions
        sx={{
          borderTop: (theme) => `solid 1px ${theme.palette.divider}`,
        }}
      >
        <Button
          onClick={() => {
            setOpenDialog(false, undefined);
          }}
          variant="contained"
        >
          {t('basic.cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AuthDialog;
