import { yupResolver } from '@hookform/resolvers/yup';
import {
  Alert,
  AlertTitle,
  Button,
  CardActions,
  CardContent,
  CardHeader,
  TextField,
  Typography,
} from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import {
  ELanguage,
  handleErrorResponse,
  IEmailTemplate,
  IEmailTemplateLang,
  IEmailTemplateUpdate,
  IUser,
} from '@seven-auto/libs';
import Editor from 'modules/components/editor';
import FormProvider, {
  RHFEditor,
  RHFTextField,
} from 'modules/components/hook-form';
import { useSnackbar } from 'modules/components/snackbar';
import { useTranslate } from 'modules/locales';
import apiServices from 'modules/services/apiService';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

// ----------------------------------------------------------------------

type Props = {
  currentData?: IEmailTemplate;
  onCallback?: (user: IUser) => void;
};

export default function EmailTemplateEditForm({
  onCallback,
  currentData,
}: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslate();

  const [langs, setLangs] = useState<
    {
      key: string;
      id?: string;
      data: Omit<
        IEmailTemplateLang,
        'id' | 'createdAt' | 'updatedAt' | 'emailTemplateId' | 'lang'
      >;
    }[]
  >([]);

  const FormSchema = Yup.object().shape({
    name: Yup.string().required(t('validate.nameRequired')),
    title: Yup.string().required(t('validate.titleRequired')),
    content: Yup.string().required(t('validate.contentRequired')),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentData?.name || '',
      title: currentData?.title || '',
      content: currentData?.content || '',
    }),
    [currentData],
  );

  const methods = useForm({
    resolver: yupResolver(FormSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    if (!currentData?.id) {
      enqueueSnackbar(t('basic.updateFailed'), {
        variant: 'error',
      });
      return;
    }
    const dataInput: IEmailTemplateUpdate = {
      id: currentData?.id,
      name: data.name,
      title: data.title,
      content: data.content,
      langs: langs.map((lang) => ({
        id: lang.id || '',
        lang: lang.key as ELanguage,
        title: lang.data.title,
        content: lang.data.content,
      })),
    };

    try {
      const res = await apiServices.emailTemplate.updateEmailTemplate({
        ...dataInput,
        id: currentData?.id,
      });
      if (onCallback) onCallback(res);
      enqueueSnackbar(t('basic.updateSuccess'), {
        variant: 'success',
      });
    } catch (error) {
      enqueueSnackbar(t(handleErrorResponse(error, 'basic.updateFailed')), {
        variant: 'error',
      });
    }
  });

  const onChangeLangTitle = (index: number, value: string) => {
    const newLangs = [...langs];
    if (newLangs[index]) {
      newLangs[index].data.title = value;
    }
    setLangs(newLangs);
  };

  const onChangeLangContent = (index: number, value: string) => {
    const newLangs = [...langs];
    if (newLangs[index]) {
      newLangs[index].data.content = value;
    }
    setLangs(newLangs);
  };

  useEffect(() => {
    if (currentData) {
      setLangs(
        Object.values(ELanguage).map((lang) => {
          const langData = currentData.langs.find((item) => item.lang === lang);
          return {
            key: lang,
            id: langData?.id || '',
            data: {
              title: langData?.title || '',
              content: langData?.content || '',
            },
          };
        }),
      );
    }
  }, [currentData]);

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardHeader
              sx={{ px: 2, pt: 1, typography: 'body2' }}
              title={t('emails.defaultTemplate')}
            />
            <CardContent sx={{ p: 2 }}>
              <Stack spacing={2}>
                <RHFTextField name="name" label={t('form.name')} />
                <RHFTextField name="title" label={t('form.title')} />
                {currentData?.variables &&
                  currentData?.variables?.length > 0 && (
                    <Alert severity="info">
                      <AlertTitle>{t('emails.variablesGuide')}</AlertTitle>
                      {currentData?.variables.map(
                        (variable, index) =>
                          `{{${variable}}}${index < (currentData?.variables.length || 0) - 1 ? ', ' : ''}`,
                      )}
                    </Alert>
                  )}
                <Stack spacing={1.5}>
                  <Typography variant="subtitle2">
                    {t('form.content')}
                  </Typography>
                  <RHFEditor simple name="content" />
                </Stack>
              </Stack>
            </CardContent>
            <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
              <Button type="submit" variant="contained" loading={isSubmitting}>
                {t('basic.update')}
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }} spacing={2}>
          {langs.map((lang, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Card>
                <CardHeader
                  sx={{ px: 2, pt: 1, typography: 'body2' }}
                  title={t('emails.langTemplate', { lang: lang.key })}
                />
                <CardContent sx={{ p: 2 }}>
                  <Stack spacing={3}>
                    <TextField
                      name={`langs[${index}].title`}
                      value={lang.data.title}
                      label={t('form.title')}
                      onChange={(e) => onChangeLangTitle(index, e.target.value)}
                    />

                    <Stack spacing={1.5}>
                      <Typography variant="subtitle2">
                        {t('form.content')}
                      </Typography>
                      <Editor
                        id={`langs[${index}].content`}
                        value={lang.data.content}
                        simple
                        onChange={(value) =>
                          onChangeLangContent(index, value as string)
                        }
                      />
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Grid>
      </Grid>
    </FormProvider>
  );
}
