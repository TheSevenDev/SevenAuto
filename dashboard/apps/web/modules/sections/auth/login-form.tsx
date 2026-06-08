'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@mui/material';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { handleErrorResponse, paths } from '@seven-auto/libs';
import { useAuthContext } from 'modules/auth/hooks';
import { AuthDialogStep } from 'modules/auth/types';
import FormProvider, { RHFTextField } from 'modules/components/hook-form';
import Iconify from 'modules/components/iconify';
import { PATH_AFTER_LOGIN } from 'modules/config-global';
import { useGlobalContext } from 'modules/context/global/use-global-context';
import { useBoolean } from 'modules/hooks/use-boolean';
import { useTranslate } from 'modules/locales';
import { RouterLink } from 'modules/routes/components';
import { useRouter, useSearchParams } from 'modules/routes/hooks';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const { login, onDialogCallBack, openDialog, setDialogStep, setOpenDialog } =
    useAuthContext();
  const { siteInfo } = useGlobalContext();
  const { t } = useTranslate();

  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState('');

  const searchParams = useSearchParams();

  const returnTo = searchParams.get('returnTo');

  const password = useBoolean();

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .required(t('auth.form.email_required'))
      .email(t('auth.form.email_invalid')),
    password: Yup.string().required(t('auth.form.password_required')),
  });

  const defaultValues = {
    email: '',
    password: '',
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    setErrorMsg('');
    try {
      await login?.(data.email, data.password);
      if (onDialogCallBack) {
        await onDialogCallBack();
        setOpenDialog(false);
      } else {
        router.push(returnTo || PATH_AFTER_LOGIN);
      }
    } catch (error) {
      setErrorMsg(t(handleErrorResponse(error)));
    }
  });

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5 }}>
      <Typography variant="h4">
        {t('auth.login.title')} {siteInfo.siteName}
      </Typography>

      <Stack direction="row" spacing={0.5}>
        <Typography variant="body2">{t('auth.new_user')}</Typography>
        {openDialog ? (
          <Link
            sx={{ cursor: 'pointer' }}
            onClick={() => {
              setDialogStep(AuthDialogStep.REGISTER);
            }}
            variant="subtitle2"
          >
            {t('auth.form.register_button')}
          </Link>
        ) : (
          <Link
            component={RouterLink}
            href={paths.auth.register}
            variant="subtitle2"
          >
            {t('auth.form.register_button')}
          </Link>
        )}
      </Stack>
    </Stack>
  );

  const renderForm = (
    <Stack spacing={2.5}>
      {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

      <RHFTextField name="email" label={t('auth.form.email')} />

      <RHFTextField
        name="password"
        label={t('auth.form.password')}
        type={password.value ? 'text' : 'password'}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={password.onToggle} edge="end">
                  <Iconify
                    icon={
                      password.value
                        ? 'solar:eye-bold'
                        : 'solar:eye-closed-bold'
                    }
                  />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
      {openDialog ? (
        <Link
          variant="body2"
          color="inherit"
          underline="always"
          onClick={() => {
            setDialogStep(AuthDialogStep.FORGOT);
          }}
          sx={{ alignSelf: 'flex-end', cursor: 'pointer' }}
        >
          {t('auth.forgot_password')}
        </Link>
      ) : (
        <Link
          variant="body2"
          color="inherit"
          underline="always"
          href={paths.auth.forgotPassword}
          sx={{ alignSelf: 'flex-end' }}
        >
          {t('auth.forgot_password')}
        </Link>
      )}

      <Button
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        {t('auth.form.login_button')}
      </Button>
    </Stack>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      {renderHead}

      {renderForm}
    </FormProvider>
  );
}
