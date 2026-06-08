import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import { alpha, useTheme } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow, { tableRowClasses } from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { IMedia } from '@seven-auto/libs';
import { format } from 'date-fns';
import _ from 'lodash';
import { ConfirmDialog } from 'modules/components/custom-dialog';
import CustomPopover, { usePopover } from 'modules/components/custom-popover';
import FileThumbnail from 'modules/components/file-thumbnail';
import Iconify from 'modules/components/iconify';
import { useSnackbar } from 'modules/components/snackbar';
import { ICONS_NAME } from 'modules/const/icons';
import { useBoolean } from 'modules/hooks/use-boolean';
import { useCopyToClipboard } from 'modules/hooks/use-copy-to-clipboard';
import { useDoubleClick } from 'modules/hooks/use-double-click';
import { useTranslate } from 'modules/locales';
import { fData } from 'modules/utils/format-number';
import { getMediaUrl } from 'modules/utils/get-media-url';
import { useCallback } from 'react';

import FileManagerFileDetails from './file-manager-file-details';

// ----------------------------------------------------------------------

type Props = {
  row: IMedia;
  selected: boolean;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
  isSelectMultiple: boolean;
  onCallBack?: (media: IMedia) => void;
};

export default function FileManagerTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  isSelectMultiple,
  onCallBack,
}: Props) {
  const theme = useTheme();
  const { t } = useTranslate();

  const { title, size, type, source, updatedAt } = row;

  const { enqueueSnackbar } = useSnackbar();

  const { copy } = useCopyToClipboard();

  const details = useBoolean();

  const confirm = useBoolean();

  const popover = usePopover();

  const handleClick = useDoubleClick({
    click: () => {
      if (!isSelectMultiple && onCallBack) {
        onCallBack(row);
      } else {
        details.onTrue();
      }
    },
    doubleClick: () => {
      details.onTrue();
    },
  });

  const handleCopy = useCallback(() => {
    enqueueSnackbar(t('basic.copied'));
    copy(getMediaUrl(row, 'original') || '');
  }, [copy, enqueueSnackbar, row, t]);

  const defaultStyles = {
    borderTop: `solid 1px ${alpha(theme.palette.grey[500], 0.16)}`,
    borderBottom: `solid 1px ${alpha(theme.palette.grey[500], 0.16)}`,
    '&:first-of-type': {
      borderTopLeftRadius: 16,
      borderBottomLeftRadius: 16,
      borderLeft: `solid 1px ${alpha(theme.palette.grey[500], 0.16)}`,
    },
    '&:last-of-type': {
      borderTopRightRadius: 16,
      borderBottomRightRadius: 16,
      borderRight: `solid 1px ${alpha(theme.palette.grey[500], 0.16)}`,
    },
  };

  return (
    <>
      <TableRow
        selected={selected}
        sx={{
          borderRadius: 2,
          [`&.${tableRowClasses.selected}, &:hover`]: {
            backgroundColor: 'background.paper',
            boxShadow: theme.customShadows.z20,
            transition: theme.transitions.create(
              ['background-color', 'box-shadow'],
              {
                duration: theme.transitions.duration.shortest,
              },
            ),
            '&:hover': {
              backgroundColor: 'background.paper',
              boxShadow: theme.customShadows.z20,
            },
          },
          [`& .${tableCellClasses.root}`]: {
            ...defaultStyles,
          },
          ...(details.value && {
            [`& .${tableCellClasses.root}`]: {
              ...defaultStyles,
            },
          }),
        }}
      >
        {isSelectMultiple && (
          <TableCell padding="checkbox">
            <Checkbox
              checked={selected}
              onDoubleClick={() => {
                // ON DOUBLE CLICK
              }}
              onClick={onSelectRow}
            />
          </TableCell>
        )}

        <TableCell onClick={handleClick}>
          <Stack sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FileThumbnail
              imageView
              file={row}
              imgSx={{ width: 36, height: 36 }}
            />
            <Typography
              noWrap
              variant="inherit"
              sx={{
                maxWidth: 360,
                cursor: 'pointer',
                ...(details.value && { fontWeight: 'fontWeightBold' }),
              }}
            >
              {title}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell onClick={handleClick} sx={{ whiteSpace: 'nowrap' }}>
          {fData(size || 0)}
        </TableCell>

        <TableCell onClick={handleClick} sx={{ whiteSpace: 'nowrap' }}>
          <ListItemText
            primary={_.startCase(_.toLower(type))}
            secondary={_.startCase(_.toLower(source))}
            slotProps={{
              primary: { variant: 'body2' },
              secondary: {
                component: 'span',
                variant: 'caption',
                sx: {
                  mt: 0.5,
                },
              },
            }}
          />
        </TableCell>

        <TableCell onClick={handleClick} sx={{ whiteSpace: 'nowrap' }}>
          <ListItemText
            primary={format(new Date(updatedAt), 'dd MMM yyyy')}
            secondary={format(new Date(updatedAt), 'p')}
            slotProps={{
              primary: { variant: 'body2' },
              secondary: {
                component: 'span',
                variant: 'caption',
                sx: {
                  mt: 0.5,
                },
              },
            }}
          />
        </TableCell>

        <TableCell
          align="right"
          sx={{
            px: 1,
            whiteSpace: 'nowrap',
          }}
        >
          <IconButton
            color={popover.open ? 'inherit' : 'default'}
            onClick={popover.onOpen}
          >
            <Iconify icon={ICONS_NAME.more} />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
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
        <Divider sx={{ borderStyle: 'dashed' }} />

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
        item={row}
        onCopyLink={handleCopy}
        open={details.value}
        onClose={details.onFalse}
        onDelete={onDeleteRow}
      />

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={t('basic.delete')}
        content={t('common.areYouSureWantToDelete')}
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            {t('basic.delete')}
          </Button>
        }
      />
    </>
  );
}
