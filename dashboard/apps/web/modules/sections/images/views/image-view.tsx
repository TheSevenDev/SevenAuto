'use client';

import {
  Avatar,
  Box,
  Rating,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import {
  ESocialDisplay,
  ISocialImageData,
  IUserSocialCard,
} from '@seven-auto/libs';
import AutoFontSizeText from 'modules/components/auto-font-size-text';
import Logo from 'modules/components/logo';
import SiteName from 'modules/components/site-name';
import { useGlobalContext } from 'modules/context/global/use-global-context';
import { truncateText } from 'modules/utils/truncate';
import { QRCodeSVG } from 'qrcode.react';
import React from 'react';

interface IProps {
  data: ISocialImageData;
}

export default function ImageView({ data }: IProps) {
  const { siteInfo } = useGlobalContext();
  const {
    title,
    content,
    imageSize,
    logo,
    qrCode,
    showUser,
    showWatermark,
    background,
    link,
    user,
  } = data;

  const defaultSize =
    imageSize?.height > imageSize?.width ? imageSize?.width : imageSize?.height;

  const yHeight = defaultSize / 12;

  const paddingX = (imageSize?.width || 1024) / 50;
  const paddingY = (imageSize?.height || 1024) / 50;

  const watermarkFontSize = defaultSize / 10;
  const theme = useTheme();

  const showLogo =
    logo === ESocialDisplay.LARGE || logo === ESocialDisplay.SMALL;

  const displayUser =
    user &&
    (showUser === ESocialDisplay.LARGE || showUser === ESocialDisplay.SMALL);

  const displayQrCode =
    link &&
    (qrCode === ESocialDisplay.LARGE || qrCode === ESocialDisplay.SMALL);

  const haveBottomContent = showLogo || displayQrCode;
  const haveLargeBottomContent =
    logo === ESocialDisplay.LARGE || qrCode === ESocialDisplay.LARGE;

  const contentBottom =
    haveBottomContent &&
    (logo === ESocialDisplay.LARGE || qrCode === ESocialDisplay.LARGE)
      ? haveLargeBottomContent
        ? yHeight
        : yHeight / 2
      : 0;

  const haveTopContent = title || displayUser;
  const haveLargeTopContent =
    title || (displayUser && showUser === ESocialDisplay.LARGE);

  const contentTop =
    haveTopContent &&
    (title || (displayUser && showUser === ESocialDisplay.LARGE))
      ? haveLargeTopContent
        ? yHeight
        : yHeight / 2
      : 0;

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        id="main-image"
        sx={{
          width: imageSize?.width || 1024,
          height: imageSize?.height || 1024,
          background: background || theme.palette.primary.main,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          margin: 'auto',
          boxSizing: 'border-box',
          border: '1px solid',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          {haveTopContent && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                zIndex: 1,
                bottom: '80%',
                left: 0,
                background:
                  'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0))',
              }}
            />
          )}
          {!displayUser && title && (
            <Box
              sx={{
                position: 'absolute',
                top: paddingY,
                right: paddingX,
                left: paddingX,
                height: yHeight,
                display: 'flex',
                zIndex: 2,
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}
            >
              <AutoFontSizeText
                align="left"
                defaultSize={52}
                text={title}
                style={{
                  color: theme.palette.text.primary,
                  fontWeight: 'bold',
                }}
              />
            </Box>
          )}
          {displayUser && (
            <Box
              sx={{
                position: 'absolute',
                top: paddingY,
                right: paddingX,
                left: paddingX,
                height:
                  showUser === ESocialDisplay.LARGE ? yHeight : yHeight / 2,
                display: 'flex',
                zIndex: 2,
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}
            >
              <UserCard
                user={user}
                size={showUser === ESocialDisplay.LARGE ? yHeight : yHeight / 2}
              />
            </Box>
          )}

          {content && (
            <Box
              sx={{
                position: 'absolute',
                top: contentTop + 20,
                bottom: contentBottom + 40,
                right: paddingX,
                left: paddingX,
                zIndex: 2,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <AutoFontSizeText
                align="center"
                defaultSize={52}
                text={truncateText(content, 300)}
                style={{
                  color: theme.palette.text.primary,
                  fontWeight: 'bold',
                }}
              />
            </Box>
          )}
          {haveBottomContent && (
            <Box
              sx={{
                position: 'absolute',
                top: '80%',
                right: 0,
                bottom: 0,
                left: 0,
                zIndex: 1,
                background:
                  'linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5))',
              }}
            />
          )}
          {showLogo && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: 1,
                zIndex: 2,
                position: 'absolute',
                bottom: paddingY,
                left: paddingX,
                right: 0,
                height: logo === ESocialDisplay.LARGE ? yHeight : yHeight / 2,
              }}
            >
              <Logo
                sx={{
                  width: 'auto',
                  height: logo === ESocialDisplay.LARGE ? yHeight : yHeight / 2,
                }}
              />
              <SiteName
                sx={{
                  height: logo === ESocialDisplay.LARGE ? yHeight : yHeight / 2,
                  width: 'auto',
                }}
              />
            </Box>
          )}

          {displayQrCode && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                mb: 1,
                gap: 1,
                zIndex: 2,
                position: 'absolute',
                bottom: paddingY,
                left: 0,
                right: paddingX,
                height: qrCode === ESocialDisplay.LARGE ? yHeight * 2 : yHeight,
              }}
            >
              <QRCodeSVG
                value={link}
                size={qrCode === ESocialDisplay.LARGE ? yHeight * 2 : yHeight}
                level="L"
                fgColor={theme.palette.text.primary}
                bgColor={theme.palette.background.paper}
                imageSettings={
                  siteInfo?.siteLogo
                    ? {
                        src: siteInfo?.siteLogo,
                        height:
                          qrCode === ESocialDisplay.LARGE
                            ? yHeight / 3
                            : yHeight / 5,
                        width:
                          qrCode === ESocialDisplay.LARGE
                            ? yHeight / 3
                            : yHeight / 5,
                        excavate: true,
                      }
                    : undefined
                }
              />
            </Box>
          )}
          {showWatermark && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                left: 0,
                top: 0,
                zIndex: 3,
                color: 'text.disabled',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                transform: 'rotate(-45deg)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                opacity: 0.2,
                fontSize: watermarkFontSize,
              }}
            >
              <Box>{siteInfo.siteName}</Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

function UserCard({
  size = 48,
  user,
}: {
  size?: number;
  user: IUserSocialCard;
}) {
  return (
    <Stack direction="row" spacing={2} sx={{ pb: 1, alignItems: 'center' }}>
      <Avatar
        variant="rounded"
        src={user?.avatar}
        alt={user?.fullname}
        sx={{
          width: size,
          height: size,
          bgcolor: 'background.neutral',
        }}
      >
        {user?.fullname?.charAt(0).toUpperCase()}
      </Avatar>

      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-start' }}>
          <Typography
            variant="body1"
            noWrap
            sx={{ fontSize: size / 3, fontWeight: 'bold' }}
          >
            {user?.fullname}
          </Typography>
        </Stack>
        <Stack
          direction="row"
          sx={{ color: 'text.secondary', alignItems: 'center', mt: 0.5 }}
        >
          <Rating
            readOnly
            size="small"
            precision={0.5}
            name="reviews"
            sx={{
              '& .MuiSvgIcon-root': {
                width: size / 2.5,
                height: size / 2.5,
              },
            }}
            value={5}
          />
          <Typography
            variant="caption"
            sx={{ ml: 0.5, color: 'text.primary', fontSize: size / 4 }}
          >
            {Math.floor(Math.random() * (1000 - 100 + 1)) + 100}
          </Typography>
        </Stack>
      </Box>
    </Stack>
  );
}
