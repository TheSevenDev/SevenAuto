import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { SxProps, Theme } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import { IMedia } from '@seven-auto/libs';

import DownloadButton from './download-button';
import { fileData, fileFormat, fileThumb } from './utils';

// ----------------------------------------------------------------------

type FileIconProps = {
  file: IMedia | File | string;
  tooltip?: boolean;
  imageView?: boolean;
  onDownload?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  sx?: SxProps<Theme>;
  imgSx?: SxProps<Theme>;
};

export default function FileThumbnail({
  file,
  tooltip,
  imageView,
  onDownload,
  sx,
  imgSx,
}: FileIconProps) {
  const { name = '', path = '', preview = '' } = fileData(file);
  const format = fileFormat(path || preview);

  const renderContent =
    format === 'image' && imageView ? (
      <Box
        component="img"
        src={preview}
        sx={{
          width: 1,
          height: 1,
          flexShrink: 0,
          objectFit: 'cover',
          ...imgSx,
        }}
      />
    ) : (
      <Box
        component="img"
        src={
          (format === 'image' && preview !== 'image'
            ? preview
            : fileThumb(format)) || fileThumb(format)
        }
        sx={{
          width: 32,
          height: 32,
          flexShrink: 0,
          ...sx,
        }}
      />
    );

  if (tooltip) {
    return (
      <Tooltip title={name}>
        <Stack
          component="span"
          sx={{
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            width: 'fit-content',
            height: 'inherit',
          }}
        >
          {renderContent}
          {onDownload && <DownloadButton onDownload={onDownload} />}
        </Stack>
      </Tooltip>
    );
  }

  return (
    <>
      {renderContent}
      {onDownload && <DownloadButton onDownload={onDownload} />}
    </>
  );
}
