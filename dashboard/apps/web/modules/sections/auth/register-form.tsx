'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@mui/material';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { AuthVerifyType, handleErrorResponse, paths } from '@seven-auto/libs';
import { useAuthContext } from 'modules/auth/hooks';
import { AuthDialogStep } from 'modules/auth/types';
import FormProvider, { RHFTextField } from 'modules/components/hook-form';
import Iconify from 'modules/components/iconify';
import { PATH_AFTER_LOGIN } from 'modules/config-global';
import { useBoolean } from 'modules/hooks/use-boolean';
import { useTranslate } from 'modules/locales';
import { RouterLink } from 'modules/routes/components';
import { useRouter, useSearchParams } from 'modules/routes/hooks';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

// ----------------------------------------------------------------------

export default function RegisterForm() {
  const { register, openDialog, setDialogStep } = useAuthContext();
  const { t } = useTranslate();
  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState('');

  const searchParams = useSearchParams();

  const returnTo = searchParams.get('returnTo');

  const password = useBoolean();

  const RegisterSchema = Yup.object().shape({
    fullname: Yup.string().required(t('auth.form.fullname_required')),
    email: Yup.string()
      .required(t('auth.form.email_required'))
      .email(t('auth.form.email_invalid')),
    password: Yup.string().required(t('auth.form.password_required')),
  });

  const defaultValues = {
    fullname: '',
    email: '',
    password: '',
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await register({
        email: data.email,
        password: data.password,
        fullname: data.fullname,
        verifyType: openDialog ? AuthVerifyType.CODE : AuthVerifyType.LINK,
      });

      if (!openDialog) {
        router.push(returnTo || PATH_AFTER_LOGIN);
      } else {
        setDialogStep(AuthDialogStep.CONFIRM);
      }
    } catch (error) {
      setErrorMsg(t(handleErrorResponse(error)));
    }
  });

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
      <Typography variant="h4">{t('auth.register.title')}</Typography>

      <Stack direction="row" spacing={0.5}>
        <Typography variant="body2"> {t('auth.already_account')} </Typography>
        {openDialog ? (
          <Link
            sx={{ cursor: 'pointer' }}
            onClick={() => {
              setDialogStep(AuthDialogStep.LOGIN);
            }}
            variant="subtitle2"
          >
            {t('auth.login.label')}
          </Link>
        ) : (
          <Link
            href={paths.auth.login}
            component={RouterLink}
            variant="subtitle2"
          >
            {t('auth.login.label')}
          </Link>
        )}
      </Stack>
    </Stack>
  );

  const renderTerms = (
    <Typography
      component="div"
      sx={{
        color: 'text.secondary',
        mt: 2.5,
        typography: 'caption',
        textAlign: 'center',
      }}
    >
      {`${t('by_signing_up')} `}
      <Link underline="always" color="text.primary">
        {t('terms_of_service')}
      </Link>
      {` ${t('basic.and')} `}
      <Link underline="always" color="text.primary">
        {t('privacy_policy')}
      </Link>
      .
    </Typography>
  );

  const renderForm = (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={2.5}>
        {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

        <RHFTextField name="fullname" label={t('auth.form.fullname')} />
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

        <Button
          fullWidth
          color="inherit"
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          {t('auth.form.register_button')}
        </Button>
      </Stack>
    </FormProvider>
  );

  return (
    <>
      {renderHead}

      {renderForm}

      {renderTerms}
    </>
  );
}
