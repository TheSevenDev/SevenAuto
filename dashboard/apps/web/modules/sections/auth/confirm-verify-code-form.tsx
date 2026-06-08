'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, AlertColor, Button } from '@mui/material';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { AuthVerifyType, handleErrorResponse, paths } from '@seven-auto/libs';
import { EmailInboxIcon } from 'modules/assets/icons';
import { useAuthContext } from 'modules/auth/hooks';
import { AuthDialogStep } from 'modules/auth/types';
import FormProvider, {
  RHFCode,
  RHFTextField,
} from 'modules/components/hook-form';
import Iconify from 'modules/components/iconify';
import { useSnackbar } from 'modules/components/snackbar';
import { useTranslate } from 'modules/locales';
import { RouterLink } from 'modules/routes/components';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

// ----------------------------------------------------------------------

export default function ConfirmVerifyCodeForm() {
  const { t } = useTranslate();
  const [message, setMessage] = useState({
    type: 'success',
    content: '',
  });
  const {
    resendRegister,
    confirmRegisterCode,
    currentUser,
    openDialog,
    setDialogStep,
    onDialogCallBack,
    setOpenDialog,
  } = useAuthContext();

  const { enqueueSnackbar } = useSnackbar();
  const VerifySchema = Yup.object().shape({
    code: Yup.string()
      .min(6, t('auth.form.code_min'))
      .required(t('auth.form.code_required')),
    email: Yup.string()
      .required(t('auth.form.email_required'))
      .email(t('auth.form.email_invalid')),
  });

  const defaultValues = {
    code: '',
    email: currentUser?.email || '',
  };

  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(VerifySchema),
    defaultValues,
  });

  const handleResendCode = useCallback(async () => {
    try {
      await resendRegister({
        email: currentUser?.email || '',
        verifyType: AuthVerifyType.CODE,
      });
    } catch (error) {
      enqueueSnackbar(t(handleErrorResponse(error)), {
        variant: 'error',
      });
    }
  }, [enqueueSnackbar, resendRegister, t, currentUser?.email]);

  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    setMessage({
      type: 'success',
      content: '',
    });
    try {
      await confirmRegisterCode?.({
        email: data.email,
        code: data.code,
      });
      if (onDialogCallBack) {
        onDialogCallBack();
        setOpenDialog(false);
      } else {
        setMessage({
          type: 'success',
          content: t('auth.form.send_request_success'),
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        content: t(handleErrorResponse(error)),
      });
    }
  });

  useEffect(() => {
    if (currentUser?.email) setValue('email', currentUser?.email);
  }, [currentUser?.email, setValue]);

  const renderForm = (
    <Stack spacing={2} sx={{ alignItems: 'center' }}>
      {!!message.content && (
        <Alert sx={{ width: '100%' }} severity={message.type as AlertColor}>
          {message.content}
        </Alert>
      )}
      <RHFTextField
        name="email"
        label={t('auth.form.email')}
        placeholder="example@gmail.com"
        slotProps={{
          inputLabel: {
            shrink: true,
          },
        }}
      />

      <RHFCode name="code" />

      <Button
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        {t('auth.form.verify_code')}
      </Button>

      <Typography variant="body2">
        {t('auth.form.dont_have_code')}{' '}
        <Link
          variant="subtitle2"
          sx={{
            cursor: 'pointer',
          }}
          onClick={handleResendCode}
        >
          {t('auth.form.resend_code')}
        </Link>
      </Typography>

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
      <EmailInboxIcon sx={{ height: 96 }} />

      <Stack spacing={1} sx={{ my: 3 }}>
        <Typography variant="h4">
          {t('auth.form.please_check_email')}
        </Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {t('auth.form.check_email_inbox_code', {
            email: currentUser?.email || 'xxx',
          })}
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
