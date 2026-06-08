import {
  alpha,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Radio,
  RadioGroup,
  Stack,
  SxProps,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
} from '@mui/material';
import { ESocialDisplay } from '@seven-auto/libs';
import Iconify from 'modules/components/iconify';
import { useLightBox } from 'modules/components/lightbox';
import Lightbox from 'modules/components/lightbox/lightbox';
import { enqueueSnackbar } from 'modules/components/snackbar';
import { MAIN_URL } from 'modules/config-global';
import { useBoolean } from 'modules/hooks/use-boolean';
import { useCopyToClipboard } from 'modules/hooks/use-copy-to-clipboard';
import { useTranslate } from 'modules/locales';
import { ESocialPlatform } from 'modules/utils/social-image';
import React, { useCallback, useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  RedditIcon,
  RedditShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
  XIcon,
} from 'react-share';
import { CloseIcon } from 'yet-another-react-lightbox';
// ----------------------------------------------------------------------

interface IProps {
  id: string;
  type: 'feed' | 'post';
  link: string;
  title: string;
  children?: React.ReactNode;
  sx?: SxProps;
}

export default function SocialShare({
  type,
  id,
  link,
  title,
  sx,
  children,
}: IProps) {
  const { t } = useTranslate();
  const open = useBoolean();
  const [shareType, setShareType] = useState<'image' | 'link'>('image');
  const handleChangeShareType = (
    event: React.MouseEvent<HTMLElement>,
    newShareType: 'image' | 'link',
  ) => {
    setShareType(newShareType);
  };

  const onOpen = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    open.onTrue();
  };

  return (
    <>
      {children && (
        <Box onClick={onOpen}>
          {React.cloneElement(children as React.ReactElement)}
        </Box>
      )}
      {!children && (
        <IconButton onClick={onOpen} sx={{ ...sx }}>
          <Iconify icon="solar:share-bold" />
        </IconButton>
      )}
      <Dialog fullWidth maxWidth="md" open={open.value} onClose={open.onFalse}>
        <DialogTitle>{t('socialShare.label')}</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={open.onFalse}
          sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent
          sx={{
            backgroundColor: 'background.neutral',
            py: 2,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <ToggleButtonGroup
              fullWidth
              size="small"
              orientation="horizontal"
              value={shareType}
              exclusive
              onChange={handleChangeShareType}
            >
              <ToggleButton value="image" aria-label="share image">
                <Iconify icon="mdi:image" />
              </ToggleButton>
              <ToggleButton value="link" aria-label="share link">
                <Iconify icon="mdi:link" />
              </ToggleButton>
            </ToggleButtonGroup>
            <Box
              sx={{
                width: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
              }}
            >
              {shareType === 'image' ? (
                <SocialShareImage type={type} id={id} />
              ) : (
                <SocialShareLink link={link} title={title} />
              )}
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}

function SocialShareImage({ type, id }: { type: 'feed' | 'post'; id: string }) {
  const [platform, setPlatform] = useState<ESocialPlatform>(
    ESocialPlatform.DEFAULT,
  );

  const [logo, setLogo] = useState<ESocialDisplay>(ESocialDisplay.LARGE);
  const [qrCode, setQrCode] = useState<ESocialDisplay>(ESocialDisplay.LARGE);
  const [showUser, setShowUser] = useState<ESocialDisplay>(
    ESocialDisplay.LARGE,
  );
  const [showWatermark, setShowWatermark] = useState<boolean>(false);

  const theme = useTheme();
  const mainUrl = MAIN_URL;
  const src = `${mainUrl}/images/featured.png?type=${type}&id=${id}&platform=${platform}&logo=${logo}&qrcode=${qrCode}&user=${showUser}&watermark=${showWatermark}`;
  const slides = [{ src }];
  const lightbox = useLightBox(slides);
  const { t } = useTranslate();

  const handleDownload = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const a = document.createElement('a');
    a.href = src;
    a.download = `social-share-${type}-${id}-${platform}.png`;
    a.click();
  };

  return (
    <Stack
      spacing={2}
      sx={{
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: '100%',
        py: 1,
      }}
    >
      <Box
        sx={{
          width: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: 2,
          aspectRatio: '16/9',
          maxHeight: 300,
          borderRadius: 1,
          backgroundColor: alpha(theme.palette.grey[900], 0.48),
        }}
      >
        <Box
          sx={{
            width: 1,
            height: 1,
            position: 'relative',
          }}
        >
          <Box
            component={LazyLoadImage}
            onClick={() => lightbox.onOpen(src)}
            sx={{
              width: 1,
              height: 1,
              objectFit: 'contain',
              verticalAlign: 'bottom',
              top: 0,
              left: 0,
              position: 'absolute',
              '&:before': {
                content: "''",
                top: 0,
                left: 0,
                width: 1,
                height: 1,
                zIndex: 1,
                position: 'absolute',
                background: alpha(theme.palette.grey[900], 0.48),
              },
            }}
            alt="Social Share"
            loading="lazy"
            placeholderSrc="/assets/placeholder.svg"
            src={src}
          />
          <IconButton
            onClick={handleDownload}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: theme.palette.grey[500],
            }}
          >
            <Iconify icon="mdi:download" />
          </IconButton>
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
        </Box>
      </Box>
      <Stack spacing={0} sx={{ width: '100%' }}>
        <FormControl
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: {
              xs: 'column',
              sm: 'row',
            },
            justifyContent: 'flex-start',
            alignItems: {
              xs: 'flex-start',
              sm: 'center',
            },
            gap: {
              xs: 0,
              sm: 2,
            },
          }}
        >
          <FormLabel id="platform-group">{t('socialShare.platform')}</FormLabel>
          <RadioGroup
            row
            aria-labelledby="platform-group"
            name="platform-group"
            value={platform}
            onChange={(event) =>
              setPlatform(event.target.value as ESocialPlatform)
            }
          >
            {Object.values(ESocialPlatform).map((key) => (
              <FormControlLabel
                key={key}
                value={key}
                sx={{
                  textTransform: 'capitalize',
                }}
                control={<Radio />}
                label={t(`socialShare.${key}`)}
              />
            ))}
          </RadioGroup>
        </FormControl>
        <Divider sx={{ my: { xs: 1, sm: 0 } }} />
        <FormControl
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: {
              xs: 'column',
              sm: 'row',
            },
            justifyContent: 'flex-start',
            alignItems: {
              xs: 'flex-start',
              sm: 'center',
            },
            gap: {
              xs: 0,
              sm: 2,
            },
          }}
        >
          <FormLabel id="logo-group">Logo</FormLabel>
          <RadioGroup
            row
            aria-labelledby="logo-group"
            name="logo-group"
            value={logo}
            onChange={(event) => setLogo(event.target.value as ESocialDisplay)}
          >
            {Object.values(ESocialDisplay)
              .filter((key) => key !== ESocialDisplay.NONE)
              .map((key) => (
                <FormControlLabel
                  key={key}
                  value={key}
                  sx={{
                    textTransform: 'capitalize',
                  }}
                  control={<Radio />}
                  label={t(`basic.size.${key}`)}
                />
              ))}
          </RadioGroup>
        </FormControl>
        <Divider sx={{ my: { xs: 1, sm: 0 } }} />
        <FormControl
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: {
              xs: 'column',
              sm: 'row',
            },
            justifyContent: 'flex-start',
            alignItems: {
              xs: 'flex-start',
              sm: 'center',
            },
            gap: {
              xs: 0,
              sm: 2,
            },
          }}
        >
          <FormLabel id="qrcode-group">QR Code</FormLabel>
          <RadioGroup
            row
            aria-labelledby="qrcode-group"
            name="qrcode-group"
            value={qrCode}
            onChange={(event) =>
              setQrCode(event.target.value as ESocialDisplay)
            }
          >
            {Object.values(ESocialDisplay).map((key) => (
              <FormControlLabel
                key={key}
                value={key}
                sx={{
                  textTransform: 'capitalize',
                }}
                control={<Radio />}
                label={t(`basic.size.${key}`)}
              />
            ))}
          </RadioGroup>
        </FormControl>
        <Divider sx={{ my: { xs: 1, sm: 0 } }} />
        <FormControl
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: {
              xs: 'column',
              sm: 'row',
            },
            justifyContent: 'flex-start',
            alignItems: {
              xs: 'flex-start',
              sm: 'center',
            },
            gap: {
              xs: 0,
              sm: 2,
            },
          }}
        >
          <FormLabel id="user-group">User</FormLabel>
          <RadioGroup
            row
            aria-labelledby="user-group"
            name="user-group"
            value={showUser}
            onChange={(event) =>
              setShowUser(event.target.value as ESocialDisplay)
            }
          >
            {Object.values(ESocialDisplay).map((key) => (
              <FormControlLabel
                key={key}
                value={key}
                sx={{
                  textTransform: 'capitalize',
                }}
                control={<Radio />}
                label={t(`basic.size.${key}`)}
              />
            ))}
          </RadioGroup>
        </FormControl>
        <Divider sx={{ my: { xs: 1, sm: 0 } }} />
        <FormControl
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: {
              xs: 'column',
              sm: 'row',
            },
            justifyContent: 'flex-start',
            alignItems: {
              xs: 'flex-start',
              sm: 'center',
            },
            gap: {
              xs: 0,
              sm: 2,
            },
          }}
        >
          <FormLabel id="watermark-group">Watermark</FormLabel>
          <RadioGroup
            row
            aria-labelledby="watermark-group"
            name="watermark-group"
            value={showWatermark}
            onChange={(event) =>
              setShowWatermark(event.target.value === 'true')
            }
          >
            <FormControlLabel
              value
              control={<Radio />}
              label={t('basic.yes')}
            />
            <FormControlLabel
              value={false}
              control={<Radio />}
              label={t('basic.no')}
            />
          </RadioGroup>
        </FormControl>
      </Stack>
    </Stack>
  );
}

function SocialShareLink({ link, title }: { link: string; title: string }) {
  const { t } = useTranslate();
  const { copy } = useCopyToClipboard();
  const mainUrl = MAIN_URL;
  const shareUrl = `${mainUrl}${link}`;
  const handleCopy = useCallback(() => {
    enqueueSnackbar(t('basic.copied'));
    copy(shareUrl);
  }, [copy, shareUrl, t]);

  return (
    <Stack
      spacing={2}
      sx={{
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: '100%',
        py: 1,
      }}
    >
      <OutlinedInput
        id="input-link"
        type="text"
        disabled
        fullWidth
        value={shareUrl}
        endAdornment={
          <InputAdornment position="end">
            <IconButton aria-label="copy link" onClick={handleCopy} edge="end">
              <Iconify icon="mdi:content-copy" />
            </IconButton>
          </InputAdornment>
        }
        label="Link"
      />
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        <FacebookShareButton url={shareUrl} title={title}>
          <Button component="div">
            <FacebookIcon size={32} round />
            <Typography variant="body2" sx={{ ml: 1 }}>
              Facebook
            </Typography>
          </Button>
        </FacebookShareButton>
        <TwitterShareButton url={shareUrl} title={title}>
          <Button component="div">
            <XIcon size={32} round />
            <Typography variant="body2" sx={{ ml: 1 }}>
              X
            </Typography>
          </Button>
        </TwitterShareButton>
        <LinkedinShareButton url={shareUrl} title={title}>
          <Button component="div">
            <LinkedinIcon size={32} round />
            <Typography variant="body2" sx={{ ml: 1 }}>
              LinkedIn
            </Typography>
          </Button>
        </LinkedinShareButton>
        <TelegramShareButton url={shareUrl} title={title}>
          <Button component="div">
            <TelegramIcon size={32} round />
            <Typography variant="body2" sx={{ ml: 1 }}>
              Telegram
            </Typography>
          </Button>
        </TelegramShareButton>
        <WhatsappShareButton url={shareUrl} title={title}>
          <Button component="div">
            <WhatsappIcon size={32} round />
            <Typography variant="body2" sx={{ ml: 1 }}>
              WhatsApp
            </Typography>
          </Button>
        </WhatsappShareButton>
        <RedditShareButton url={shareUrl} title={title}>
          <Button component="div">
            <RedditIcon size={32} round />
            <Typography variant="body2" sx={{ ml: 1 }}>
              Reddit
            </Typography>
          </Button>
        </RedditShareButton>
      </Box>
    </Stack>
  );
}
