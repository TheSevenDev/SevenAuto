'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import {
  Alert,
  Button,
  CardContent,
  CardHeader,
  Container,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { handleErrorResponse, IEmailSendMulti, paths } from '@seven-auto/libs';
import CustomBreadcrumbs from 'modules/components/custom-breadcrumbs';
import FormProvider, {
  RHFEditor,
  RHFSwitch,
  RHFTextField,
} from 'modules/components/hook-form';
import { useSettingsContext } from 'modules/components/settings';
import { useSnackbar } from 'modules/components/snackbar';
import { useTranslate } from 'modules/locales';
import apiServices from 'modules/services/apiService';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

// ----------------------------------------------------------------------

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

function parseEmails(text: string): string[] {
  return text
    .split(/[,\n\r;]+/)
    .map((email) => email.trim())
    .filter((email) => email.length > 0);
}

export default function EmailSendView() {
  const settings = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslate();

  const [emailText, setEmailText] = useState('');
  const [invalidEmails, setInvalidEmails] = useState<string[]>([]);
  const [validEmails, setValidEmails] = useState<string[]>([]);
  const [errorEmails, setErrorEmails] = useState('');

  const FormSchema = Yup.object().shape({
    emails: Yup.array()
      .of(Yup.string().email(t('validate.emailInvalid')))
      .min(1, t('validate.emailRequired'))
      .max(300, t('emails.maxEmailsCount', { count: 300 })),
    useBcc: Yup.boolean(),
    title: Yup.string().required(t('validate.titleRequired')),
    textSend: Yup.string().required(t('validate.contentRequired')),
  });

  const defaultValues = useMemo(
    () => ({
      emails: [],
      useBcc: false,
      title: '',
      textSend: '',
    }),
    [],
  );

  const methods = useForm({
    resolver: yupResolver(FormSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (!emailText) {
      setValidEmails([]);
      setInvalidEmails([]);
      setErrorEmails('');
      return;
    }

    const emails = parseEmails(emailText);
    const valid: string[] = [];
    const invalid: string[] = [];

    emails.forEach((email) => {
      if (validateEmail(email)) {
        valid.push(email);
      } else {
        invalid.push(email);
      }
    });

    setValidEmails(valid);
    setInvalidEmails(invalid);
    // Max 100 emails
    if (valid.length > 300) {
      setErrorEmails(
        t('emails.maxEmailsCount', {
          count: 300,
        }),
      );
    }
    setValue('emails', valid);
  }, [emailText, t, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    if (validEmails.length === 0) {
      enqueueSnackbar(t('validate.emailRequired'), {
        variant: 'error',
      });
      return;
    }

    const dataInput: IEmailSendMulti = {
      listEmail: validEmails,
      title: data.title,
      textSend: data.textSend,
      useBcc: data.useBcc,
    };

    try {
      await apiServices.email.sendEmails(dataInput);
      enqueueSnackbar(t('basic.submitSuccess'), {
        variant: 'success',
      });
    } catch (error) {
      enqueueSnackbar(t(handleErrorResponse(error, 'basic.submitFailed')), {
        variant: 'error',
      });
    }
  });

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <CustomBreadcrumbs
          heading={t('emails.sendEmails')}
          links={[
            {
              name: t('dashboard'),
              href: paths.dashboard.root,
            },
            { name: t('emails.sendEmails') },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
          action={
            <Button
              type="submit"
              variant="contained"
              disabled={
                isSubmitting ||
                validEmails.length === 0 ||
                invalidEmails.length > 0 ||
                errorEmails !== ''
              }
              loading={isSubmitting}
            >
              {t('emails.send')}
            </Button>
          }
        />
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardHeader
                title={t('emails.emailList')}
                action={<RHFSwitch name="useBcc" label={t('emails.useBcc')} />}
              />
              <CardContent sx={{ p: 2 }}>
                <Stack spacing={2}>
                  <Typography variant="body2" color="text.secondary">
                    {t('emails.validEmailsCount', {
                      count: validEmails.length,
                    })}
                  </Typography>
                  {invalidEmails.length > 0 && (
                    <Alert severity="warning" sx={{ mt: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {t('emails.invalidEmailsCount', {
                          count: invalidEmails.length,
                        })}
                      </Typography>
                      <Typography
                        variant="caption"
                        component="div"
                        sx={{ mt: 0.5 }}
                      >
                        {invalidEmails.slice(0, 5).join(', ')}
                        {invalidEmails.length > 5 && '...'}
                      </Typography>
                    </Alert>
                  )}
                  {errorEmails && (
                    <Alert severity="error" sx={{ mt: 1 }}>
                      {errorEmails}
                    </Alert>
                  )}
                  <TextField
                    fullWidth
                    multiline
                    rows={20}
                    value={emailText}
                    onChange={(e) => setEmailText(e.target.value)}
                    placeholder={t('emails.emailListPlaceholder')}
                    helperText={t('emails.emailListHelper')}
                  />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Stack spacing={3}>
                  <RHFTextField name="title" label={t('form.title')} />
                  <RHFEditor simple name="textSend" />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </Container>
  );
}
