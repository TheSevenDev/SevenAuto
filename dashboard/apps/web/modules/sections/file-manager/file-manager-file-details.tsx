import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Drawer, { DrawerProps } from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { EMediaType, IMedia } from '@seven-auto/libs';
import _ from 'lodash';
import FileThumbnail, { fileFormat } from 'modules/components/file-thumbnail';
import Iconify from 'modules/components/iconify';
import Scrollbar from 'modules/components/scrollbar';
import { ICONS_NAME } from 'modules/const/icons';
import { useBoolean } from 'modules/hooks/use-boolean';
import { useTranslate } from 'modules/locales';
import { fData } from 'modules/utils/format-number';
import { fDateTime } from 'modules/utils/format-time';
import { getMediaUrl } from 'modules/utils/get-media-url';

// ----------------------------------------------------------------------

type Props = DrawerProps & {
  item: IMedia;
  //
  onCopyLink: VoidFunction;
  //
  onClose: VoidFunction;
  onDelete: VoidFunction;
};

export default function FileManagerFileDetails({
  item,
  open,
  //
  // onCopyLink,
  onClose,
  onDelete,
  ...other
}: Props) {
  const { t } = useTranslate();
  const {
    title,
    size,
    hash,
    width,
    height,
    alt,
    type,
    source,
    updatedAt,
    url,
    urlTiny,
    urlSmall,
    urlMedium,
    urlLarge,
    urlRaw,
  } = item;

  const properties = useBoolean(true);
  const sizes = useBoolean(true);

  const renderProperties = (
    <Stack spacing={1.5}>
      <Stack
        sx={{
          typography: 'subtitle2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        Properties
        <IconButton size="small" onClick={properties.onToggle}>
          <Iconify
            icon={
              properties.value
                ? 'eva:arrow-ios-upward-fill'
                : 'eva:arrow-ios-downward-fill'
            }
          />
        </IconButton>
      </Stack>

      {properties.value && (
        <>
          <Stack direction="row" sx={{ typography: 'caption' }}>
            <Box
              component="span"
              sx={{ width: 80, color: 'text.secondary', mr: 2 }}
            >
              Alternative
            </Box>
            {alt}
          </Stack>
          <Stack direction="row" sx={{ typography: 'caption' }}>
            <Box
              component="span"
              sx={{ width: 80, color: 'text.secondary', mr: 2 }}
            >
              Hash
            </Box>
            {hash}
          </Stack>
          <Stack
            direction="row"
            sx={{ typography: 'caption', textTransform: 'capitalize' }}
          >
            <Box
              component="span"
              sx={{ width: 80, color: 'text.secondary', mr: 2 }}
            >
              Size
            </Box>
            {fData(size || 0)}
          </Stack>
          {width && height && (
            <Stack direction="row" sx={{ typography: 'caption' }}>
              <Box
                component="span"
                sx={{ width: 80, color: 'text.secondary', mr: 2 }}
              >
                Resolution
              </Box>
              {width} x {height}
            </Stack>
          )}

          <Stack
            direction="row"
            sx={{ typography: 'caption', textTransform: 'capitalize' }}
          >
            <Box
              component="span"
              sx={{ width: 80, color: 'text.secondary', mr: 2 }}
            >
              Modified
            </Box>
            {fDateTime(updatedAt)}
          </Stack>

          <Stack
            direction="row"
            sx={{ typography: 'caption', textTransform: 'capitalize' }}
          >
            <Box
              component="span"
              sx={{ width: 80, color: 'text.secondary', mr: 2 }}
            >
              Type
            </Box>
            {fileFormat(type?.toLowerCase())}
          </Stack>
          <Stack
            direction="row"
            sx={{ typography: 'caption', textTransform: 'capitalize' }}
          >
            <Box
              component="span"
              sx={{ width: 80, color: 'text.secondary', mr: 2 }}
            >
              Source
            </Box>
            {_.startCase(_.toLower(source))}
          </Stack>
        </>
      )}
    </Stack>
  );
  const renderSizes = (
    <Stack spacing={1.5}>
      <Stack
        sx={{
          typography: 'subtitle2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        Properties
        <IconButton size="small" onClick={sizes.onToggle}>
          <Iconify
            icon={
              sizes.value
                ? 'eva:arrow-ios-upward-fill'
                : 'eva:arrow-ios-downward-fill'
            }
          />
        </IconButton>
      </Stack>

      {sizes.value && (
        <Stack sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <Button
            href={getMediaUrl(item, 'url')}
            target="_blank"
            variant="outlined"
            size="small"
            disabled={!url}
            sx={{ textTransform: 'none' }}
          >
            Source
          </Button>
          <Button
            href={getMediaUrl(item, 'tiny')}
            target="_blank"
            variant="outlined"
            size="small"
            disabled={!urlTiny}
            sx={{ textTransform: 'none' }}
          >
            Tiny
          </Button>
          <Button
            href={getMediaUrl(item, 'sm')}
            target="_blank"
            variant="outlined"
            size="small"
            disabled={!urlSmall}
            sx={{ textTransform: 'none' }}
          >
            Small
          </Button>
          <Button
            href={getMediaUrl(item, 'md')}
            target="_blank"
            variant="outlined"
            size="small"
            disabled={!urlMedium}
            sx={{ textTransform: 'none' }}
          >
            Medium
          </Button>
          <Button
            href={getMediaUrl(item, 'lg')}
            target="_blank"
            variant="outlined"
            size="small"
            disabled={!urlLarge}
            sx={{ textTransform: 'none' }}
          >
            Large
          </Button>
          <Button
            href={getMediaUrl(item, 'original')}
            target="_blank"
            variant="outlined"
            size="small"
            disabled={!urlRaw}
            sx={{ textTransform: 'none' }}
          >
            Original
          </Button>
        </Stack>
      )}
    </Stack>
  );

  // const render

  return (
    <Drawer
      open={open}
      onClose={onClose}
      disableRestoreFocus
      anchor="right"
      slotProps={{
        backdrop: { invisible: true },
        paper: {
          sx: { width: 320 },
        },
      }}
      {...other}
      sx={{
        zIndex: 2000,
        ...other.sx,
      }}
    >
      <Scrollbar sx={{ height: 1 }}>
        <Stack
          sx={{
            p: 2.5,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h6"> {t('basic.info')} </Typography>
        </Stack>

        <Stack
          spacing={2.5}
          sx={{
            justifyContent: 'center',
            p: 2.5,
            bgcolor: 'background.neutral',
          }}
        >
          <Box
            sx={{
              borderRadius: 1,
              overflow: 'hidden',
              margin: 'auto',
            }}
          >
            <FileThumbnail
              imageView
              file={item}
              sx={{ borderRadius: 1, width: 120, height: 120 }}
              imgSx={{ borderRadius: 1 }}
            />
          </Box>

          <Typography variant="subtitle1" sx={{ wordBreak: 'break-all' }}>
            {title}
          </Typography>

          <Divider sx={{ borderStyle: 'dashed' }} />

          {renderProperties}
          {type === EMediaType.IMAGE && renderSizes}
        </Stack>
      </Scrollbar>

      <Box sx={{ p: 2.5 }}>
        <Button
          fullWidth
          variant="soft"
          color="error"
          size="large"
          startIcon={<Iconify icon={ICONS_NAME.delete} />}
          onClick={onDelete}
        >
          {t('basic.delete')}
        </Button>
      </Box>
    </Drawer>
  );
}
