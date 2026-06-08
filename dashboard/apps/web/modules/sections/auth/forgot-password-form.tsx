'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, AlertColor, Button } from '@mui/material';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { handleErrorResponse, paths } from '@seven-auto/libs';
import { PasswordIcon } from 'modules/assets/icons';
import { useAuthContext } from 'modules/auth/hooks';
import { AuthDialogStep } from 'modules/auth/types';
import FormProvider, { RHFTextField } from 'modules/components/hook-form';
import Iconify from 'modules/components/iconify';
import { useTranslate } from 'modules/locales';
import { RouterLink } from 'modules/routes/components';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

// ----------------------------------------------------------------------

export default function ForgotPasswordForm() {
  const { forgotPassword, openDialog, setDialogStep } = useAuthContext();
  const { t } = useTranslate();
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState({
    type: 'success',
    content: '',
  });

  const ForgotPasswordSchema = Yup.object().shape({
    email: Yup.string()
      .required(t('auth.form.email_required'))
      .email(t('auth.form.email_invalid')),
  });

  const defaultValues = {
    email: '',
  };

  const methods = useForm({
    resolver: yupResolver(ForgotPasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    setMessage({
      type: 'success',
      content: '',
    });
    try {
      await forgotPassword?.(data.email);
      setMessage({
        type: 'success',
        content: t('auth.form.send_request_success'),
      });
      setIsSent(true);
    } catch (error) {
      setMessage({
        type: 'error',
        content: t(handleErrorResponse(error)),
      });
    }
  });

  const renderForm = (
    <Stack spacing={3} sx={{ alignItems: 'center' }}>
      {!!message.content && (
        <Alert sx={{ width: '100%' }} severity={message.type as AlertColor}>
          {message.content}
        </Alert>
      )}
      {!isSent && (
        <>
          <RHFTextField name="email" label={t('auth.form.email')} required />
          <Button
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            {t('auth.form.send_request')}
          </Button>
        </>
      )}
      {openDialog ? (
        <Link
          onClick={() => {
            setDialogStep(AuthDialogStep.LOGIN);
          }}
          color="inherit"
          variant="subtitle2"
          sx={{
            alignItems: 'center',
            display: 'inline-flex',
            cursor: 'pointer',
          }}
        >
          <Iconify icon="eva:arrow-ios-back-fill" width={16} />
          {t('auth.form.return_to_login')}
        </Link>
      ) : (
        <Link
          component={RouterLink}
          href={paths.auth.login}
          color="inherit"
          variant="subtitle2"
          sx={{
            alignItems: 'center',
            display: 'inline-flex',
          }}
        >
          <Iconify icon="eva:arrow-ios-back-fill" width={16} />
          {t('auth.form.return_to_login')}
        </Link>
      )}
    </Stack>
  );

  const renderHead = (
    <>
      <PasswordIcon sx={{ height: 96 }} />

      <Stack spacing={1} sx={{ my: 5 }}>
        <Typography variant="h3">{t('auth.forgot_password')}</Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {t('auth.forgot_password_sub')}
        </Typography>
      </Stack>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      {renderHead}

      {renderForm}
    </FormProvider>
  );
}
