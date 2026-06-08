import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { useTranslate } from 'modules/locales';
import React, { JSXElementConstructor } from 'react';

const Transition = React.forwardRef(
  (
    props: TransitionProps & {
      children: React.ReactElement<
        unknown,
        string | JSXElementConstructor<unknown>
      >;
    },
    ref: React.Ref<unknown>,
  ) => <Slide direction="up" ref={ref} {...props} />,
);
Transition.displayName = 'Transition';

interface IProps {
  open: boolean;
  handleClose: () => void;
  handleConfirm: () => void;
}

const WarningFormAlert = ({ open, handleClose, handleConfirm }: IProps) => {
  const { t } = useTranslate();

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="warning-form-dialog-title"
      aria-describedby="warning-form-dialog-description"
      slotProps={{
        transition: Transition,
      }}
    >
      <DialogTitle id="warning-form-dialog-title">
        {t('form.warningFormDialogTitle')}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="warning-form-dialog-description">
          {t('form.warningFormDialogContent')}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{t('basic.cancel')}</Button>
        <Button
          onClick={() => {
            handleConfirm();
          }}
          autoFocus
        >
          {t('basic.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WarningFormAlert;
