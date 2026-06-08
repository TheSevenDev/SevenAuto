import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import { m } from 'framer-motion';
import { MotionViewport, varFade } from 'modules/components/animate';
import Iconify from 'modules/components/iconify';
import Image from 'modules/components/image';
import TextMaxLine from 'modules/components/text-max-line';
import { useBoolean } from 'modules/hooks/use-boolean';
import { useResponsive } from 'modules/hooks/use-responsive';
import { useTranslate } from 'modules/locales';

// ----------------------------------------------------------------------

interface FaqsCategoryProps {
  category: string;
  setCategory: (category: string) => void;
}

export default function FaqsCategory({
  category,
  setCategory,
}: FaqsCategoryProps) {
  const mdUp = useResponsive('up', 'md');

  const nav = useBoolean();

  const { t } = useTranslate();

  const handleClickCategory = (key: string) => {
    setCategory(key);
    // push hash to url
  };

  const CATEGORIES = [
    {
      key: 'account',
      label: t('faqs.categories.account'),
      icon: '/assets/icons/faqs/ic_account.svg',
      onClick: () => handleClickCategory('account'),
    },
    {
      key: 'payment',
      label: t('faqs.categories.payment'),
      icon: '/assets/icons/faqs/ic_payment.svg',
      onClick: () => handleClickCategory('payment'),
    },
    {
      key: 'coach',
      label: t('faqs.categories.coach'),
      icon: '/assets/icons/faqs/ic_coach.svg',
      onClick: () => handleClickCategory('coach'),
    },
    {
      key: 'refund',
      label: t('faqs.categories.refund'),
      icon: '/assets/icons/faqs/ic_refund.svg',
      onClick: () => handleClickCategory('refund'),
    },
    {
      key: 'assurances',
      label: t('faqs.categories.assurances'),
      icon: '/assets/icons/faqs/ic_assurances.svg',
      onClick: () => handleClickCategory('assurances'),
    },
  ];

  if (!mdUp) {
    return (
      <>
        <AppBar position="absolute">
          <Toolbar>
            <Button
              startIcon={<Iconify icon="solar:list-bold" />}
              onClick={nav.onTrue}
            >
              {t('faqs.categories.title')}
            </Button>
          </Toolbar>
          <Divider />
        </AppBar>

        <Drawer open={nav.value} onClose={nav.onFalse}>
          <Box
            sx={{
              p: 1,
              mx: 'auto',
              gap: 1,
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
            }}
          >
            {CATEGORIES.map((item) => (
              <CardMobile
                key={item.label}
                category={item}
                isActive={item.key === category}
              />
            ))}
          </Box>
        </Drawer>
      </>
    );
  }

  return (
    <Box
      component={MotionViewport}
      sx={{
        gap: 3,
        display: 'grid',
        gridTemplateColumns: {
          md: 'repeat(3, 1fr)',
          lg: 'repeat(5, 1fr)',
        },
      }}
    >
      {CATEGORIES.map((item) => (
        <m.div key={item.label} variants={varFade().in}>
          <CardDesktop category={item} isActive={item.key === category} />
        </m.div>
      ))}
    </Box>
  );
}

// ----------------------------------------------------------------------

type CardDesktopProps = {
  category: {
    label: string;
    icon: string;
    onClick: () => void;
  };
  isActive: boolean;
};

function CardDesktop({ category, isActive }: CardDesktopProps) {
  const { label, icon, onClick } = category;

  return (
    <Paper
      variant="outlined"
      onClick={onClick}
      sx={{
        p: 3,
        borderRadius: 2,
        bgcolor: 'unset',
        cursor: 'pointer',
        textAlign: 'center',
        '&:hover': {
          bgcolor: 'background.paper',
          boxShadow: (theme) => theme.customShadows.z20,
        },
        ...(isActive && {
          bgcolor: 'background.paper',
          boxShadow: (theme) => theme.customShadows.z20,
        }),
      }}
    >
      <Image
        disabledEffect
        alt={icon}
        src={icon}
        sx={{ mb: 2, width: 80, height: 80, mx: 'auto' }}
      />

      <TextMaxLine variant="subtitle2" persistent>
        {label}
      </TextMaxLine>
    </Paper>
  );
}

// ----------------------------------------------------------------------

function CardMobile({ category, isActive }: CardDesktopProps) {
  const { label, icon, onClick } = category;

  return (
    <Paper
      variant="outlined"
      onClick={onClick}
      sx={{
        py: 2,
        maxWidth: 140,
        borderRadius: 1,
        textAlign: 'center',
        alignItems: 'center',
        typography: 'subtitle2',
        flexDirection: 'column',
        justifyContent: 'center',
        bgcolor: 'background.neutral',
        ...(isActive && {
          bgcolor: 'background.paper',
          boxShadow: (theme) => theme.customShadows.z20,
        }),
      }}
    >
      <Image alt={icon} src={icon} sx={{ width: 48, height: 48, mb: 1 }} />

      {label}
    </Paper>
  );
}
