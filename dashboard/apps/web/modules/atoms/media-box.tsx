import { alpha, Box, Stack, StackProps } from '@mui/material';
import { EMediaType, IMedia } from '@seven-auto/libs';
import FileThumbnail from 'modules/components/file-thumbnail';
import Iconify from 'modules/components/iconify';
import Image, { ImageRatio } from 'modules/components/image';
import { ICONS_NAME } from 'modules/const/icons';
import { getMediaUrl } from 'modules/utils/get-media-url';
import { useState } from 'react';

interface MediaBoxProps extends StackProps {
  isDisabled?: boolean;
  hasError?: boolean;
  ratio?: ImageRatio;
  media: IMedia;
  onRemove?: () => void;
}

function MediaBox({
  media,
  isDisabled,
  hasError,
  ratio = '16/9',
  sx,
  onRemove,
  ...other
}: MediaBoxProps) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <Stack
      sx={{
        p: 2,
        outline: 'none',
        borderRadius: 1,
        cursor: 'pointer',
        overflow: 'hidden',
        position: 'relative',
        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
        border: (theme) => `1px dashed ${alpha(theme.palette.grey[500], 0.2)}`,
        transition: (theme) => theme.transitions.create(['opacity', 'padding']),
        '&:hover': {
          opacity: 0.72,
        },
        ...(isDisabled && {
          opacity: 0.48,
          pointerEvents: 'none',
        }),
        ...(hasError && {
          color: 'error.main',
          borderColor: 'error.main',
          bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
        }),
        ...sx,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...other}
    >
      {media.type === EMediaType.IMAGE ? (
        <Image
          alt={media.title}
          src={getMediaUrl(media)}
          {...(ratio && { ratio })}
          sx={{
            width: 1,
            height: 1,
            borderRadius: 1,
          }}
        />
      ) : (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            verticalAlign: 'bottom',
            backgroundSize: 'cover',
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          >
            <FileThumbnail
              imageView
              file={media}
              sx={{
                width: '100%',
                height: '100%',
              }}
            />
          </Box>
        </Box>
      )}
      {onRemove && isHovered && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            zIndex: 9,
            backgroundColor: (theme) => alpha(theme.palette.grey[900], 0.3),
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Iconify
            sx={{
              color: 'common.white',
            }}
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            icon={ICONS_NAME.close}
          />
        </Box>
      )}
    </Stack>
  );
}
export default MediaBox;
