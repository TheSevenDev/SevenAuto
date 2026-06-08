'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { paymentPackages } from '@seven-auto/libs';
import { useTranslate } from 'modules/locales';

import PricingCard from './pricing-card';

// ----------------------------------------------------------------------

export default function PricingView() {
  const { t } = useTranslate();
  return (
    <Container
      sx={{
        width: '100%',
        pt: 15,
        pb: 10,
        minHeight: 1,
      }}
    >
      <Typography
        variant="h3"
        sx={{ mb: 2, whiteSpace: 'pre-line', align: 'center' }}
      >
        {t('pricing.title')}
      </Typography>

      <Typography align="center" sx={{ color: 'text.secondary' }}>
        {t('pricing.description')}
      </Typography>
      <Box sx={{ mt: 9, mb: 5, position: 'relative' }} />
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: 3,
        }}
      >
        {paymentPackages.map((card, index) => (
          <PricingCard key={card.key} card={card} index={index} />
        ))}
      </Box>
    </Container>
  );
}
