import { LinearProgress } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';
import { AnimatePresence, m } from 'framer-motion';
import { fData } from 'modules/utils/format-number';

import { varFade } from '../animate';
import FileThumbnail, { fileData } from '../file-thumbnail';
import Iconify from '../iconify';
import { UploadProps } from './types';

// ----------------------------------------------------------------------

export default function MultiFilePreview({
  thumbnail,
  files,
  onRemove,
  sx,
}: UploadProps) {
  return (
    <AnimatePresence initial={false}>
      {files?.map((file) => {
        const { key, name = '', size = 0, loading, status } = fileData(file);

        const isNotFormatFile = typeof file === 'string';

        if (thumbnail) {
          return (
            <Stack
              key={key}
              component={m.div}
              {...varFade().inUp}
              sx={{
                alignItems: 'center',
                display: 'inline-flex',
                justifyContent: 'center',
                m: 0.5,
                width: 80,
                height: 80,
                borderRadius: 1.25,
                overflow: 'hidden',
                position: 'relative',
                border: (theme) =>
                  `solid 1px ${alpha(theme.palette.grey[500], 0.16)}`,
                ...sx,
              }}
            >
              <FileThumbnail
                tooltip
                imageView
                file={file}
                sx={{ position: 'absolute' }}
                imgSx={{ position: 'absolute' }}
              />

              {onRemove && (
                <IconButton
                  size="small"
                  onClick={() => onRemove(file)}
                  sx={{
                    p: 0.5,
                    top: 4,
                    right: 4,
                    position: 'absolute',
                    color: 'common.white',
                    bgcolor: (theme) => alpha(theme.palette.grey[900], 0.48),
                    '&:hover': {
                      bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
                    },
                  }}
                >
                  <Iconify icon="mingcute:close-line" width={14} />
                </IconButton>
              )}
            </Stack>
          );
        }

        return (
          <Stack
            key={key}
            component={m.div}
            {...varFade().inUp}
            spacing={2}
            direction="row"
            sx={{
              alignItems: 'center',
              position: 'relative',
              my: 1,
              py: 1,
              px: 1.5,
              borderRadius: 1,
              ...(status && {
                bgcolor: (theme) =>
                  status === 'error'
                    ? alpha(theme.palette.error.main, 0.2)
                    : alpha(theme.palette.success.main, 0.2),
              }),
              border: (theme) =>
                `solid 1px ${alpha(theme.palette.grey[500], 0.16)}`,
              ...sx,
            }}
          >
            <FileThumbnail
              file={file}
              sx={{
                objectFit: 'contain',
                bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
              }}
            />

            <ListItemText
              primary={isNotFormatFile ? file : name}
              secondary={isNotFormatFile ? '' : fData(size)}
              slotProps={{
                secondary: {
                  component: 'span',
                  variant: 'caption',
                },
              }}
            />
            {onRemove && (
              <IconButton size="small" onClick={() => onRemove(file)}>
                <Iconify
                  icon={
                    status
                      ? status === 'error'
                        ? 'eva:close-circle-outline'
                        : 'eva:checkmark-circle-2-outline'
                      : 'mingcute:close-line'
                  }
                  width={16}
                />
              </IconButton>
            )}
            {loading && (
              <LinearProgress
                color="primary"
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  flexGrow: 1,
                }}
              />
            )}
          </Stack>
        );
      })}
    </AnimatePresence>
  );
}
