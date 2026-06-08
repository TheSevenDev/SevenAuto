import { alpha, Box, BoxProps, Stack, Typography } from '@mui/material';
import FormHelperText from '@mui/material/FormHelperText';
import { IMedia } from '@seven-auto/libs';
import { useAuthContext } from 'modules/auth/hooks';
import { useTranslate } from 'modules/locales';
import { useMediaStore } from 'modules/store/media';
import { getMediaUrl } from 'modules/utils/get-media-url';
import { getNestedObjectValue } from 'modules/utils/nested-value';
import { Controller, useFormContext } from 'react-hook-form';

import Iconify from '../iconify';
import Image from '../image';

// ----------------------------------------------------------------------

interface Props extends BoxProps {
  name: string;
  disabled?: boolean;
}

// ----------------------------------------------------------------------

export function RHFSelectAvatar({ name, disabled, ...other }: Props) {
  const {
    control,
    watch,
    setValue,
    formState: { isSubmitting, errors },
  } = useFormContext();
  const { t } = useTranslate();

  const { setMediaState } = useMediaStore();
  const { currentUser, setOpenDialog } = useAuthContext();

  const values = watch();

  const hasFile = !!values[name];

  const hasError = errors[name];
  const isDisabled = disabled || isSubmitting;

  const handleSelectMedia = () => {
    if (isDisabled) return;
    if (!currentUser) {
      setOpenDialog(true, async () => {
        openMediaDialog();
      });
    } else {
      openMediaDialog();
    }
  };

  const openMediaDialog = () => {
    const currentValue = getNestedObjectValue(values, name);
    const selected = currentValue ? [currentValue as IMedia] : [];

    setMediaState({
      openMediaDialog: true,
      isSelectMultiple: false,
      selected,
      onCallBack: (media: IMedia | IMedia[]) => {
        setValue(name, media);
        setMediaState({
          openMediaDialog: false,
          isSelectMultiple: true,
        });
      },
    });
  };

  const renderPreview = hasFile && (
    <Image
      alt="avatar"
      src={getMediaUrl(values[name])}
      sx={{
        width: 1,
        height: 1,
        borderRadius: '50%',
      }}
    />
  );

  const renderPlaceholder = (
    <Stack
      spacing={1}
      className="upload-placeholder"
      sx={{
        justifyContent: 'center',
        alignItems: 'center',
        top: 0,
        left: 0,
        width: 1,
        height: 1,
        zIndex: 9,
        borderRadius: '50%',
        position: 'absolute',
        color: 'text.disabled',
        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
        transition: (theme) =>
          theme.transitions.create(['opacity'], {
            duration: theme.transitions.duration.shorter,
          }),
        '&:hover': {
          opacity: 0.72,
        },
        ...(hasError && {
          color: 'error.main',
          bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
        }),
        ...(hasFile && {
          zIndex: 9,
          opacity: 0,
          color: 'common.white',
          bgcolor: (theme) => alpha(theme.palette.grey[900], 0.64),
        }),
      }}
    >
      <Iconify icon="solar:camera-add-bold" width={32} />

      <Typography variant="caption">
        {hasFile ? t('basic.updatePhoto') : t('basic.uploadPhoto')}
      </Typography>
    </Stack>
  );

  const renderContent = (
    <Box
      sx={{
        width: 1,
        height: 1,
        overflow: 'hidden',
        borderRadius: '50%',
        position: 'relative',
      }}
    >
      {renderPreview}
      {renderPlaceholder}
    </Box>
  );

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <>
          <Box
            key={field.value?.id}
            onClick={isDisabled ? undefined : handleSelectMedia}
            sx={{
              p: 1,
              m: 'auto',
              width: 144,
              height: 144,
              cursor: 'pointer',
              overflow: 'hidden',
              borderRadius: '50%',
              border: (theme) =>
                `1px dashed ${alpha(theme.palette.grey[500], 0.2)}`,
              ...(isDisabled && {
                opacity: 0.48,
                pointerEvents: 'none',
              }),
              ...(hasError && {
                borderColor: 'error.main',
              }),
              ...(hasFile && {
                ...(hasError && {
                  bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
                }),
                '&:hover .upload-placeholder': {
                  opacity: 1,
                },
              }),
              ...other.sx,
            }}
            {...other}
          >
            {renderContent}
          </Box>

          {!!error && (
            <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
              {error.message}
            </FormHelperText>
          )}
        </>
      )}
    />
  );
}
