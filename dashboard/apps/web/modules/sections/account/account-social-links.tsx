import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@mui/material';
import Card from '@mui/material/Card';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import { handleErrorResponse } from '@seven-auto/libs';
import FormProvider, { RHFTextField } from 'modules/components/hook-form';
import Iconify from 'modules/components/iconify';
import { useSnackbar } from 'modules/components/snackbar';
import { _socialLinkDefaultObj } from 'modules/const/social';
import { useTranslate } from 'modules/locales';
import apiServices from 'modules/services/apiService';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

// ----------------------------------------------------------------------

export type IUserSocialLink = {
  type: 'facebook' | 'instagram' | 'linkedin' | 'x' | 'youtube';
  url: string;
  icon: string;
  color: string;
};

type Props = {
  userId: string | undefined;
  socialLinks: IUserSocialLink[];
  onCallback?: () => void;
};

//
export default function AccountSocialLinks({
  userId,
  onCallback,
  socialLinks,
}: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslate();
  const defaultValues = {
    facebook: socialLinks.find((link) => link.type === 'facebook')?.url || '',
    instagram: socialLinks.find((link) => link.type === 'instagram')?.url || '',
    linkedin: socialLinks.find((link) => link.type === 'linkedin')?.url || '',
    x: socialLinks.find((link) => link.type === 'x')?.url || '',
    youtube: socialLinks.find((link) => link.type === 'youtube')?.url || '',
  };

  const SocialSchema = Yup.object().shape({
    facebook: Yup.string().url(t('validate.urlInvalid')),
    instagram: Yup.string().url(t('validate.urlInvalid')),
    linkedin: Yup.string().url(t('validate.urlInvalid')),
    x: Yup.string().url(t('validate.urlInvalid')),
    youtube: Yup.string().url(t('validate.urlInvalid')),
  });

  const methods = useForm({
    resolver: yupResolver(SocialSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const updateData = Object.keys(data).map((key) => ({
      type: key as IUserSocialLink['type'],
      url: data[key as keyof typeof data],
      icon: _socialLinkDefaultObj[key as keyof typeof _socialLinkDefaultObj]
        ?.icon,
      color:
        _socialLinkDefaultObj[key as keyof typeof _socialLinkDefaultObj]?.color,
    }));
    try {
      if (!userId) return;
      await apiServices.user.updateUser({
        socials: { links: updateData },
        id: userId,
      });
      if (onCallback) onCallback();
      enqueueSnackbar(t('basic.updateSuccess'), {
        variant: 'success',
      });
    } catch (error) {
      enqueueSnackbar(t(handleErrorResponse(error, 'basic.updateFailed')), {
        variant: 'error',
      });
    }
  });

  if (!userId) return null;

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack component={Card} spacing={3} sx={{ p: 3 }}>
        {Object.keys(_socialLinkDefaultObj).map((link) => (
          <RHFTextField
            key={link}
            name={link}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify
                      width={24}
                      icon={
                        _socialLinkDefaultObj[
                          link as keyof typeof _socialLinkDefaultObj
                        ].icon
                      }
                      color={
                        _socialLinkDefaultObj[
                          link as keyof typeof _socialLinkDefaultObj
                        ].color
                      }
                    />
                  </InputAdornment>
                ),
              },
            }}
          />
        ))}

        <Button
          type="submit"
          variant="contained"
          loading={isSubmitting}
          sx={{ ml: 'auto' }}
        >
          {t('basic.save')}
        </Button>
      </Stack>
    </FormProvider>
  );
}
