import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import React from 'react';

export default function AlertDialog({
  title,
  content,
  open,
  onDismiss,
  onConfirm,
  confirmBtn = 'Confirm',
  cancelBtn = 'Cancel',
}: {
  title?: string;
  content: string;
  open: boolean;
  onDismiss?: () => void;
  onConfirm?: () => void;
  confirmBtn?: string;
  cancelBtn?: string;
}) {
  return (
    <Dialog
      open={!!open}
      onClose={onDismiss}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-content"
    >
      {title && <DialogTitle id="alert-dialog-title">{title}</DialogTitle>}

      <DialogContent>
        <DialogContentText id="alert-dialog-content">
          {content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {onDismiss && (
          <Button onClick={onDismiss} color="primary">
            {cancelBtn}
          </Button>
        )}
        {onConfirm && (
          <Button
            onClick={onConfirm}
            autoFocus
            color="primary"
            variant="contained"
          >
            {confirmBtn}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
