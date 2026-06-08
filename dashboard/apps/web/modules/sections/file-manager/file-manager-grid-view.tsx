import { Pagination } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Iconify from 'modules/components/iconify';
import { ICONS_NAME } from 'modules/const/icons';
import { useTranslate } from 'modules/locales';
import { useMediaStore } from 'modules/store/media';
import { useRef } from 'react';

import FileManagerActionSelected from './file-manager-action-selected';
import FileManagerFileItem from './file-manager-file-item';

// ----------------------------------------------------------------------

type Props = {
  onOpenConfirm: VoidFunction;
  onDeleteItem: (id: string) => void;
};

export default function FileManagerGridView({
  onDeleteItem,
  onOpenConfirm,
}: Props) {
  const {
    filters,
    selectMedia,
    selectAllMedia,
    selected,
    medias,
    total,
    clearSelectedMedia,
    setFilters,
    onCallBack,
    isSelectMultiple,
  } = useMediaStore();

  const { t } = useTranslate();

  const page = filters?.skip ? filters.skip / (filters?.take || 10) : 0;
  const totalPage = Math.floor(total / (filters?.take || 10));

  const containerRef = useRef(null);

  const handleChangePage = (
    event: React.ChangeEvent<unknown> | null,
    newPage: number,
  ) => {
    setFilters({ ...filters, skip: (newPage - 1) * (filters?.take || 10) });
  };

  return (
    <Box ref={containerRef}>
      <Box
        sx={{
          gap: 3,
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)',
          },
        }}
      >
        {medias.map((item) => (
          <FileManagerFileItem
            key={item.id}
            file={item}
            selected={selected?.map((m) => m?.id).includes(item.id)}
            onSelect={() => selectMedia(item)}
            onDelete={() => onDeleteItem(item.id)}
            sx={{ maxWidth: 'auto' }}
            isSelectMultiple={isSelectMultiple}
            onCallBack={onCallBack || undefined}
          />
        ))}
      </Box>
      {totalPage > 0 && (
        <Box
          sx={{
            mt: 3,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Pagination
            shape="rounded"
            page={page + 1}
            count={totalPage}
            onChange={handleChangePage}
            variant="text"
          />
        </Box>
      )}

      {!!selected?.length && isSelectMultiple && (
        <FileManagerActionSelected
          numSelected={
            selected.filter((item) =>
              medias.map((m) => m.id).includes(item?.id),
            ).length
          }
          rowCount={medias.length}
          selected={selected}
          onSelectAllItems={(checked: boolean) => selectAllMedia(checked)}
          action={
            <>
              {onCallBack && (
                <Button
                  size="small"
                  color="primary"
                  variant="contained"
                  startIcon={<Iconify icon="lets-icons:check-fill" />}
                  onClick={() => {
                    onCallBack(selected);
                    clearSelectedMedia();
                  }}
                  sx={{ mr: 1, textTransform: 'capitalize' }}
                >
                  {t('basic.select')}
                </Button>
              )}

              <Button
                size="small"
                color="error"
                variant="contained"
                startIcon={<Iconify icon={ICONS_NAME.delete} />}
                onClick={onOpenConfirm}
                sx={{ mr: 1, textTransform: 'capitalize' }}
              >
                {t('basic.delete')}
              </Button>

              <Button
                color="primary"
                size="small"
                variant="contained"
                startIcon={<Iconify icon="material-symbols:close" />}
                onClick={clearSelectedMedia}
                sx={{ textTransform: 'capitalize' }}
              >
                {t('basic.clear')}
              </Button>
            </>
          }
        />
      )}
    </Box>
  );
}
