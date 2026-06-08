import { yupResolver } from '@hookform/resolvers/yup';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {
  EMediaType,
  EPostStatus,
  handleErrorResponse,
  IPost,
  IPostCreate,
  paths,
} from '@seven-auto/libs';
import FormProvider, {
  RHFAutocomplete,
  RHFDateTime,
  RHFEditor,
  RHFRadioGroup,
  RHFSelectMedia,
  RHFSwitch,
  RHFTextField,
} from 'modules/components/hook-form';
import { useSnackbar } from 'modules/components/snackbar';
import { useMediaSchema } from 'modules/hooks/schemas/use-media-schema';
import { useBoolean } from 'modules/hooks/use-boolean';
import { useResponsive } from 'modules/hooks/use-responsive';
import { useTranslate } from 'modules/locales';
import { useRouter } from 'modules/routes/hooks';
import apiServices from 'modules/services/apiService';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

import PostDetailsPreview from './post-details-preview';

// ----------------------------------------------------------------------

type Props = {
  currentPost?: IPost;
};

export default function PostNewEditForm({ currentPost }: Props) {
  const router = useRouter();

  const { t } = useTranslate();

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  const preview = useBoolean();

  const { MediaSchema, getMediaValue } = useMediaSchema();

  const NewBlogSchema = Yup.object().shape({
    title: Yup.string()
      .required(t('validate.titleRequired'))
      .max(
        190,
        t('validate.maxLength', {
          length: 190,
        }),
      ),
    description: Yup.string()
      .required(t('validate.descriptionRequired'))
      .max(
        190,
        t('validate.maxLength', {
          length: 190,
        }),
      ),
    content: Yup.string(),
    // not required
    media: MediaSchema,
    tags: Yup.array(),
    metaKeywords: Yup.array(),
    metaTitle: Yup.string().max(
      190,
      t('validate.maxLength', {
        length: 190,
      }),
    ),
    status: Yup.string().oneOf(Object.values(EPostStatus)),
    metaDescription: Yup.string().max(
      190,
      t('validate.maxLength', {
        length: 190,
      }),
    ),
    metaImage: MediaSchema,
    canComment: Yup.boolean(),
    hot: Yup.boolean(),
    publishDate: Yup.date(),
  });

  const defaultValues = useMemo(
    () => ({
      title: currentPost?.title || '',
      description: currentPost?.description || '',
      content: currentPost?.content || '',
      media: getMediaValue(currentPost?.media) || null,
      tags: [],
      metaKeywords: currentPost?.seoMeta?.keywords
        ? currentPost.seoMeta.keywords.split(',')
        : [],
      metaTitle: currentPost?.seoMeta?.title || '',
      status: currentPost?.status || EPostStatus.PUBLISHED,
      metaDescription: currentPost?.seoMeta?.description || '',
      metaImage: getMediaValue(currentPost?.seoMeta?.media) || null,
      canComment: currentPost?.canComment || true,
      hot: currentPost?.hot || false,
      publishDate: new Date(currentPost?.publishDate || new Date()),
    }),
    [currentPost, getMediaValue],
  );

  const methods = useForm({
    resolver: yupResolver(NewBlogSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (currentPost) {
      reset(defaultValues);
    }
  }, [currentPost, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const dataInput: IPostCreate = {
        title: data.title,
        description: data.description,
        content: data.content,
        mediaId: data.media?.id || '',
        seoMeta: {
          title: data.metaTitle,
          description: data.metaDescription,
          keywords: data.metaKeywords?.join(','),
          mediaId: data.metaImage?.id,
        },
        canComment: data.canComment,
        status: data.status,
        hot: data.hot,
        publishDate: new Date(data.publishDate || new Date()).toISOString(),
      };
      let post: IPost;
      if (currentPost?.id) {
        post = await apiServices.post.updatePost(currentPost.id, {
          ...dataInput,
          id: currentPost.id,
        });
      } else {
        post = await apiServices.post.createPost(dataInput);
      }
      preview.onFalse();

      enqueueSnackbar(
        currentPost?.id ? t('basic.updateSuccess') : t('basic.createSuccess'),
        {
          variant: 'success',
        },
      );
      if (post.slug) {
        router.push(paths.dashboard.post.details(post.slug));
      }
    } catch (error) {
      enqueueSnackbar(t(handleErrorResponse(error)), { variant: 'error' });
    }
  });

  const isScheduled = new Date(values.publishDate || new Date()) > new Date();

  useEffect(() => {
    const nextStatus = isScheduled
      ? EPostStatus.SCHEDULED
      : EPostStatus.PUBLISHED;
    if (methods.getValues('status') !== nextStatus) {
      methods.setValue('status', nextStatus);
    }
  }, [isScheduled, methods]);

  const renderDetails = (
    <>
      {mdUp && (
        <Grid size={{ md: 4 }}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            {t('posts.details')}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {t('posts.detailsDescription')}
          </Typography>
        </Grid>
      )}

      <Grid size={{ xs: 12, md: 8 }}>
        <Card
          sx={{
            overflow: 'visible',
          }}
        >
          {!mdUp && <CardHeader title="Details" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField name="title" label={t('posts.title')} />

            <RHFTextField
              name="description"
              label={t('posts.description')}
              multiline
              rows={3}
            />

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">{t('posts.content')}</Typography>
              <RHFEditor simple name="content" />
            </Stack>

            <Stack spacing={1.5}>
              <RHFSelectMedia
                label={t('posts.image')}
                sx={{ width: 1 }}
                name="media"
                types={[EMediaType.IMAGE]}
                multiple={false}
              />
            </Stack>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderProperties = (
    <>
      {mdUp && (
        <Grid size={{ md: 4 }}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            {t('posts.properties')}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {t('posts.propertiesDescription')}
          </Typography>
        </Grid>
      )}

      <Grid size={{ xs: 12, md: 8 }}>
        <Card>
          {!mdUp && <CardHeader title="Properties" />}

          <Stack spacing={2} sx={{ p: 2 }}>
            {/* <RHFAutocomplete
              name="tags"
              label="Tags"
              placeholder="+ Tags"
              multiple
              freeSolo
              options={[[]]}
              // getOptionLabel={(option) => option}
              renderOption={(props, option) => <li {...props}>{option}</li>}
              renderTags={(selected, getTagProps) =>
                selected.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={index}
                    label={option}
                    size="small"
                    color="info"
                    variant="soft"
                  />
                ))
              }
            /> */}

            <RHFTextField name="metaTitle" label={t('posts.metaTitle')} />

            <RHFTextField
              name="metaDescription"
              label={t('posts.metaDescription')}
              fullWidth
              multiline
              rows={3}
            />

            <RHFAutocomplete
              name="metaKeywords"
              label={t('posts.metaKeywords')}
              placeholder={`+ ${t('posts.keywords')}`}
              multiple
              freeSolo
              disableCloseOnSelect
              options={[]}
              getOptionLabel={(option) => option}
              renderOption={(props, option) => (
                <li {...props} key={option}>
                  {option}
                </li>
              )}
              renderValue={(selected, getTagProps) =>
                selected.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option}
                    label={option}
                    size="small"
                    color="info"
                    variant="soft"
                  />
                ))
              }
            />

            <RHFSelectMedia
              name="metaImage"
              label={t('posts.metaImage')}
              types={[EMediaType.IMAGE]}
              multiple={false}
            />
            <RHFSwitch name="hot" label={t('posts.hot')} />
            <RHFSwitch name="canComment" label={t('posts.enableComments')} />
            <Stack spacing={1}>
              <Typography variant="subtitle2">{t('basic.status')}</Typography>
              <RHFRadioGroup
                row
                name="status"
                options={Object.values(EPostStatus)
                  .filter((value) => typeof value === 'string')
                  .map((value) => ({
                    label: value && t(`posts.status.${value}`),
                    value,
                  }))}
              />
            </Stack>

            {(values.status === EPostStatus.SCHEDULED ||
              values.status === EPostStatus.PUBLISHED) && (
              <RHFDateTime name="publishDate" label={t('posts.publishDate')} />
            )}
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderActions = (
    <>
      {mdUp && <Grid size={{ md: 4 }} />}
      <Grid
        size={{ xs: 12, md: 8 }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}
      >
        <Button
          color="inherit"
          variant="outlined"
          size="large"
          onClick={preview.onTrue}
        >
          {t('basic.preview')}
        </Button>

        <Button
          type="submit"
          variant="contained"
          size="large"
          loading={isSubmitting}
          sx={{ ml: 2 }}
        >
          {!currentPost?.id ? t('basic.create') : t('basic.save')}
        </Button>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderDetails}

        {renderProperties}

        {renderActions}
      </Grid>

      <PostDetailsPreview
        title={values.title}
        content={values.content || ''}
        description={values.description}
        media={values.media || null}
        //
        open={preview.value}
        isValid={isValid}
        isSubmitting={isSubmitting}
        onClose={preview.onFalse}
        onSubmit={onSubmit}
      />
    </FormProvider>
  );
}
