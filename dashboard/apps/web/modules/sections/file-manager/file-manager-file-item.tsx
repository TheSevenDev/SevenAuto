import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { CardProps } from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { EMediaType, IMedia } from '@seven-auto/libs';
import { ConfirmDialog } from 'modules/components/custom-dialog';
import CustomPopover, { usePopover } from 'modules/components/custom-popover';
import FileThumbnail from 'modules/components/file-thumbnail';
import Iconify from 'modules/components/iconify';
import Image from 'modules/components/image';
import { useSnackbar } from 'modules/components/snackbar';
import TextMaxLine from 'modules/components/text-max-line';
import { ICONS_NAME } from 'modules/const/icons';
import { useBoolean } from 'modules/hooks/use-boolean';
import { useCopyToClipboard } from 'modules/hooks/use-copy-to-clipboard';
import { useDoubleClick } from 'modules/hooks/use-double-click';
import { useTranslate } from 'modules/locales';
import { fData } from 'modules/utils/format-number';
import { fDateTime } from 'modules/utils/format-time';
import { getMediaUrl } from 'modules/utils/get-media-url';
import { useCallback } from 'react';

import FileManagerFileDetails from './file-manager-file-details';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  file: IMedia;
  selected?: boolean;
  onSelect?: VoidFunction;
  onDelete: VoidFunction;
  isSelectMultiple?: boolean;
  onCallBack?: (media: IMedia) => void;
}

export default function FileManagerFileItem({
  file,
  selected,
  onSelect,
  onDelete,
  isSelectMultiple = true,
  onCallBack,
  sx,
  ...other
}: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslate();
  const { copy } = useCopyToClipboard();

  const confirm = useBoolean();

  const details = useBoolean();

  const popover = usePopover();

  const handleCopy = useCallback(() => {
    enqueueSnackbar(t('basic.copied'));
    copy(getMediaUrl(file, 'original') || '');
  }, [copy, enqueueSnackbar, file, t]);

  const handleClick = useDoubleClick({
    click: () => {
      if (!isSelectMultiple && onCallBack) {
        onCallBack(file);
      } else {
        details.onTrue();
      }
    },
    doubleClick: () => {
      details.onTrue();
    },
  });

  const renderAction = (
    <Stack
      direction="row"
      sx={{
        top: 8,
        right: 8,
        position: 'absolute',
        alignItems: 'center',
      }}
    >
      {isSelectMultiple && (
        <Checkbox
          size="medium"
          checked={selected}
          onClick={onSelect}
          icon={<Iconify icon="eva:radio-button-off-fill" />}
          checkedIcon={<Iconify icon="eva:checkmark-circle-2-fill" />}
          sx={{ p: 0.75 }}
        />
      )}
      <IconButton
        color={popover.open ? 'inherit' : 'default'}
        onClick={popover.onOpen}
      >
        <Iconify icon={ICONS_NAME.more} />
      </IconButton>
    </Stack>
  );

  const renderText = (
    <>
      <TextMaxLine
        persistent
        variant="subtitle2"
        onClick={handleClick}
        sx={{ width: 1, mt: 2, mb: 0.5 }}
      >
        {file.title}
      </TextMaxLine>

      <Stack
        direction="row"
        sx={{
          display: 'flex',
          alignItems: 'center',
          maxWidth: 0.99,
          whiteSpace: 'nowrap',
          typography: 'caption',
          color: 'text.disabled',
        }}
      >
        {fData(file.size || 0)}

        <Box
          component="span"
          sx={{
            mx: 0.75,
            width: 2,
            height: 2,
            flexShrink: 0,
            borderRadius: '50%',
            bgcolor: 'currentColor',
          }}
        />
        <Typography noWrap component="span" variant="caption">
          {fDateTime(file.updatedAt || file.createdAt)}
        </Typography>
      </Stack>
    </>
  );

  return (
    <>
      <Stack
        component={Paper}
        variant="outlined"
        sx={{
          alignItems: 'flex-start',
          p: 2.5,
          borderRadius: 2,
          bgcolor: 'unset',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          ...(selected && {
            bgcolor: 'background.paper',
            boxShadow: (theme) => theme.customShadows.z20,
          }),
          ...sx,
        }}
        {...other}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            mt: 3,
          }}
          onClick={handleClick}
        >
          {file.type === EMediaType.IMAGE ? (
            <Image
              alt={file.title}
              src={getMediaUrl(file, 'md')}
              ratio="16/9"
              sx={{
                borderRadius: 1.5,
              }}
            />
          ) : (
            <Box
              sx={{
                width: '100%',
                verticalAlign: 'bottom',
                backgroundSize: 'cover',
                paddingTop: 'calc(100% / 16* 9)',
                position: 'relative',
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
                  file={file}
                  sx={{
                    width: '100%',
                    height: '100%',
                  }}
                />
              </Box>
            </Box>
          )}
        </Box>

        {renderText}

        {renderAction}
      </Stack>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 180 }}
      >
        <MenuItem
          onClick={() => {
            popover.onClose();
            details.onTrue();
          }}
        >
          <Iconify icon="eva:eye-fill" />
          {t('common.viewDetails')}
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
            handleCopy();
          }}
        >
          <Iconify icon="eva:link-2-fill" />
          {t('common.copyLink')}
        </MenuItem>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon={ICONS_NAME.delete} />
          {t('basic.delete')}
        </MenuItem>
      </CustomPopover>

      <FileManagerFileDetails
        item={file}
        onCopyLink={handleCopy}
        open={details.value}
        onClose={details.onFalse}
        onDelete={onDelete}
      />

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={t('basic.delete')}
        content={t('common.areYouSureWantToDelete')}
        action={
          <Button variant="contained" color="error" onClick={onDelete}>
            {t('basic.delete')}
          </Button>
        }
      />
    </>
  );
}
