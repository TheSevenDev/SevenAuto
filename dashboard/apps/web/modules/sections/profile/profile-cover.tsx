import { Container, IconButton, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import { alpha, useTheme } from '@mui/material/styles';
import {
  getDisplayName,
  handleErrorResponse,
  IMedia,
  IUser,
  IUserUpdate,
} from '@seven-auto/libs';
import { capitalize } from 'lodash';
import UserDisplayName from 'modules/atoms/user-display-name';
import { useAuthContext } from 'modules/auth/hooks';
import Iconify from 'modules/components/iconify';
import { useSettingsContext } from 'modules/components/settings';
import { enqueueSnackbar } from 'modules/components/snackbar';
import { useTranslate } from 'modules/locales';
import apiServices from 'modules/services/apiService';
import { useMediaStore } from 'modules/store/media';
import { bgGradient } from 'modules/theme/css';
import { getMediaUrl } from 'modules/utils/get-media-url';
import { useCallback } from 'react';

// ----------------------------------------------------------------------

export type IUserProfileCover = {
  user?: IUser;
  onCallBack?: (media: IMedia) => void;
};

export default function ProfileCover({ user, onCallBack }: IUserProfileCover) {
  const theme = useTheme();
  const settings = useSettingsContext();
  const { currentUser } = useAuthContext();

  const { setMediaState } = useMediaStore();
  const { t } = useTranslate();

  const updateUser = useCallback(
    async (data: IUserUpdate) => {
      try {
        const res = await apiServices.user.updateUser({
          ...data,
        });
        if (res) {
          onCallBack?.(res);
          enqueueSnackbar(t('basic.updateSuccess'), {
            variant: 'success',
          });
        }
      } catch (error) {
        enqueueSnackbar(t(handleErrorResponse(error)), {
          variant: 'error',
        });
      }
      // setValue(name, media);
    },
    [t, onCallBack],
  );

  const openCoverMediaDialog = useCallback(() => {
    if (!currentUser || !currentUser?.id) return;
    const selected = currentUser.cover ? [currentUser.cover] : [];

    setMediaState({
      openMediaDialog: true,
      isSelectMultiple: false,
      selected,
      onCallBack: (media: IMedia | IMedia[]) => {
        const selectedMedia = Array.isArray(media) ? media[0] : media;
        if (!selectedMedia) return;
        setMediaState({
          openMediaDialog: false,
          isSelectMultiple: true,
        });
        updateUser({
          id: currentUser.id,
          coverId: selectedMedia.id,
        });
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const openAvatarMediaDialog = useCallback(() => {
    if (!currentUser || !currentUser?.id) return;
    const selected = currentUser.avatar ? [currentUser.avatar] : [];

    setMediaState({
      openMediaDialog: true,
      isSelectMultiple: false,
      selected,
      onCallBack: (media: IMedia | IMedia[]) => {
        const selectedMedia = Array.isArray(media) ? media[0] : media;
        if (!selectedMedia) return;
        setMediaState({
          openMediaDialog: false,
          isSelectMultiple: true,
        });
        updateUser({
          id: currentUser?.id,
          coverId: selectedMedia.id,
        });
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const isOwner = currentUser?.id === user?.id;

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.primary.darker, 0.2),
          imgUrl: user?.cover
            ? getMediaUrl(user?.cover, 'original')
            : '/assets/images/default-cover.jpg',
        }),
        height: 1,
        objectFit: 'cover',
        objectPosition: 'center',
        color: 'common.white',
        '&:hover': {
          '& .editCover': {
            display: 'flex',
          },
        },
      }}
    >
      <Container
        sx={{
          position: 'relative',
          width: 1,
          height: 1,
        }}
        maxWidth={settings.themeStretch ? false : 'lg'}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          sx={{
            left: { md: 24 },
            bottom: { md: 24 },
            zIndex: { md: 10 },
            pt: { xs: 10, md: 0 },
            position: { md: 'absolute' },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              '&:hover .upload-placeholder': {
                opacity: 1,
              },
            }}
          >
            <Avatar
              src={getMediaUrl(user?.avatar, 'md')}
              alt={getDisplayName(user)}
              sx={{
                position: 'relative',
                mx: 'auto',
                width: { xs: isOwner ? 64 : 128, md: 128 },
                height: { xs: isOwner ? 64 : 128, md: 128 },
                border: `solid 2px ${theme.palette.common.white}`,
              }}
            >
              {getDisplayName(user).charAt(0)}
            </Avatar>
            {isOwner && (
              <Stack
                spacing={1}
                onClick={openAvatarMediaDialog}
                className="upload-placeholder"
                sx={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  top: 0,
                  left: 0,
                  width: 1,
                  height: 1,
                  zIndex: 9,
                  borderRadius: '50%',
                  position: 'absolute',
                  transition: theme.transitions.create(['opacity'], {
                    duration: theme.transitions.duration.shorter,
                  }),
                  '&:hover': {
                    opacity: 0.72,
                  },
                  cursor: 'pointer',
                  opacity: 0,
                  color: 'common.white',
                  bgcolor: alpha(theme.palette.grey[900], 0.64),
                }}
              >
                <Iconify icon="solar:camera-add-bold" width={32} />

                <Typography variant="caption">
                  {user?.avatar
                    ? t('basic.updatePhoto')
                    : t('basic.uploadPhoto')}
                </Typography>
              </Stack>
            )}
          </Box>

          <ListItemText
            sx={{
              mt: 3,
              ml: { md: 3 },
              textAlign: { xs: 'center', md: 'unset' },
            }}
            primary={
              <UserDisplayName user={user} sx={{ justifyContent: 'center' }} />
            }
            secondary={capitalize(user?.level)}
            slotProps={{
              primary: {
                variant: 'h4',
              },
              secondary: {
                color: 'inherit',
                component: 'span',
                variant: 'body2',
                sx: { opacity: 0.48, mt: 0.5 },
              },
            }}
          />
        </Stack>
      </Container>
      {isOwner && (
        <Stack
          className="editCover"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            display: 'none',
          }}
        >
          <IconButton onClick={openCoverMediaDialog} size="large">
            <Iconify icon="eva:camera-fill" width={32} height={32} />
          </IconButton>
        </Stack>
      )}
      {!isOwner && (
        <Box
          sx={{
            position: 'absolute',
            top: {
              xs: 8,
              md: 'unset',
            },
            bottom: {
              xs: 'unset',
              md: 64,
            },
            right: 8,
          }}
        >
          {
            // TODO: Add follow button
          }
        </Box>
      )}
    </Box>
  );
}
