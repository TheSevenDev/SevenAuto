import {
  Container,
  Dialog,
  DialogActions,
  Divider,
  IconButton,
  Stack,
  SxProps,
  Tooltip,
  Typography,
} from '@mui/material';
import { ContentView } from 'modules/components/editor';
import EmptyContent from 'modules/components/empty-content';
import Iconify from 'modules/components/iconify';
import Scrollbar from 'modules/components/scrollbar';
import { ICONS_NAME } from 'modules/const/icons';
import { useBoolean } from 'modules/hooks/use-boolean';
import { useTranslate } from 'modules/locales';
import React, { useCallback } from 'react';

interface DialogViewContentProps {
  title?: string;
  description?: string;
  content?: string;
  iconName?: string;
  sx?: SxProps;
  sxDialog?: SxProps;
}

export function DialogViewContent({
  title,
  description,
  content,
  iconName,
  sx,
  sxDialog,
}: DialogViewContentProps) {
  const { t } = useTranslate();

  const open = useBoolean();

  const onClose = useCallback(() => open.onFalse(), [open]);

  return (
    <>
      <Tooltip title={t('basic.content')}>
        <IconButton onClick={open.onTrue} sx={sx}>
          <Iconify icon={iconName || ICONS_NAME.info} />
        </IconButton>
      </Tooltip>

      <Dialog fullWidth open={open.value} onClose={onClose} sx={sxDialog}>
        <DialogActions sx={{ py: 2, px: 3 }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {t('basic.content')}
          </Typography>
          <IconButton onClick={onClose}>
            <Iconify icon={ICONS_NAME.close} />
          </IconButton>
        </DialogActions>
        <Divider />
        {content ? (
          <Scrollbar>
            <Container sx={{ mt: 5, mb: 10 }}>
              {description && (
                <>
                  <Typography variant="body1" sx={{ mb: 3 }}>
                    {description}
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                </>
              )}
              <Stack
                sx={{
                  maxWidth: 720,
                  mx: 'auto',
                }}
              >
                {title && (
                  <Typography variant="h6" sx={{ mb: 3 }}>
                    {title}
                  </Typography>
                )}
                <ContentView content={content} />
              </Stack>
            </Container>
          </Scrollbar>
        ) : (
          <EmptyContent filled title={t('basic.emptyContent')} />
        )}
      </Dialog>
    </>
  );
}
