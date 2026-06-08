'use client';

import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import _ from 'lodash';
import Scrollbar from 'modules/components/scrollbar';
import { useTranslate } from 'modules/locales';
import { useMediaStore } from 'modules/store/media';

import FileManagerView from './file-manager-view';
// ----------------------------------------------------------------------

export default function FileManagerDialog() {
  const { t } = useTranslate();
  const {
    openMediaDialog,
    isSelectMultiple,
    selected,
    setMediaState,
    onCallBack,
  } = useMediaStore();

  return (
    <Dialog
      open={openMediaDialog}
      maxWidth="lg"
      onClose={() => {
        setMediaState({
          openMediaDialog: false,
          isSelectMultiple: true,
        });
      }}
      fullWidth
    >
      <DialogContent sx={{ p: { xs: 0.5, md: 1 }, height: '600px' }}>
        <Scrollbar>
          <FileManagerView />
        </Scrollbar>
      </DialogContent>

      <DialogActions
        sx={{
          py: 2,
          borderTop: (theme) => `solid 1px ${theme.palette.divider}`,
        }}
      >
        {isSelectMultiple && (
          <Button
            disabled={!selected?.length}
            onClick={() => {
              if (onCallBack) onCallBack(selected);
              setMediaState({
                openMediaDialog: false,
                isSelectMultiple: true,
              });
            }}
            variant="contained"
            color="primary"
          >
            {_.capitalize(t('basic.select'))}
          </Button>
        )}

        <Button
          onClick={() => {
            setMediaState({
              openMediaDialog: false,
              isSelectMultiple: true,
            });
          }}
          variant="contained"
        >
          {t('basic.cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
