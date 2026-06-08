import { Link, useTheme } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { IEmailTemplate, paths } from '@seven-auto/libs';
import CustomPopover, { usePopover } from 'modules/components/custom-popover';
import Iconify from 'modules/components/iconify';
import { ICONS_NAME } from 'modules/const/icons';
import { useTranslate } from 'modules/locales';

// ----------------------------------------------------------------------

type Props = {
  row: IEmailTemplate;
};

export default function EmailTemplateTableRow({ row }: Props) {
  const { name, key, title } = row;
  const theme = useTheme();
  const { t } = useTranslate();
  const popover = usePopover();
  return (
    <>
      <TableRow hover>
        <TableCell>{key}</TableCell>
        <TableCell>{name}</TableCell>
        <TableCell>{title}</TableCell>
        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
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
        sx={{ width: 140 }}
      >
        <MenuItem component={Link} href={paths.dashboard.email.details(row.id)}>
          <Iconify icon={ICONS_NAME.edit} color={theme.palette.text.primary} />
          {t('basic.edit')}
        </MenuItem>
      </CustomPopover>
    </>
  );
}
