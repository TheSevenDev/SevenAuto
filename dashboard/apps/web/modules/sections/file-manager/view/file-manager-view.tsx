'use client';

import { Chip } from '@mui/material';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { handleErrorResponse } from '@seven-auto/libs';
import { ConfirmDialog } from 'modules/components/custom-dialog';
import EmptyContent from 'modules/components/empty-content';
import Iconify from 'modules/components/iconify';
import { useSettingsContext } from 'modules/components/settings';
import { useSnackbar } from 'modules/components/snackbar';
import { useTable } from 'modules/components/table';
import { useBoolean } from 'modules/hooks/use-boolean';
import { useTranslate } from 'modules/locales';
import { useMediaStore } from 'modules/store/media';
import { useCallback, useState } from 'react';

import FileManagerFilters from '../file-manager-filters';
import FileManagerGridView from '../file-manager-grid-view';
import FileManagerTable from '../file-manager-table';
import FileManagerUploadDialog from '../file-manager-upload-dialog';

// ----------------------------------------------------------------------

export default function FileManagerView() {
  const { medias, total, filters, selected, deleteMedia, deleteManyMedia } =
    useMediaStore();

  const { t } = useTranslate();
  const table = useTable({ defaultRowsPerPage: filters.take });

  const settings = useSettingsContext();

  const { enqueueSnackbar } = useSnackbar();

  const confirm = useBoolean();

  const upload = useBoolean();

  const [view, setView] = useState('grid');

  const canReset =
    !!filters.filter ||
    !!filters.types?.length ||
    !!filters.source ||
    !!filters.ext ||
    (!!filters.updatedAt_gte && !!filters.updatedAt_lte);

  const notFound = (!medias?.length && canReset) || !medias?.length;

  const handleDeleteItem = useCallback(
    async (id: string) => {
      try {
        await deleteMedia(id);
        enqueueSnackbar(t('basic.deleted'), { variant: 'success' });
      } catch (error) {
        enqueueSnackbar(t(handleErrorResponse(error)), { variant: 'error' });
      }
    },
    [deleteMedia, enqueueSnackbar, t],
  );

  const handleDeleteItems = useCallback(async () => {
    try {
      await deleteManyMedia(selected.map((item) => item.id));
      enqueueSnackbar(t('basic.deleted'), { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(t(handleErrorResponse(error)), { variant: 'error' });
    }
  }, [deleteManyMedia, enqueueSnackbar, selected, t]);

  const renderFilters = (
    <FileManagerFilters
      view={view}
      onChangeView={(newView) => {
        setView(newView);
      }}
    />
  );

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <Stack
          direction="row"
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Stack
            direction="row"
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <Typography variant="h4">File Manager</Typography>
            <Chip variant="filled" size="small" label={total} color="info" />
          </Stack>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="eva:cloud-upload-fill" />}
            onClick={upload.onTrue}
          >
            Upload
          </Button>
        </Stack>

        <Stack
          spacing={2.5}
          sx={{
            my: { xs: 1, md: 2 },
          }}
        >
          {renderFilters}
        </Stack>

        {notFound ? (
          <EmptyContent
            filled
            title={t('basic.noData')}
            sx={{
              py: 10,
            }}
          />
        ) : (
          <>
            {view === 'list' ? (
              <FileManagerTable
                table={table}
                onDeleteRow={handleDeleteItem}
                notFound={notFound}
                onOpenConfirm={confirm.onTrue}
              />
            ) : (
              <FileManagerGridView
                onDeleteItem={handleDeleteItem}
                onOpenConfirm={confirm.onTrue}
              />
            )}
          </>
        )}
      </Container>

      <FileManagerUploadDialog
        open={upload.value}
        onClose={upload.onFalse}
        title={t('basic.upload')}
      />

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={t('basic.delete')}
        content={t('common.areYouSureWantToDeleteItems', {
          length: `${selected?.length}`,
        })}
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteItems();
              confirm.onFalse();
            }}
          >
            {t('basic.delete')}
          </Button>
        }
      />
    </>
  );
}
