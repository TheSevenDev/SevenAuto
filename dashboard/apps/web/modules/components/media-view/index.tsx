import { Avatar, Box, Fab, SxProps, Typography } from '@mui/material';
import { EMediaType, IMedia } from '@seven-auto/libs';
import { fData } from 'modules/utils/format-number';
import { getMediaUrl } from 'modules/utils/get-media-url';
import React from 'react';
import { Slide } from 'yet-another-react-lightbox';

import FileThumbnail from '../file-thumbnail/file-thumbnail';
import Iconify from '../iconify';
import { useLightBox } from '../lightbox';
import Lightbox from '../lightbox/lightbox';

interface IProps {
  media?: IMedia;
  alt?: string;
  showDefaultImage?: boolean;
  onRemoveImage?: VoidFunction;
  isLightBox?: boolean;
  sx?: SxProps;
  sxImage?: SxProps;
  showDownloadButton?: boolean;
  showName?: boolean;
}

export default function MediaView({
  media,
  alt,
  showDefaultImage,
  onRemoveImage,
  isLightBox,
  sx,
  sxImage,
  showDownloadButton = true,
  showName = true,
}: IProps) {
  const slide: Slide =
    media?.type === EMediaType.VIDEO
      ? {
          type: 'video',
          width: 1280,
          height: 720,
          poster: getMediaUrl(media, 'url'),
          sources: [
            {
              src: getMediaUrl(media, 'url'),
              type: 'video/mp4',
            },
          ],
        }
      : {
          src: getMediaUrl(media, 'url'),
        };

  const slides = media ? [slide] : [];

  const lightbox = useLightBox(slides);

  const onDownload = () => {
    if (media) {
      window.open(getMediaUrl(media, 'original'), '_blank');
    }
  };

  if (!media && alt && showDefaultImage)
    return (
      <Avatar
        variant="rounded"
        alt={alt}
        sx={{
          width: 60,
          height: 60,
          ...sxImage,
        }}
      >
        {alt?.charAt(0).toUpperCase()}
      </Avatar>
    );

  if (!media) return null;

  return (
    <Box
      sx={{
        position: 'relative',
        p: 1,
        ...sx,
      }}
    >
      {media.type === EMediaType.IMAGE ? (
        <Box
          component="img"
          alt={media.alt || media.title}
          src={getMediaUrl(media)}
          sx={{
            backgroundColor: 'background.neutral',
            width: '100%',
            maxHeight: 400,
            borderRadius: 1.5,
            objectFit: 'contain',
            backgroundSize: 'center',
            ...(isLightBox && {
              cursor: 'pointer',
            }),
            ...sxImage,
          }}
          onClick={() => lightbox.onOpen(getMediaUrl(media, 'url'))}
        />
      ) : (
        <>
          {media.type === EMediaType.VIDEO ? (
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                ...sxImage,
              }}
              onClick={() => lightbox.onOpen(getMediaUrl(media, 'url'))}
            >
              <FileThumbnail
                imageView
                file={media}
                sx={{
                  maxWidth: 200,
                  width: '100%',
                  height: '100%',
                }}
              />
            </Box>
          ) : (
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                ...sxImage,
              }}
              onClick={(e) => {
                if (!showDownloadButton) {
                  e.stopPropagation();
                  e.preventDefault();
                  onDownload();
                }
              }}
            >
              <FileThumbnail
                imageView
                file={media}
                sx={{
                  maxWidth: 200,
                  width: '100%',
                  height: '100%',
                }}
              />
              {showName && (
                <Typography
                  sx={{ mt: 1 }}
                  variant="body2"
                  color="text.secondary"
                >
                  {media.title} - {fData(media.size || 0)}
                </Typography>
              )}
              {showDownloadButton && (
                <Fab
                  size="small"
                  color="info"
                  onClick={onDownload}
                  sx={{
                    position: 'absolute',
                    bottom: 16,
                    left: 16,
                  }}
                >
                  <Iconify icon="eva:download-fill" />
                </Fab>
              )}
            </Box>
          )}
        </>
      )}

      {isLightBox && (
        <Lightbox
          index={lightbox.selected}
          slides={slides}
          open={lightbox.open}
          close={lightbox.onClose}
          disabledThumbnails
          disabledSlideshow
          disabledTotal
          zoom={{
            maxZoomPixelRatio: 4,
            zoomInMultiplier: 1.5,
            doubleTapDelay: 300,
            doubleClickDelay: 300,
            doubleClickMaxStops: 2,
            keyboardMoveDistance: 40,
            wheelZoomDistanceFactor: 0.2,
            pinchZoomDistanceFactor: 0.02,
            scrollToZoom: true,
          }}
        />
      )}
      {onRemoveImage && (
        <Fab
          size="small"
          color="primary"
          onClick={onRemoveImage}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
          }}
        >
          <Iconify icon="eva:close-fill" />
        </Fab>
      )}
    </Box>
  );
}
