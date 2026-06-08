import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import { tablePaginationClasses } from '@mui/material/TablePagination';
import Tooltip from '@mui/material/Tooltip';
import _ from 'lodash';
import Iconify from 'modules/components/iconify';
import {
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableProps,
  TableSelectedAction,
} from 'modules/components/table';
import { ICONS_NAME } from 'modules/const/icons';
import { useTranslate } from 'modules/locales';
import { useMediaStore } from 'modules/store/media';

import FileManagerTableRow from './file-manager-table-row';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name' },
  { id: 'size', label: 'Size', width: 120 },
  { id: 'type', label: 'Type', width: 120 },
  { id: 'updatedAt', label: 'Modified', width: 140 },
  { id: '', label: '', width: 88 },
];

// ----------------------------------------------------------------------

type Props = {
  table: TableProps;
  notFound: boolean;
  onOpenConfirm: VoidFunction;
  onDeleteRow: (id: string) => void;
};

export default function FileManagerTable({
  table,
  notFound,
  onDeleteRow,
  onOpenConfirm,
}: Props) {
  const { t } = useTranslate();
  const theme = useTheme();
  const {
    total,
    setFilters,
    selectMedia,
    selectAllMedia,
    selected,
    filters,
    medias,
    clearSelectedMedia,
    onCallBack,
    isSelectMultiple,
  } = useMediaStore();

  const {
    dense,
    order,
    orderBy,
    //
    onSort,
    onChangeDense,
  } = table;

  const page = filters?.skip ? filters.skip / (filters?.take || 10) : 0;

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setFilters({ ...filters, skip: newPage * (filters?.take || 10) });
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFilters({ ...filters, skip: 0, take: parseInt(event.target.value, 10) });
  };

  const onSelectRow = (id: string) => {
    const media = medias.find((row) => row.id === id);
    if (!media) return;
    selectMedia(media);
  };

  return (
    <>
      <Box
        sx={{
          position: 'relative',
          m: theme.spacing(-2, -3, -3, -3),
        }}
      >
        <TableSelectedAction
          dense={dense}
          totalSelected={selected.length}
          numSelected={
            selected.filter((item) => medias.map((m) => m.id).includes(item.id))
              .length
          }
          rowCount={medias.length}
          onSelectAllRows={(checked) => selectAllMedia(checked)}
          action={
            <>
              {onCallBack && (
                <Tooltip title={_.upperFirst(t('basic.select'))}>
                  <IconButton
                    color="primary"
                    onClick={() => {
                      onCallBack(selected);
                      clearSelectedMedia();
                    }}
                  >
                    <Iconify icon="lets-icons:check-fill" />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title={_.upperFirst(t('basic.delete'))}>
                <IconButton color="primary" onClick={onOpenConfirm}>
                  <Iconify icon={ICONS_NAME.delete} />
                </IconButton>
              </Tooltip>
              <Tooltip title={_.upperFirst(t('basic.clear'))}>
                <IconButton color="primary" onClick={clearSelectedMedia}>
                  <Iconify icon={ICONS_NAME.close} />
                </IconButton>
              </Tooltip>
            </>
          }
          sx={{
            pl: 1,
            pr: 2,
            top: 16,
            left: 24,
            right: 24,
            width: 'auto',
            borderRadius: 1.5,
          }}
        />

        <TableContainer
          sx={{
            p: theme.spacing(0, 3, 3, 3),
          }}
        >
          <Table
            size={dense ? 'small' : 'medium'}
            sx={{
              minWidth: 960,
              borderCollapse: 'separate',
              borderSpacing: '0 16px',
            }}
          >
            <TableHeadCustom
              order={order}
              orderBy={orderBy}
              headLabel={TABLE_HEAD}
              rowCount={medias.length}
              numSelected={selected.length}
              onSort={onSort}
              onSelectAllRows={
                isSelectMultiple
                  ? (checked) => selectAllMedia(checked)
                  : undefined
              }
              sx={{
                [`& .${tableCellClasses.head}`]: {
                  '&:first-of-type': {
                    borderTopLeftRadius: 12,
                    borderBottomLeftRadius: 12,
                  },
                  '&:last-of-type': {
                    borderTopRightRadius: 12,
                    borderBottomRightRadius: 12,
                  },
                },
              }}
            />

            <TableBody>
              {medias.map((row) => (
                <FileManagerTableRow
                  key={row.id}
                  row={row}
                  selected={selected.map((item) => item.id).includes(row.id)}
                  onSelectRow={() => onSelectRow(row.id)}
                  onDeleteRow={() => onDeleteRow(row.id)}
                  isSelectMultiple={isSelectMultiple}
                  onCallBack={onCallBack || undefined}
                />
              ))}

              <TableNoData
                notFound={notFound}
                sx={{
                  m: -2,
                  borderRadius: 1.5,
                  border: `dashed 1px ${theme.palette.divider}`,
                }}
              />
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <TablePaginationCustom
        count={total}
        page={page}
        rowsPerPage={filters?.take || 10}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        //
        dense={dense}
        onChangeDense={onChangeDense}
        sx={{
          [`& .${tablePaginationClasses.toolbar}`]: {
            borderTopColor: 'transparent',
          },
        }}
      />
    </>
  );
}
