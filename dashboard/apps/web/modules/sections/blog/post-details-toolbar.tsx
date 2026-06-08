import { Link } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Stack, { StackProps } from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import {
  EPostStatus,
  handleErrorResponse,
  IPost,
  paths,
} from '@seven-auto/libs';
import { useQueryClient } from '@tanstack/react-query';
import CustomPopover, { usePopover } from 'modules/components/custom-popover';
import Iconify from 'modules/components/iconify';
import { enqueueSnackbar } from 'modules/components/snackbar';
import { ICONS_NAME } from 'modules/const/icons';
import { queryName } from 'modules/const/query-name';
import { useBoolean } from 'modules/hooks/use-boolean';
import { useTranslate } from 'modules/locales';
import { RouterLink } from 'modules/routes/components';
import apiServices from 'modules/services/apiService';
import { useMemo, useState } from 'react';
// ----------------------------------------------------------------------

type Props = StackProps & {
  post: IPost;
};

export default function PostDetailsToolbar({ post, sx, ...other }: Props) {
  const popover = usePopover();
  const { t } = useTranslate();
  const isLoading = useBoolean();
  const backLink = paths.dashboard.post.root;
  const editLink = paths.dashboard.post.edit(post.slug || '');
  const [status, setStatus] = useState(post?.status || EPostStatus.DRAFT);
  const queryClient = useQueryClient();

  const liveLink = useMemo(() => {
    return paths.post.details(post.slug || '');
  }, [post.slug]);

  const onChangeStatus = async (newStatus: EPostStatus) => {
    isLoading.onTrue();
    try {
      await apiServices.post.updatePost(post.id, {
        id: post.id,
        status: newStatus,
      });
      queryClient.invalidateQueries({
        queryKey: [queryName.GET_POST_BY_SLUG, post.slug],
      });
    } catch (error) {
      enqueueSnackbar(t(handleErrorResponse(error)), { variant: 'error' });
    }
    setStatus(newStatus);
    isLoading.onFalse();
  };

  if (!post) return null;

  return (
    <>
      <Stack
        spacing={1.5}
        direction="row"
        sx={{
          mb: { xs: 3, md: 5 },
          ...sx,
        }}
        {...other}
      >
        <Button
          component={RouterLink}
          href={backLink}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
        >
          {t('basic.back')}
        </Button>

        <Box sx={{ flexGrow: 1 }} />

        {status === EPostStatus.PUBLISHED && (
          <Tooltip title={t('posts.goLive')}>
            <IconButton
              component={Link}
              href={liveLink}
              disabled={!liveLink || liveLink === '#'}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Iconify icon={ICONS_NAME.linkExternal} />
            </IconButton>
          </Tooltip>
        )}

        <Tooltip title={t('basic.edit')}>
          <IconButton component={RouterLink} href={editLink}>
            <Iconify icon={ICONS_NAME.edit} />
          </IconButton>
        </Tooltip>

        <Button
          color="inherit"
          variant="contained"
          loading={isLoading.value}
          loadingIndicator="Loading…"
          endIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
          onClick={popover.onOpen}
          sx={{ textTransform: 'capitalize' }}
        >
          {t(`posts.status.${status}`)}
        </Button>
      </Stack>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="top-right"
        sx={{ width: 140 }}
      >
        <MenuItem
          selected={status === EPostStatus.DRAFT}
          onClick={() => {
            popover.onClose();
            onChangeStatus(EPostStatus.DRAFT);
          }}
        >
          <Iconify icon="solar:file-text-bold" />
          {t(`posts.status.${EPostStatus.DRAFT}`)}
        </MenuItem>
        <MenuItem
          selected={status === EPostStatus.PUBLISHED}
          onClick={() => {
            popover.onClose();
            onChangeStatus(EPostStatus.PUBLISHED);
          }}
        >
          <Iconify icon="eva:cloud-upload-fill" />
          {t(`posts.status.${EPostStatus.PUBLISHED}`)}
        </MenuItem>
      </CustomPopover>
    </>
  );
}
