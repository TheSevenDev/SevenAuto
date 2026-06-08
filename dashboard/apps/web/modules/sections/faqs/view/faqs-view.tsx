'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useHash } from 'modules/hooks/use-hash';
import { useTranslate } from 'modules/locales';

import FaqsCategory from '../faqs-category';
import FaqsHero from '../faqs-hero';
import FaqsList from '../faqs-list';

// ----------------------------------------------------------------------

export default function FaqsView() {
  const { t } = useTranslate();

  const [category, setCategory] = useHash();

  return (
    <>
      <FaqsHero />

      <Container
        sx={{
          pb: 10,
          pt: { xs: 10, md: 15 },
          position: 'relative',
        }}
      >
        <FaqsCategory category={category} setCategory={setCategory} />

        <Typography
          variant="h3"
          sx={{
            my: { xs: 3, md: 6 },
          }}
        >
          {t('faqs.title')}
        </Typography>

        <Box
          sx={{
            gap: 10,
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              md: 'repeat(2, 1fr)',
            },
          }}
        >
          <FaqsList data={[]} />
        </Box>
      </Container>
    </>
  );
}
