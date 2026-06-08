'use client';

import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import FormControlLabel from '@mui/material/FormControlLabel';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import {
  DEFAULT_USER_SETTING,
  handleErrorResponse,
  type IUser,
  type IUserSetting,
} from '@seven-auto/libs';
import FormProvider from 'modules/components/hook-form';
import { useSnackbar } from 'modules/components/snackbar';
import { useTranslate } from 'modules/locales';
import apiServices from 'modules/services/apiService';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';

// ----------------------------------------------------------------------

type SettingChannel = keyof Pick<IUserSetting, 'notification' | 'email'>;
type SettingEvent = keyof IUserSetting['notification'];

const SETTING_CHANNELS: SettingChannel[] = ['notification', 'email'];
const SETTING_EVENTS: SettingEvent[] = ['like', 'comment', 'payment'];

const normalizeUserSetting = (raw?: IUser['setting']): IUserSetting => {
  if (!raw) {
    return { ...DEFAULT_USER_SETTING };
  }

  let parsed: Partial<IUserSetting> = raw;

  if (typeof raw === 'string') {
    try {
      parsed = JSON.parse(raw) as Partial<IUserSetting>;
    } catch {
      return { ...DEFAULT_USER_SETTING };
    }
  }

  return {
    notification: {
      ...DEFAULT_USER_SETTING.notification,
      ...parsed.notification,
    },
    email: {
      ...DEFAULT_USER_SETTING.email,
      ...parsed.email,
    },
  };
};

type Props = {
  user?: IUser | null;
  onCallback?: () => void;
};

export default function AccountNotifications({ user, onCallback }: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslate();

  const defaultValues = useMemo(
    () => normalizeUserSetting(user?.setting),
    [user?.setting],
  );

  const methods = useForm<IUserSetting>({
    defaultValues,
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const channelMeta: Record<
    SettingChannel,
    { title: string; caption: string }
  > = {
    notification: {
      title: t('users.notificationSettings.inApp'),
      caption: t('users.notificationSettings.caption'),
    },
    email: {
      title: t('users.notificationSettings.email'),
      caption: t('users.notificationSettings.caption'),
    },
  };

  const onSubmit = handleSubmit(async (data) => {
    if (!user?.id) {
      return;
    }

    try {
      await apiServices.user.updateUser({
        id: user.id,
        setting: data,
      });
      enqueueSnackbar(t('basic.updateSuccess'), { variant: 'success' });
      onCallback?.();
    } catch (error) {
      enqueueSnackbar(t(handleErrorResponse(error)), { variant: 'error' });
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack component={Card} spacing={3} sx={{ p: 3 }}>
        {SETTING_CHANNELS.map((channel) => (
          <Stack
            key={channel}
            direction={{ xs: 'column', md: 'row' }}
            spacing={3}
          >
            <Stack sx={{ width: { xs: 1, md: 280 }, flexShrink: 0 }}>
              <ListItemText
                primary={channelMeta[channel].title}
                secondary={channelMeta[channel].caption}
                slotProps={{
                  primary: {
                    variant: 'h6',
                    component: 'span',
                    sx: { mb: 0.5 },
                  },
                  secondary: { component: 'span' },
                }}
              />
            </Stack>

            <Stack
              spacing={1}
              sx={{
                flexGrow: 1,
                p: 3,
                borderRadius: 2,
                bgcolor: 'background.neutral',
              }}
            >
              {SETTING_EVENTS.map((event) => (
                <Controller
                  key={`${channel}.${event}`}
                  name={`${channel}.${event}`}
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      label={t(`users.notificationSettings.types.${event}`)}
                      labelPlacement="start"
                      control={
                        <Switch
                          checked={Boolean(field.value)}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      }
                      sx={{
                        m: 0,
                        width: 1,
                        justifyContent: 'space-between',
                      }}
                    />
                  )}
                />
              ))}
            </Stack>
          </Stack>
        ))}

        <LoadingButton
          type="submit"
          variant="contained"
          loading={isSubmitting}
          disabled={!user?.id}
          sx={{ ml: 'auto' }}
        >
          {t('basic.save')}
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
