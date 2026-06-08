import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import { paths } from '@seven-auto/libs';
import { m } from 'framer-motion';
import { CreditIcon } from 'modules/atoms';
import { useAuthContext } from 'modules/auth/hooks';
import { varHover } from 'modules/components/animate';
import CustomPopover, { usePopover } from 'modules/components/custom-popover';
import Iconify from 'modules/components/iconify';
import { ICONS_NAME } from 'modules/const/icons';
import { useBoolean } from 'modules/hooks/use-boolean';
import { useTranslate } from 'modules/locales';
import ConvertCommissionForm from 'modules/molecules/convert-commission-form';
import { fNumber, fShortenNumber } from 'modules/utils/format-number';
import Link from 'next/link';

// ----------------------------------------------------------------------

export default function CreditsPopover() {
  const popover = usePopover();
  const convertDialog = useBoolean();

  const { t } = useTranslate();
  const { currentUser } = useAuthContext();

  if (!currentUser) return null;

  return (
    <>
      <Stack direction="row" spacing={1}>
        <Tooltip
          title={`${t('credits.credits')}: ${fNumber(currentUser?.credits || 0) || '0'}`}
          placement="bottom"
        >
          <Button
            component={m.button}
            whileTap="tap"
            whileHover="hover"
            variants={varHover(1.05)}
            onClick={popover.onOpen}
            sx={{
              p: 0.5,
              pr: 1,
              bgcolor: 'primary.main',
            }}
          >
            <CreditIcon
              sx={{
                width: 20,
                height: 20,
              }}
            />
            <Typography variant="subtitle2" sx={{ ml: 0.5 }}>
              {fShortenNumber(currentUser?.credits || 0) || '0'}
            </Typography>
          </Button>
        </Tooltip>
      </Stack>
      <CustomPopover
        sx={{ mt: 1 }}
        open={popover.open}
        onClose={popover.onClose}
      >
        <MenuItem component={Link} href={paths.payment}>
          <Iconify
            icon={ICONS_NAME.plus}
            sx={{ borderRadius: 0.65, width: 28 }}
          />
          {t('payments.depositCredits')}
        </MenuItem>
        <MenuItem component={Link} href={`${paths.dashboard.user.transaction}`}>
          <Iconify
            icon={ICONS_NAME.history}
            sx={{ borderRadius: 0.65, width: 28 }}
          />
          {t('payments.transactionHistory')}
        </MenuItem>
        <MenuItem
          onClick={() => {
            popover.onClose();
            convertDialog.onTrue();
          }}
        >
          <Iconify
            icon={ICONS_NAME.convert}
            sx={{ borderRadius: 0.65, width: 28 }}
          />
          {t('payments.convertCommission')}
        </MenuItem>
      </CustomPopover>

      <Dialog
        open={convertDialog.value}
        maxWidth="sm"
        fullWidth
        onClose={() => convertDialog.onFalse()}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            zIndex: 1,
          }}
        >
          <IconButton size="small" onClick={() => convertDialog.onFalse()}>
            <Iconify icon={ICONS_NAME.close} />
          </IconButton>
        </Box>
        <DialogTitle>{t('payments.convertCommission')}</DialogTitle>
        <DialogContent
          sx={{
            pb: 2,
          }}
        >
          <ConvertCommissionForm
            onCallBack={() => {
              convertDialog.onFalse();
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
