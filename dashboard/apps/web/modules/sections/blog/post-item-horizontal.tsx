import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import {
  EPostStatus,
  getDisplayName,
  handleErrorResponse,
  IPost,
  paths,
} from '@seven-auto/libs';
import CustomPopover, { usePopover } from 'modules/components/custom-popover';
import Iconify from 'modules/components/iconify';
import Image from 'modules/components/image';
import Label from 'modules/components/label';
import { enqueueSnackbar } from 'modules/components/snackbar';
import TextMaxLine from 'modules/components/text-max-line';
import { ICONS_NAME } from 'modules/const/icons';
import { useBoolean } from 'modules/hooks/use-boolean';
import { useResponsive } from 'modules/hooks/use-responsive';
import { useTranslate } from 'modules/locales';
import { RouterLink } from 'modules/routes/components';
import { useRouter } from 'modules/routes/hooks';
import apiServices from 'modules/services/apiService';
import { getPostStatusColor } from 'modules/store/post';
import { fShortenNumber } from 'modules/utils/format-number';
import { fDate } from 'modules/utils/format-time';
import { getMediaUrl } from 'modules/utils/get-media-url';

// ----------------------------------------------------------------------

type Props = {
  post: IPost;
};

export default function PostItemHorizontal({ post }: Props) {
  const popover = usePopover();
  const isDeleting = useBoolean();
  const isDeleted = useBoolean();

  const { t } = useTranslate();

  const router = useRouter();

  const smUp = useResponsive('up', 'sm');

  const {
    id,
    title,
    slug,
    author,
    status,
    media,
    createdAt,
    views,
    description,
  } = post;

  const likes = 0;
  const comments = 0;

  const handleDelete = async () => {
    try {
      isDeleting.onTrue();
      await apiServices.post.deletePost(id || '');
      isDeleted.onTrue();
      enqueueSnackbar(t('basic.deleteSuccess'), { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(t(handleErrorResponse(error)), { variant: 'error' });
    } finally {
      isDeleting.onFalse();
    }
  };

  if (isDeleted.value) {
    return null;
  }

  return (
    <>
      <Stack component={Card} direction="row">
        <Stack
          sx={{
            p: (theme) => theme.spacing(3, 3, 2, 3),
          }}
        >
          <Stack
            direction="row"
            sx={{
              mb: 2,
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 1,
            }}
          >
            <Label
              variant="soft"
              color={getPostStatusColor(status as EPostStatus)}
            >
              {t(`posts.status.${status}`)}
            </Label>

            <Box
              component="span"
              sx={{ typography: 'caption', color: 'text.disabled' }}
            >
              {fDate(createdAt)}
            </Box>
          </Stack>

          <Stack spacing={1} sx={{ flexGrow: 1 }}>
            <Link
              color="inherit"
              component={RouterLink}
              href={paths.dashboard.post.details(slug || '')}
            >
              <TextMaxLine variant="subtitle2" line={2}>
                {title}
              </TextMaxLine>
            </Link>

            <TextMaxLine variant="body2" sx={{ color: 'text.secondary' }}>
              {description}
            </TextMaxLine>
          </Stack>

          <Stack direction="row" sx={{ alignItems: 'center' }}>
            <IconButton
              color={popover.open ? 'inherit' : 'default'}
              onClick={popover.onOpen}
            >
              <Iconify icon="eva:more-horizontal-fill" />
            </IconButton>

            <Stack
              spacing={1.5}
              direction="row"
              sx={{
                typography: 'caption',
                color: 'text.disabled',
                alignItems: 'center',
                flexWrap: 'wrap',
                flexGrow: 1,
                justifyContent: 'flex-end',
              }}
            >
              {(views || 0) > 0 && (
                <Stack direction="row" sx={{ alignItems: 'center' }}>
                  <Iconify icon="solar:eye-bold" width={16} sx={{ mr: 0.5 }} />
                  {fShortenNumber(views || 0)}
                </Stack>
              )}
              {(likes || 0) > 0 && (
                <Stack direction="row" sx={{ alignItems: 'center' }}>
                  <Iconify icon="solar:love-bold" width={16} sx={{ mr: 0.5 }} />
                  {fShortenNumber(likes || 0)}
                </Stack>
              )}
              {(comments || 0) > 0 && (
                <Stack direction="row" sx={{ alignItems: 'center' }}>
                  <Iconify
                    icon="eva:message-circle-fill"
                    width={16}
                    sx={{ mr: 0.5 }}
                  />
                  {fShortenNumber(comments || 0)}
                </Stack>
              )}
            </Stack>
          </Stack>
        </Stack>

        {smUp && (
          <Box
            sx={{
              width: 180,
              height: 240,
              ml: 'auto',
              position: 'relative',
              flexShrink: 0,
              p: 1,
            }}
          >
            <Avatar
              alt={getDisplayName(author)}
              src={getMediaUrl(author?.avatar)}
              sx={{ position: 'absolute', top: 16, right: 16, zIndex: 9 }}
            >
              {getDisplayName(author).charAt(0)}
            </Avatar>
            <Image
              alt={title}
              src={getMediaUrl(media)}
              sx={{
                width: 1,
                height: 1,
                borderRadius: 1.5,
              }}
            />
          </Box>
        )}
      </Stack>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="bottom-center"
        sx={{ width: 140 }}
      >
        <MenuItem
          disabled={isDeleting.value}
          onClick={() => {
            popover.onClose();
            router.push(paths.dashboard.post.details(slug || ''));
          }}
        >
          <Iconify icon="solar:eye-bold" />
          {t('basic.view')}
        </MenuItem>

        <MenuItem
          disabled={isDeleting.value}
          onClick={() => {
            popover.onClose();
            router.push(paths.dashboard.post.edit(slug || ''));
          }}
        >
          <Iconify icon={ICONS_NAME.edit} />
          {t('basic.edit')}
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleDelete();
            popover.onClose();
          }}
          disabled={isDeleting.value}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon={ICONS_NAME.delete} />
          {t('basic.delete')}
        </MenuItem>
      </CustomPopover>
    </>
  );
}
