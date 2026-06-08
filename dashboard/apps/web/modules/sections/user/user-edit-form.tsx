import { yupResolver } from '@hookform/resolvers/yup';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import {
  EUserGender,
  EUserLevel,
  EUserStatus,
  handleErrorResponse,
  hasPermission,
  IUser,
  IUserCreate,
  permissions,
} from '@seven-auto/libs';
import { countries } from 'modules/assets/data';
import { useAuthContext } from 'modules/auth/hooks';
import FormProvider, {
  RHFAutocomplete,
  RHFAutocompleteRole,
  RHFAutocompleteUser,
  RHFSelectUserGender,
  RHFSelectUserStatus,
  RHFSwitch,
  RHFTextField,
} from 'modules/components/hook-form';
import { RHFSelectAvatar } from 'modules/components/hook-form/rhf-select-avatar';
import Iconify from 'modules/components/iconify';
import { useSnackbar } from 'modules/components/snackbar';
import { useMediaSchema } from 'modules/hooks/schemas/use-media-schema';
import { useRoleSchema } from 'modules/hooks/schemas/use-role-schema';
import { useUserSchema } from 'modules/hooks/schemas/use-user-schema';
import { useTranslate } from 'modules/locales';
import apiServices from 'modules/services/apiService';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

// ----------------------------------------------------------------------

type Props = {
  currentData?: IUser;
  isAdminEdit?: boolean;
  onCallback?: (user: IUser) => void;
};

export default function UserEditForm({
  isAdminEdit = false,
  onCallback,
  currentData,
}: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslate();
  const { currentUser } = useAuthContext();

  // const isAdmin =
  //   isAdminEdit &&
  //   hasPermission(currentUser, [
  //     permissions.post.POST_CREATE,
  //     permissions.post.POST_UPDATE,
  //   ]);

  const isAdmin = useMemo(
    () =>
      isAdminEdit &&
      hasPermission(currentUser, [
        permissions.USER_CREATE,
        permissions.USER_UPDATE,
      ]),
    [currentUser, isAdminEdit],
  );

  const { MediaSchema, getMediaValue } = useMediaSchema();
  const { UserSchema, getUserValue } = useUserSchema();
  const { RoleSchema, getRoleValue } = useRoleSchema();

  const FormSchema = Yup.object().shape({
    fullname: Yup.string().required(t('validate.nameRequired')),
    username: Yup.string().required(t('validate.usernameRequired')),
    email: Yup.string()
      .required(t('validate.emailRequired'))
      .email(t('validate.emailInvalid')),
    avatar: MediaSchema,
    phone: Yup.string(),
    // .required(t('validate.phoneRequired')),
    country: Yup.string(),
    // .required(t('validate.countryRequired')),
    address: Yup.string(),
    // .required(t('validate.addressRequired')),
    region: Yup.string(),
    // .required(t('validate.regionRequired')),
    city: Yup.string(),
    // .required(t('validate.cityRequired')),
    zipCode: Yup.string(),
    // .required(t('validate.zipCodeRequired')),
    about: Yup.string(),
    // .required(t('validate.aboutRequired')),
    // admin
    isVerified: Yup.boolean(),
    role: RoleSchema,
    level: Yup.string().oneOf(Object.values(EUserLevel)),
    status: Yup.string().oneOf(Object.values(EUserStatus)),
    gender: Yup.string().oneOf(Object.values(EUserGender)),
    credits: Yup.number().default(0),
    password: Yup.string(),
    referrer: UserSchema,
  });

  const defaultValues = useMemo(
    () => ({
      fullname: currentData?.fullname || '',
      username: currentData?.username || '',
      email: currentData?.email || '',
      avatar: getMediaValue(currentData?.avatar) || null,
      phone: currentData?.phone || '',
      country: currentData?.country || '',
      address: currentData?.address || '',
      region: currentData?.region || '',
      city: currentData?.city || '',
      zipCode: currentData?.zipCode || '',
      about: currentData?.about || '',
      isVerified: currentData?.isVerified || false,
      role: getRoleValue(currentData?.role) || null,
      gender: currentData?.gender || undefined,
      level: currentData?.level || undefined,
      status: currentData?.status || undefined,
      password: '',
      referrer: getUserValue(currentData?.referrer) || null,
      credits: currentData?.credits || 0,
    }),
    [currentData, getMediaValue, getUserValue, getRoleValue],
  );

  const methods = useForm({
    resolver: yupResolver(FormSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const dataInput: IUserCreate = {
      fullname: data.fullname,
      username: data.username,
      email: data.email,
      avatarId: data.avatar?.id,
      phone: data.phone,
      country: data.country,
      address: data.address,
      region: data.region,
      city: data.city,
      zipCode: data.zipCode,
      about: data.about,
      gender: data.gender,
    };

    if (isAdmin) {
      dataInput.isVerified = data.isVerified;
      dataInput.roleId = data.role?.id;
      dataInput.credits = data.credits;
      dataInput.password = data.password;
      dataInput.referrerId = data.referrer?.id || '';
      dataInput.level = data.level;
      dataInput.status = data.status;
    }

    try {
      if (currentData?.id) {
        const res = await apiServices.user.updateUser({
          ...dataInput,
          id: currentData?.id,
        });
        if (onCallback) onCallback(res);
        enqueueSnackbar(t('basic.updateSuccess'), {
          variant: 'success',
        });
      } else {
        const res = await apiServices.user.createUser({
          ...dataInput,
        });
        if (onCallback) onCallback(res);
      }
    } catch (error) {
      enqueueSnackbar(t(handleErrorResponse(error, 'basic.updateFailed')), {
        variant: 'error',
      });
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ pt: 10, pb: 5, px: 3, textAlign: 'center' }}>
            <RHFSelectAvatar name="avatar" />
            <Stack
              sx={{
                width: 1,
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                mt: 2,
              }}
            >
              {isAdmin && (
                <RHFSwitch
                  name="isVerified"
                  labelPlacement="start"
                  label={t('users.verified')}
                />
              )}
            </Stack>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ p: 3 }}>
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

              <RHFTextField name="region" label={t('form.region')} />
              <RHFTextField name="city" label={t('form.city')} />
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
              <RHFTextField name="zipCode" label={t('form.zip_code')} />
              {isAdmin && (
                <>
                  <RHFSelectUserStatus name="status" label={t('form.status')} />
                  <RHFAutocompleteRole name="role" label={t('form.role')} />
                  <RHFTextField
                    disabled
                    name="credits"
                    label={t('form.credits')}
                  />
                  <RHFTextField name="password" label={t('form.password')} />
                </>
              )}
            </Box>
            {isAdmin && (
              <Stack sx={{ mt: 3 }}>
                <RHFAutocompleteUser
                  name="referrer"
                  label={t('form.referrer')}
                  excludeIds={currentData?.id ? [currentData?.id] : []}
                />
              </Stack>
            )}
            <Stack spacing={3} sx={{ mt: 3, alignItems: 'flex-end' }}>
              <RHFTextField name="about" multiline rows={4} label="About" />
              <Button type="submit" variant="contained" loading={isSubmitting}>
                {t('basic.update')}
              </Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
