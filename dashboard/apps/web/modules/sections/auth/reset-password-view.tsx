'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Button } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { handleErrorResponse, paths } from '@seven-auto/libs';
import { SentIcon } from 'modules/assets/icons';
import { useAuthContext } from 'modules/auth/hooks';
import FormProvider, { RHFTextField } from 'modules/components/hook-form';
import Iconify from 'modules/components/iconify';
import { useSnackbar } from 'modules/components/snackbar';
import { useBoolean } from 'modules/hooks/use-boolean';
import { useTranslate } from 'modules/locales';
import { RouterLink } from 'modules/routes/components';
import { useRouter, useSearchParams } from 'modules/routes/hooks';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
// ----------------------------------------------------------------------

export default function ResetPasswordView() {
  const { resetPassword } = useAuthContext();
  const password = useBoolean();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const returnTo = searchParams.get('returnTo');
  const router = useRouter();
  const { t } = useTranslate();

  const { enqueueSnackbar } = useSnackbar();

  const ResetPasswordSchema = Yup.object().shape({
    token: Yup.string().required(t('auth.form.token_required')),
    password: Yup.string()
      .min(6, t('auth.form.password_min'))
      .required(t('auth.form.password_required')),
    confirmPassword: Yup.string()
      .required(t('auth.form.confirm_password_required'))
      .oneOf([Yup.ref('password')], t('auth.form.password_not_match')),
  });

  const defaultValues = {
    token: token || '',
    password: '',
    confirmPassword: '',
  };

  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(ResetPasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting, isDirty, isValid },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await resetPassword?.(data.token, data.password);
      enqueueSnackbar(t('auth.form.reset_password_success'), {
        variant: 'success',
      });

      enqueueSnackbar(t('auth.form.redirect_login'), {
        variant: 'info',
      });
      setTimeout(() => {
        router.push(returnTo || paths.auth.login);
      }, 2000);
    } catch (error) {
      enqueueSnackbar(t(handleErrorResponse(error)), {
        variant: 'error',
      });
    }
  });

  const renderForm = (
    <Stack spacing={3} sx={{ alignItems: 'center' }}>
      {!token && (
        <Alert severity="error">{t('auth.reset_password.title')}</Alert>
      )}
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

      <RHFTextField
        name="confirmPassword"
        label={t('auth.form.confirm_password')}
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
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        disabled={!isDirty || !isValid}
      >
        {t('auth.form.reset_password')}
      </Button>

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
        {t('auth.form.back_to_login')}
      </Link>
    </Stack>
  );

  const renderHead = (
    <>
      <SentIcon sx={{ height: 96 }} />

      <Stack spacing={1} sx={{ my: 5 }}>
        <Typography variant="h3">{t('auth.reset_password.label')}</Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {t('auth.reset_password.description')}
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
