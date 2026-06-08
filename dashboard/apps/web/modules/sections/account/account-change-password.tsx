import { yupResolver } from '@hookform/resolvers/yup';
import { Button, CardHeader } from '@mui/material';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import { handleErrorResponse, IUser } from '@seven-auto/libs';
import FormProvider, { RHFTextField } from 'modules/components/hook-form';
import Iconify from 'modules/components/iconify';
import { useSnackbar } from 'modules/components/snackbar';
import { useBoolean } from 'modules/hooks/use-boolean';
import { useTranslate } from 'modules/locales';
import apiServices from 'modules/services/apiService';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

// ----------------------------------------------------------------------
interface IProps {
  user: IUser | null;
  onCallback?: () => void;
}

export default function AccountChangePassword({ user, onCallback }: IProps) {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslate();

  const password = useBoolean();

  const ChangePassWordSchema = Yup.object().shape({
    oldPassword: Yup.string().required(t('validate.oldPasswordRequired')),
    newPassword: Yup.string()
      .required(t('validate.newPasswordRequired'))
      .min(6, t('validate.newPasswordMin'))
      .test(
        'no-match',
        t('validate.newPasswordMatch'),
        (value, { parent }) => value !== parent.oldPassword,
      ),
    confirmNewPassword: Yup.string().oneOf(
      [Yup.ref('newPassword')],
      t('validate.confirmPasswordMatch'),
    ),
  });

  const defaultValues = {
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  };

  const methods = useForm({
    resolver: yupResolver(ChangePassWordSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!user?.id) return;
      await apiServices.auth.changePassword({
        ...data,
      });
      if (onCallback) onCallback();
      reset();
      enqueueSnackbar(t('basic.updateSuccess'), {
        variant: 'success',
      });
    } catch (error) {
      enqueueSnackbar(t(handleErrorResponse(error, 'basic.updateFailed')), {
        variant: 'error',
      });
    }
  });

  if (!user) return null;

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Card>
        <CardHeader title={t('users.changePassword')} />
        <Stack spacing={3} sx={{ p: 3 }}>
          <RHFTextField
            name="oldPassword"
            type={password.value ? 'text' : 'password'}
            label={t('form.oldPassword')}
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
            name="newPassword"
            label={t('form.newPassword')}
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
            helperText={
              <Stack
                component="span"
                direction="row"
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                <Iconify icon="eva:info-fill" width={16} sx={{ mr: 0.5 }} />{' '}
                {t('form.passwordHelper')}
              </Stack>
            }
          />

          <RHFTextField
            name="confirmNewPassword"
            type={password.value ? 'text' : 'password'}
            label={t('form.confirmNewPassword')}
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
            type="submit"
            variant="contained"
            loading={isSubmitting}
            sx={{ ml: 'auto' }}
          >
            {t('basic.save')}
          </Button>
        </Stack>
      </Card>
    </FormProvider>
  );
}
