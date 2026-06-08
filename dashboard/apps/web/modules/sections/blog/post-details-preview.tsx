import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { IMedia } from '@seven-auto/libs';
import { ContentView } from 'modules/components/editor';
import EmptyContent from 'modules/components/empty-content';
import Scrollbar from 'modules/components/scrollbar';
import { useTranslate } from 'modules/locales';

import PostDetailsHero from './post-details-hero';

// ----------------------------------------------------------------------

type Props = {
  title: string;
  content: string;
  description: string;
  media: IMedia | null;
  //
  open: boolean;
  isValid: boolean;
  isSubmitting: boolean;
  onClose: VoidFunction;
  onSubmit: VoidFunction;
};

export default function PostDetailsPreview({
  title,
  media,
  content,
  description,
  //
  open,
  isValid,
  onClose,
  onSubmit,
  isSubmitting,
}: Props) {
  const { t } = useTranslate();

  const hasContent = title || description || content || media?.id;

  const hasHero = title || media?.id;

  return (
    <Dialog fullScreen open={open} onClose={onClose}>
      <DialogActions sx={{ py: 2, px: 3 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {t('basic.preview')}
        </Typography>

        <Button variant="outlined" color="inherit" onClick={onClose}>
          {t('basic.cancel')}
        </Button>

        <Button
          type="submit"
          variant="contained"
          disabled={!isValid}
          loading={isSubmitting}
          onClick={onSubmit}
        >
          {t('basic.save')}
        </Button>
      </DialogActions>

      <Divider />

      {hasContent ? (
        <Scrollbar>
          {hasHero && (
            <PostDetailsHero
              post={{
                id: '',
                title,
                content,
                description,
                media: media || undefined,
                createdAt: new Date(),
                updatedAt: new Date(),
              }}
            />
          )}

          <Container sx={{ mt: 5, mb: 10 }}>
            <Stack
              sx={{
                maxWidth: 720,
                mx: 'auto',
              }}
            >
              <Typography variant="h6" sx={{ mb: 5 }}>
                {description}
              </Typography>
              <ContentView content={content} />
            </Stack>
          </Container>
        </Scrollbar>
      ) : (
        <EmptyContent filled title={t('basic.emptyContent')} />
      )}
    </Dialog>
  );
}
