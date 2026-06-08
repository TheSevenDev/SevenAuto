import { IconButton, IconButtonProps, SxProps } from '@mui/material';
import Iconify from 'modules/components/iconify';
import { enqueueSnackbar } from 'modules/components/snackbar';
import { ICONS_NAME } from 'modules/const/icons';
import { useCopyToClipboard } from 'modules/hooks/use-copy-to-clipboard';
import { useTranslate } from 'modules/locales';
import React, { useCallback } from 'react';

interface IProps extends IconButtonProps {
  text: string;
  customNotify?: string;
  iconSx?: SxProps;
}

export default function CopyIcon({ text, customNotify, ...rest }: IProps) {
  const { copy } = useCopyToClipboard();
  const { t } = useTranslate();

  const handleCopy = useCallback(() => {
    enqueueSnackbar(customNotify || t('basic.copied'), {
      variant: 'success',
    });
    copy(text);
  }, [customNotify, t, copy, text]);

  return (
    <IconButton onClick={() => {}} {...rest}>
      <Iconify
        onClick={handleCopy}
        icon={ICONS_NAME.copy}
        sx={{
          fontSize: 20,
          color: 'text.secondary',
          ...rest.iconSx,
        }}
      />
    </IconButton>
  );
}
