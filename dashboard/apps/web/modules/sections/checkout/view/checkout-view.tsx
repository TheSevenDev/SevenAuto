'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { EPaymentType, EStatusProcess, IPayment } from '@seven-auto/libs';
import { useTranslate } from 'modules/locales';
import { useState } from 'react';

import CheckoutBank from '../checkout-bank';
import CheckoutMomo from '../checkout-momo';
import CheckoutStatus from '../checkout-status';
import CheckoutSummary from '../checkout-summary';

// ----------------------------------------------------------------------

interface IProps {
  payment: IPayment;
}

export default function CheckoutView({ payment }: IProps) {
  const [currentPayment, setCurrentPayment] = useState<IPayment>(payment);

  const { t } = useTranslate();

  return (
    <Container
      sx={{
        pt: 15,
        pb: 10,
        minHeight: 1,
      }}
    >
      <Typography variant="h3" align="center" sx={{ mb: 2 }}>
        {t('checkouts.title', {
          orderId: payment.uniqueId?.toUpperCase() || '',
        })}
      </Typography>

      <Typography align="center" sx={{ color: 'text.secondary', mb: 5 }}>
        {t('checkouts.subtitle')}
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
              p: { md: 3 },
              borderRadius: 2,
              border: (theme) => ({
                md: `dashed 1px ${theme.palette.divider}`,
              }),
            }}
          >
            {currentPayment.status === EStatusProcess.PENDING && (
              <>
                {currentPayment.type === EPaymentType.BANK_TRANSFER && (
                  <CheckoutBank payment={currentPayment} />
                )}
                {currentPayment.type === EPaymentType.MOMO && (
                  <CheckoutMomo payment={currentPayment} />
                )}
              </>
            )}
            {currentPayment.status === EStatusProcess.COMPLETED && (
              <CheckoutStatus status="success" />
            )}
            {currentPayment.status === EStatusProcess.CANCELED && (
              <CheckoutStatus status="cancel" />
            )}
            {currentPayment.status === EStatusProcess.PROCESSING && (
              <CheckoutStatus status="processing" />
            )}
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <CheckoutSummary
            payment={currentPayment}
            setPayment={setCurrentPayment}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
