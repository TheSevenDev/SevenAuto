import { Link } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { CardProps } from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { paths } from '@seven-auto/libs';
import CreditFeeBadge from 'modules/atoms/credit-fee-badge';
import Label from 'modules/components/label';
import { useTranslate } from 'modules/locales';
import { fCurrency } from 'modules/utils/format-number';

// ----------------------------------------------------------------------

type Props = CardProps & {
  card: {
    key: string;
    credits: number;
    price: number;
    bonus: number;
    lists?: string[];
  };
  index: number;
};

export default function PricingCard({ card, sx, ...other }: Props) {
  const { t } = useTranslate();
  const { key, credits, price, bonus } = card;

  const renderIcon = (
    <Stack
      direction="row"
      sx={{ alignItems: 'center', justifyContent: 'space-between' }}
    >
      <Box>
        <CreditFeeBadge creditFee={{ value: credits }} size="large" />
      </Box>
      {key === 'package2' && <Label color="info">{t('pricing.popular')}</Label>}
    </Stack>
  );

  const renderSubscription = (
    <Stack spacing={1}>
      <Typography variant="h4" sx={{ textTransform: 'capitalize' }}>
        {t(`pricing.packages.${key}.title`)}
      </Typography>
      <Typography variant="subtitle2">
        {t(`pricing.packages.${key}.description`)}
      </Typography>
    </Stack>
  );

  const renderPrice = (
    <Stack direction="row">
      <Typography variant="h3">{fCurrency(price)}</Typography>
      <Typography
        component="span"
        sx={{
          alignSelf: 'center',
          color: 'text.disabled',
          ml: 1,
          typography: 'h4',
        }}
      >
        {t(`basic.currency`)}
      </Typography>
    </Stack>
  );

  // const renderList = (
  //   <Stack spacing={2}>
  //     {lists?.map((item) => (
  //       <Stack
  //         key={item}
  //         spacing={1}
  //         direction="row"
  //         alignItems="center"
  //         sx={{
  //           typography: 'body2',
  //         }}
  //       >
  //         <Iconify icon="eva:checkmark-fill" width={16} sx={{ mr: 1 }} />
  //         {item}
  //       </Stack>
  //     ))}
  //   </Stack>
  // );

  return (
    <Stack
      spacing={3}
      sx={{
        width: { xs: '100%', md: 'calc((100% - (3 * 24px)) / 4)' },
        position: 'relative',
        p: 3,
        mb: 3,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        boxShadow: (theme) => ({
          xs: theme.customShadows.card,
          md: 'none',
        }),
        ...(key === 'package2' && {
          background: (theme) =>
            `linear-gradient(145deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.background.paper, 0.6)} 100%)`,
        }),
        ...(key !== 'package2' && {
          boxShadow: (theme) => ({
            xs: theme.customShadows.card,
            md: `-40px 40px 80px 0px ${alpha(
              theme.palette.mode === 'light'
                ? theme.palette.grey[500]
                : theme.palette.common.black,
              0.16,
            )}`,
          }),
        }),
        ...sx,
      }}
      {...other}
    >
      {renderIcon}

      {renderSubscription}

      {renderPrice}

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Button
        component={Link}
        href={`${paths.payment}?package=${key}`}
        fullWidth
        size="large"
        variant="contained"
        color={key === 'package2' ? 'primary' : 'inherit'}
      >
        {t(`pricing.action`)}
      </Button>
      {bonus > 0 && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            bgcolor: 'primary.main',
            color: 'white',
            px: 1,
            borderRadius: 1,
            transform: 'translate(0%, -50%)',
          }}
        >
          <Typography variant="h6">+{fCurrency(bonus)}%</Typography>
        </Box>
      )}
    </Stack>
  );
}
