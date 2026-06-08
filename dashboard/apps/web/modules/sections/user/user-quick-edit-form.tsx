'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { Stack } from '@mui/material';
import Alert, { AlertColor } from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {
  EUserGender,
  EUserLevel,
  EUserStatus,
  handleErrorResponse,
  IUser,
  IUserCreate,
} from '@seven-auto/libs';
import { countries } from 'modules/assets/data';
import FormProvider, {
  RHFAutocomplete,
  RHFAutocompleteRole,
  RHFAutocompleteUser,
  RHFSelectUserGender,
  RHFSelectUserStatus,
  RHFSwitch,
  RHFTextField,
} from 'modules/components/hook-form';
import Iconify from 'modules/components/iconify';
import Scrollbar from 'modules/components/scrollbar';
import { useMediaSchema } from 'modules/hooks/schemas/use-media-schema';
import { useRoleSchema } from 'modules/hooks/schemas/use-role-schema';
import { useUserSchema } from 'modules/hooks/schemas/use-user-schema';
import { useTranslate } from 'modules/locales';
import apiServices from 'modules/services/apiService';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: VoidFunction;
  currentUser?: IUser;
  onCallback?: (user: IUser) => void;
};

export default function UserQuickEditForm({
  currentUser,
  open,
  onClose,
  onCallback,
}: Props) {
  const { t } = useTranslate();
  const [alert, setAlert] = useState<{
    type: AlertColor;
    content: string;
  }>({
    type: 'info',
    content: '',
  });

  const { MediaSchema, getMediaValue } = useMediaSchema();
  const { UserSchema, getUserValue } = useUserSchema();
  const { RoleSchema, getRoleValue } = useRoleSchema();

  const UpdateUserSchema = Yup.object().shape({
    fullname: Yup.string(),
    username: Yup.string(),
    email: Yup.string().email(t('validate.emailInvalid')),
    avatar: MediaSchema,
    phone: Yup.string(),
    country: Yup.string(),
    address: Yup.string(),
    region: Yup.string(),
    city: Yup.string(),
    zipCode: Yup.string(),
    about: Yup.string(),
    isVerified: Yup.boolean(),
    role: RoleSchema,
    level: Yup.string().oneOf(Object.values(EUserLevel)),
    status: Yup.string().oneOf(Object.values(EUserStatus)),
    gender: Yup.string().oneOf(Object.values(EUserGender)),
    credits: Yup.number(),
    password: Yup.string(),
    referrer: UserSchema,
  });

  const defaultValues = useMemo(
    () => ({
      fullname: currentUser?.fullname || '',
      username: currentUser?.username || '',
      email: currentUser?.email || '',
      avatar: getMediaValue(currentUser?.avatar) || null,
      phone: currentUser?.phone || '',
      country: currentUser?.country || '',
      address: currentUser?.address || '',
      region: currentUser?.region || '',
      city: currentUser?.city || '',
      zipCode: currentUser?.zipCode || '',
      about: currentUser?.about || '',
      isVerified: currentUser?.isVerified || false,
      credits: currentUser?.credits ?? 0,
      role: getRoleValue(currentUser?.role) || null,
      gender: currentUser?.gender || EUserGender.MALE,
      level: currentUser?.level || EUserLevel.BASIC,
      status: currentUser?.status || EUserStatus.ACTIVE,
      password: '',
      referrer: getUserValue(currentUser?.referrer) || null,
    }),
    [currentUser, getMediaValue, getUserValue, getRoleValue],
  );

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    if (!currentUser?.id) return;
    const dataInput: IUserCreate = {
      fullname: data.fullname || '',
      username: data.username || '',
      email: data.email || '',
      avatarId: data.avatar?.id,
      phone: data.phone,
      country: data.country,
      address: data.address,
      region: data.region,
      city: data.city,
      zipCode: data.zipCode,
      about: data.about,
      isVerified: data.isVerified,
      roleId: data.role?.id,
      gender: data.gender,
      credits: data.credits,
      password: data.password,
      referrerId: data.referrer?.id,
      level: data.level,
      status: data.status,
    };

    try {
      const res = await apiServices.user.updateUser({
        ...dataInput,
        id: currentUser?.id,
      });
      setAlert({
        type: 'success',
        content: t('basic.updateSuccess'),
      });
      if (onCallback) onCallback(res);
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      setAlert({
        type: 'error',
        content: t(handleErrorResponse(error, 'basic.updateFailed')),
      });
    }
  });

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: { maxWidth: 720 },
        },
      }}
    >
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>
          {t('users.quickEdit')} {currentUser?.fullname}
        </DialogTitle>

        <DialogContent sx={{ px: 0 }}>
          <Box
            sx={{
              px: 3,
            }}
          >
            {alert.content && (
              <Alert variant="outlined" severity={alert.type} sx={{ mb: 3 }}>
                {alert.content}
              </Alert>
            )}
          </Box>
          <Scrollbar
            sx={{
              maxHeight: '90vh',
              height: 480,
              px: 3,
              py: 1,
            }}
          >
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                },
              }}
            >
              <RHFSwitch
                name="isVerified"
                labelPlacement="start"
                label={t('users.verified')}
              />
              <Box />
            </Box>
            <Box
              sx={{
                rowGap: 3,
                columnGap: 2,
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                },
              }}
            >
              <RHFTextField name="fullname" label={t('form.name')} />
              <RHFTextField name="username" label={t('form.username')} />
              <RHFTextField name="email" label={t('form.email')} />
              <RHFSelectUserGender name="gender" label={t('form.gender')} />
              <RHFTextField name="phone" label={t('form.phone')} />
              <RHFTextField name="address" label={t('form.address')} />
              <RHFAutocomplete
                name="country"
                label={t('form.country')}
                options={countries.map((country) => country.label)}
                getOptionLabel={(option) => option}
                renderOption={(props, option) => {
                  const country = countries.filter(
                    (country) => country.label === option,
                  )[0];
                  if (!country) {
                    return null;
                  }
                  const { code, label, phone } = country;

                  if (!label) {
                    return null;
                  }

                  return (
                    <li {...props} key={label}>
                      <Iconify
                        key={label}
                        icon={`circle-flags:${code.toLowerCase()}`}
                        width={28}
                        sx={{ mr: 1 }}
                      />
                      {label} ({code}) +{phone}
                    </li>
                  );
                }}
              />
              <RHFTextField name="region" label={t('form.region')} />
              <RHFTextField name="city" label={t('form.city')} />
              <RHFTextField name="zipCode" label={t('form.zip_code')} />
              <RHFSelectUserStatus name="status" label={t('form.status')} />
              <RHFAutocompleteRole name="role" label={t('form.role')} />
              <RHFTextField disabled name="credits" label={t('form.credits')} />
              <RHFTextField name="password" label={t('form.password')} />
            </Box>
            <Stack sx={{ mt: 3 }}>
              <RHFAutocompleteUser
                name="referrer"
                label={t('form.referrer')}
                excludeIds={currentUser?.id ? [currentUser?.id] : []}
              />
            </Stack>
            <Stack spacing={3} sx={{ mt: 3, alignItems: 'flex-end' }}>
              <RHFTextField name="about" multiline rows={4} label="About" />
            </Stack>
          </Scrollbar>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            {t('basic.cancel')}
          </Button>

          <Button type="submit" variant="contained" loading={isSubmitting}>
            {t('basic.update')}
          </Button>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
