import { IconButton } from '@mui/material';
import Box, { BoxProps } from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import { paths } from '@seven-auto/libs';
import CreditIcon from 'modules/atoms/credit-icon';
import { useAuthContext } from 'modules/auth/hooks';
import Iconify from 'modules/components/iconify';
import { enqueueSnackbar } from 'modules/components/snackbar';
import { MAIN_URL } from 'modules/config-global';
import { ICONS_NAME } from 'modules/const/icons';
import { useCopyToClipboard } from 'modules/hooks/use-copy-to-clipboard';
import { useTranslate } from 'modules/locales';
import { bgGradient } from 'modules/theme/css';
import { fNumber } from 'modules/utils/format-number';
import { useCallback } from 'react';

// ----------------------------------------------------------------------

interface Props extends BoxProps {
  img?: string;
  title?: string;
  price?: string;
  description?: string;
}

export default function InviteBox({
  img,
  price,
  title,
  description,
  sx,
  ...other
}: Props) {
  const theme = useTheme();
  const { t } = useTranslate();
  const { currentUser } = useAuthContext();
  const { copy } = useCopyToClipboard();
  const refLink = `${MAIN_URL}${paths.invite}?ref=${currentUser?.id}`;

  const handleCopy = useCallback(() => {
    enqueueSnackbar(t('basic.copied'));
    copy(refLink);
  }, [copy, refLink, t]);

  return (
    <Box {...other}>
      <Box
        component="img"
        alt="invite"
        src={img || '/assets/illustrations/characters/character_11.png'}
        sx={{
          left: 40,
          zIndex: 9,
          width: 140,
          position: 'relative',
          filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.24))',
          ...sx,
        }}
      />

      <Box
        sx={{
          mt: -15,
          color: 'common.white',
          borderRadius: 2,
          p: theme.spacing(16, 2, 2, 2),
          ...bgGradient({
            direction: '135deg',
            startColor: theme.palette.primary.main,
            endColor: theme.palette.primary.dark,
          }),
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{ alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Box sx={{ whiteSpace: 'pre-line', typography: 'h4' }}>
            {title || t('rewards.referrals.invite_box_title')}
          </Box>
          <Box sx={{ typography: 'h2' }}>
            {price || (
              <Stack
                sx={{
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  p: 0.5,
                  borderRadius: 1,
                  color: 'white',
                }}
              >
                {fNumber(100) || '0'}
                <CreditIcon
                  sx={{
                    ml: 1,
                    width: 50,
                    height: 50,
                  }}
                />
              </Stack>
            )}
          </Box>
        </Stack>

        <Box sx={{ mt: 2, mb: 3, typography: 'body2' }}>
          {description ||
            t('rewards.referrals.invite_box_description', {
              count: `${100} ${t(`credits.credits`)}`,
            })}
        </Box>

        <InputBase
          fullWidth
          value={refLink}
          endAdornment={
            <IconButton
              color="warning"
              size="small"
              sx={{ mr: 0.5 }}
              onClick={handleCopy}
            >
              <Iconify icon={ICONS_NAME.copy} />
            </IconButton>
          }
          sx={{
            color: theme.palette.text.secondary,
            pl: 1.5,
            height: 40,
            borderRadius: 1,
            bgcolor: 'common.white',
          }}
        />
      </Box>
    </Box>
  );
}
