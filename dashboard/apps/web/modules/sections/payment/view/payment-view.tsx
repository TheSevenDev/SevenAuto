'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import {
  EPaymentType,
  paymentMethodList,
  paymentPackages,
} from '@seven-auto/libs';
import { useTranslate } from 'modules/locales';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

import PaymentMethods from '../payment-methods';
import PaymentPackages from '../payment-packages';
import PaymentSummary from '../payment-summary';

// ----------------------------------------------------------------------

export default function PaymentView() {
  const { t } = useTranslate();
  const searchParams = useSearchParams();
  const packageKey = searchParams.get('package');
  const [paymentOption, setPaymentOption] = useState<{
    package: string;
    method: EPaymentType;
  }>({
    package: packageKey || paymentPackages[0]?.key || '',
    method: paymentMethodList[0]?.key ?? EPaymentType.BANK_TRANSFER,
  });

  return (
    <Container
      sx={{
        pt: 15,
        pb: 10,
        minHeight: 1,
      }}
    >
      <Typography variant="h3" align="center" sx={{ mb: 2 }}>
        {t('payments.title')}
      </Typography>

      <Typography align="center" sx={{ color: 'text.secondary', mb: 5 }}>
        {t('payments.subtitle')}
      </Typography>

      <Grid
        container
        rowSpacing={{ xs: 5, md: 0 }}
        columnSpacing={{ xs: 0, md: 5 }}
      >
        <Grid size={{ xs: 12, md: 8 }}>
          <Box
            sx={{
              gap: 5,
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)',
              },
              p: { md: 5 },
              borderRadius: 2,
              border: (theme) => ({
                md: `dashed 1px ${theme.palette.divider}`,
              }),
            }}
          >
            <PaymentPackages
              value={paymentOption.package}
              onChange={(value) =>
                setPaymentOption((prev) => ({
                  ...prev,
                  package: value,
                }))
              }
            />
            <PaymentMethods
              method={paymentOption.method as EPaymentType}
              setMethod={(newValue: EPaymentType) =>
                setPaymentOption((prev) => ({
                  ...prev,
                  method: newValue,
                }))
              }
            />
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <PaymentSummary paymentOption={paymentOption} />
        </Grid>
      </Grid>
    </Container>
  );
}
