import {
  alpha,
  Box,
  BoxProps,
  FormHelperText,
  IconButton,
  Stack,
  StackProps,
  Typography,
} from '@mui/material';
import { EMediaType, IMedia } from '@seven-auto/libs';
import { UploadIllustration } from 'modules/assets/illustrations';
import { useAuthContext } from 'modules/auth/hooks';
import { useTranslate } from 'modules/locales';
import { useMediaStore } from 'modules/store/media';
import { getMediaUrl } from 'modules/utils/get-media-url';
import { getNestedObjectValue } from 'modules/utils/nested-value';
import { Controller, useFormContext } from 'react-hook-form';

import FileThumbnail from '../file-thumbnail/file-thumbnail';
import Iconify from '../iconify/iconify';
import Image from '../image/image';

// ----------------------------------------------------------------------

interface Props extends StackProps {
  name: string;
  multiple?: boolean;
  helperText?: string;
  disabled?: boolean;
  label?: string;
  types?: EMediaType[];
  size?: 'small' | 'medium' | 'large' | 'auto';
}
// ----------------------------------------------------------------------

export default function RHFSelectMedia({
  name,
  multiple,
  helperText,
  sx,
  disabled,
  label,
  size,
  types,
  ...other
}: Props) {
  let width = 1;
  switch (size) {
    case 'small':
      width = 160;
      break;
    case 'medium':
      width = 320;
      break;
    case 'large':
      width = 480;
      break;
    default:
      width = 1;
      break;
  }

  const { setMediaState } = useMediaStore();
  const { currentUser, setOpenDialog } = useAuthContext();
  const { t } = useTranslate();
  const {
    control,
    watch,
    setValue,
    formState: { isSubmitting, errors },
  } = useFormContext();

  const values = watch();
  const hasFile = multiple ? !!values[name]?.length : !!values[name];

  const isDisabled = disabled || isSubmitting;
  const hasError = errors[name];

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
    const selected = multiple
      ? currentValue
      : currentValue
        ? [currentValue]
        : [];

    setMediaState({
      openMediaDialog: true,
      isSelectMultiple: multiple || false,
      selected,
      filters: {
        types,
      },
      onCallBack: multiple
        ? (medias: IMedia | IMedia[]) => {
            setValue(name, medias);
            setMediaState({
              openMediaDialog: false,
              isSelectMultiple: true,
            });
          }
        : (media: IMedia | IMedia[]) => {
            setValue(name, media);
            setMediaState({
              openMediaDialog: false,
              isSelectMultiple: true,
            });
          },
    });
  };

  const renderBoxSelect = (
    <Stack
      onClick={handleSelectMedia}
      sx={{
        width,
        position: 'relative',
        height: multiple ? width : 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        ...sx,
      }}
      {...other}
    >
      {label && (
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          {label}
        </Typography>
      )}
      <MediaBox
        isDisabled={isDisabled}
        hasError={!!hasError}
        sx={{
          width: 1,
          ...(multiple && {
            height: 1,
            textAlign: 'center',
          }),
        }}
      >
        <Stack
          spacing={3}
          direction="column"
          sx={{
            justifyContent: 'center',
            flexWrap: 'wrap',
            alignItems: 'center',
            width: 1,
            ...(multiple && {
              height: 1,
              textAlign: 'center',
            }),
          }}
        >
          {multiple ? (
            <Iconify icon="carbon:add" width={48} height={48} />
          ) : (
            <UploadIllustration
              sx={{
                width: 1,
                maxWidth: 200,
              }}
            />
          )}
          <Stack spacing={1} sx={{ textAlign: 'center' }}>
            <Typography variant={multiple ? 'body1' : 'h6'}>
              {t('common.selectFile')}
            </Typography>
          </Stack>
        </Stack>
      </MediaBox>
    </Stack>
  );

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) =>
        multiple ? (
          <Stack
            sx={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              ...sx,
            }}
            {...other}
          >
            {label && (
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                {label}
              </Typography>
            )}
            <Stack
              direction="row"
              sx={{ flexWrap: 'wrap', alignItems: 'center', gap: 1 }}
            >
              {field.value?.map((media: IMedia) => (
                <MediaBoxView
                  key={media.id}
                  media={media}
                  handleSelectMedia={handleSelectMedia}
                  onRemove={() =>
                    setValue(
                      name,
                      field.value.filter(
                        (item: IMedia) => item.id !== media.id,
                      ),
                    )
                  }
                  sx={{ width, height: width, overflow: 'hidden' }}
                />
              ))}
              {renderBoxSelect}
            </Stack>
            {(!!error || helperText) && (
              <FormHelperText error={!!error} sx={{ px: 2 }}>
                {error ? error?.message : helperText}
              </FormHelperText>
            )}
          </Stack>
        ) : !hasFile ? (
          renderBoxSelect
        ) : (
          <Stack
            sx={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              ...sx,
            }}
            {...other}
          >
            {label && (
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                {label}
              </Typography>
            )}
            <MediaBoxView
              handleSelectMedia={handleSelectMedia}
              media={field.value}
              onRemove={() => setValue(name, undefined)}
              sx={{
                width,
                height: width,
                ...sx,
              }}
              {...other}
            />
          </Stack>
        )
      }
    />
  );
}

interface MediaBoxProps extends StackProps {
  isDisabled?: boolean;
  hasError?: boolean;
}

function MediaBox({
  isDisabled,
  hasError,
  children,
  sx,
  ...other
}: MediaBoxProps) {
  return (
    <Stack
      sx={{
        p: 2,
        outline: 'none',
        borderRadius: 1,
        cursor: 'pointer',
        overflow: 'hidden',
        position: 'relative',
        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
        border: (theme) => `1px dashed ${alpha(theme.palette.grey[500], 0.2)}`,
        transition: (theme) => theme.transitions.create(['opacity', 'padding']),
        '&:hover': {
          opacity: 0.72,
        },
        ...(isDisabled && {
          opacity: 0.48,
          pointerEvents: 'none',
        }),
        ...(hasError && {
          color: 'error.main',
          borderColor: 'error.main',
          bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
        }),
        ...sx,
      }}
      {...other}
    >
      {children}
    </Stack>
  );
}

interface MediaBoxViewProps extends BoxProps {
  media: IMedia;
  handleSelectMedia: () => void;
  onRemove: () => void;
}

function MediaBoxView({
  media,
  sx,
  handleSelectMedia,
  onRemove,
  ...other
}: MediaBoxViewProps) {
  return (
    <Box
      onClick={handleSelectMedia}
      sx={{ width: 1, position: 'relative', ...sx }}
      {...other}
    >
      <IconButton
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        sx={{
          top: 16,
          right: 16,
          zIndex: 9,
          position: 'absolute',
          color: (theme) => alpha(theme.palette.common.white, 0.8),
          bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
          '&:hover': {
            bgcolor: (theme) => alpha(theme.palette.grey[900], 0.48),
          },
        }}
      >
        <Iconify icon="mingcute:close-line" width={18} />
      </IconButton>
      <MediaBox
        sx={{
          p: 1,
          width: 1,
          height: 1,
        }}
      >
        {media.type === EMediaType.IMAGE ? (
          <Image
            alt={media.title}
            src={getMediaUrl(media)}
            ratio="16/9"
            sx={{
              width: 1,
              height: 1,
              borderRadius: 1,
            }}
          />
        ) : (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              verticalAlign: 'bottom',
              backgroundSize: 'cover',
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            >
              <FileThumbnail
                imageView
                file={media}
                sx={{
                  width: '100%',
                  height: '100%',
                }}
              />
            </Box>
          </Box>
        )}
      </MediaBox>
    </Box>
  );
}
