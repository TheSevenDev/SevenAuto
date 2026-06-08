'use client';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import {
  EUserLevel,
  EUserStatus,
  getDisplayName,
  IUser,
} from '@seven-auto/libs';
import UserDisplayName from 'modules/atoms/user-display-name';
import { ConfirmDialog } from 'modules/components/custom-dialog';
import CustomPopover, { usePopover } from 'modules/components/custom-popover';
import Iconify from 'modules/components/iconify';
import Label from 'modules/components/label';
import { ICONS_NAME } from 'modules/const/icons';
import { useBoolean } from 'modules/hooks/use-boolean';
import { useTranslate } from 'modules/locales';
import {
  getUserLevelColor,
  getUserStatusColor,
} from 'modules/store/user/user.utils';
import { fDate } from 'modules/utils/format-time';
import { getMediaUrl } from 'modules/utils/get-media-url';

import UserQuickEditForm from './user-quick-edit-form';

// ----------------------------------------------------------------------

type Props = {
  selected: boolean;
  onEditRow: VoidFunction;
  row: IUser;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
  onLoginByAdmin: VoidFunction | undefined;
  onUpdateSuccess?: (user: IUser) => void;
};

export default function UserTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
  onUpdateSuccess,
  onLoginByAdmin,
}: Props) {
  const { avatar, level, role, status, referrer, createdAt, email } = row;
  const { t } = useTranslate();
  const confirm = useBoolean();

  const quickEdit = useBoolean();

  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            alt={getDisplayName(row)}
            src={getMediaUrl(avatar, 'sm')}
            sx={{ mr: 2 }}
          />

          <ListItemText
            primary={<UserDisplayName user={row} variant="body2" />}
            secondary={email}
            slotProps={{
              primary: {
                variant: 'body2',
              },
              secondary: {
                component: 'span',
                color: 'text.disabled',
              },
            }}
          />
        </TableCell>
        <TableCell>
          <Label
            variant="soft"
            color={getUserStatusColor(status || EUserStatus.DELETE)}
          >
            {t(`users.statuses.${status}`)}
          </Label>
        </TableCell>
        <TableCell>
          <Label
            variant="soft"
            color={getUserLevelColor(level || EUserLevel.BASIC)}
          >
            {t(`levels.${level}`)}
          </Label>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{role?.name}</TableCell>

        <TableCell>
          {referrer ? (
            <ListItemText
              primary={<UserDisplayName user={referrer} variant="body2" />}
              secondary={referrer.email}
              slotProps={{
                primary: {
                  variant: 'body2',
                },
                secondary: {
                  component: 'span',
                  color: 'text.disabled',
                },
              }}
            />
          ) : null}
        </TableCell>

        <TableCell>
          <Typography
            variant="body2"
            sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}
          >
            {fDate(createdAt)}
          </Typography>
        </TableCell>

        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          {onLoginByAdmin && (
            <Tooltip title="Login by Admin" placement="top" arrow>
              <IconButton
                color="primary"
                onClick={() => {
                  onLoginByAdmin();
                }}
              >
                <Iconify icon={ICONS_NAME.login} />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Quick Edit" placement="top" arrow>
            <IconButton
              color={quickEdit.value ? 'inherit' : 'default'}
              onClick={quickEdit.onTrue}
            >
              <Iconify icon={ICONS_NAME.edit} />
            </IconButton>
          </Tooltip>

          <IconButton
            color={popover.open ? 'inherit' : 'default'}
            onClick={popover.onOpen}
          >
            <Iconify icon={ICONS_NAME.more} />
          </IconButton>
        </TableCell>
      </TableRow>

      <UserQuickEditForm
        currentUser={row}
        open={quickEdit.value}
        onClose={quickEdit.onFalse}
        onCallback={onUpdateSuccess}
      />

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
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

        <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon={ICONS_NAME.edit} />
          {t('basic.edit')}
        </MenuItem>
      </CustomPopover>

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
