import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  tablePaginationClasses,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  EBalanceType,
  EStatusProcess,
  handleErrorResponse,
  hasPermission,
  ITransaction,
  ITransactionFindMany,
  permissions,
} from '@seven-auto/libs';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import UserDisplayName from 'modules/atoms/user-display-name';
import { useAuthContext } from 'modules/auth/hooks';
import { ConfirmDialog } from 'modules/components/custom-dialog';
import CustomPopover, { usePopover } from 'modules/components/custom-popover';
import Iconify from 'modules/components/iconify';
import Label from 'modules/components/label';
import Scrollbar from 'modules/components/scrollbar';
import { enqueueSnackbar } from 'modules/components/snackbar';
import {
  emptyRows,
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  useTable,
} from 'modules/components/table';
import { ICONS_NAME } from 'modules/const/icons';
import { queryName } from 'modules/const/query-name';
import { useBoolean } from 'modules/hooks/use-boolean';
import { useTranslate } from 'modules/locales';
import apiServices from 'modules/services/apiService';
import { displayBalance, getBalanceColor } from 'modules/utils/balance';
import { fDate } from 'modules/utils/format-time';
import { getStatusProcessColor } from 'modules/utils/general';
import { truncateWords } from 'modules/utils/truncate';
import React, { useEffect, useState } from 'react';

import TransactionsForm from './transaction-form';
import TransactionTableFilters from './transaction-table-filters';

const PER_PAGE = 10;

interface IProps {
  userId?: string;
  title?: string;
}

export default function TransactionList({ userId, title }: IProps) {
  const queryClient = useQueryClient();
  const { currentUser } = useAuthContext();

  const { t } = useTranslate();
  const table = useTable({
    defaultOrder: 'desc',
    defaultOrderBy: 'createdAt',
  });
  const createRow = useBoolean();
  const [editRow, setEditRow] = useState<ITransaction | null>(null);

  const [filters, setFilters] = useState<ITransactionFindMany>({
    filter: '',
    status: undefined,
    type: undefined,
    userId: userId || undefined,
    take: PER_PAGE,
    skip: 0,
    orderBy: {
      createdAt: 'desc',
    },
  });

  const isAdmin = hasPermission(currentUser, [permissions.TRANSACTION_UPDATE]);

  const { data: { items: transactions, total } = {} } = useQuery({
    queryKey: [queryName.GET_TRANSACTIONS, filters],
    queryFn: () => apiServices.transaction.getTransactions(filters),
  });

  const onUpdateSuccess = () => {
    reloadData();
    setEditRow(null);
  };

  const reloadData = () => {
    queryClient.refetchQueries({
      queryKey: [queryName.GET_TRANSACTIONS, filters],
    });
    queryClient.refetchQueries({
      queryKey: [queryName.GET_TRANSACTION, editRow?.id],
    });
  };

  const TABLE_HEAD = [
    ...(userId ? [] : [{ id: 'user', label: t('basic.user') }]),
    { id: 'type', label: t('basic.type') },
    { id: 'amount', label: t('basic.amount') },
    { id: 'newBalance', label: t('transactions.newBalance') },
    { id: 'status', label: t('basic.status') },
    { id: 'variant', label: t('balance.type') },
    { id: 'refId', label: t('basic.description') },
    { id: 'createdAt', label: t('basic.createdAt') },
    ...(isAdmin ? [{ id: '', label: '', width: 88 }] : []),
  ];

  const {
    dense,
    order,
    orderBy,
    //
    onSort,
    onChangeDense,
  } = table;

  const canReset = !!filters.filter;

  const notFound = (!transactions?.length && canReset) || !transactions?.length;

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const take = parseInt(event.target.value, 10);
    setFilters({ ...filters, take, skip: 0 });
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setFilters({ ...filters, skip: newPage * (filters.take || PER_PAGE) });
  };

  const page = filters?.skip ? filters.skip / (filters?.take || 10) : 0;

  useEffect(() => {
    setFilters({
      orderBy: {
        [orderBy]: order,
      },
    });
  }, [order, orderBy]);

  return (
    <>
      <Card>
        {(title || isAdmin) && (
          <CardHeader
            title={title}
            action={
              isAdmin ? (
                <Button variant="contained" onClick={createRow.onTrue}>
                  {t('transactions.create')}
                </Button>
              ) : null
            }
          />
        )}
        <CardContent>
          <TransactionTableFilters
            userId={userId}
            filters={filters}
            onFilters={setFilters}
          />
          <TableContainer
            sx={{ mt: 2, position: 'relative', overflow: 'unset' }}
          >
            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={transactions?.length || 0}
                  numSelected={table.selected.length}
                  onSort={onSort}
                />
                <TableBody>
                  {transactions?.map((row) => (
                    <TableRowItem
                      key={row.id}
                      row={row}
                      onDetail={(_row) => {
                        setEditRow(_row);
                        createRow.onTrue();
                      }}
                      userId={userId}
                      reloadData={reloadData}
                    />
                  ))}
                  <TableEmptyRows
                    height={52}
                    emptyRows={emptyRows(
                      table.page,
                      table.rowsPerPage,
                      transactions?.length || 0,
                    )}
                  />
                  <TableNoData notFound={notFound} sx={{ py: 2 }} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>
          <TablePaginationCustom
            count={total || 0}
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
        </CardContent>
      </Card>
      <TransactionsForm
        currentData={editRow || undefined}
        open={createRow.value}
        onClose={() => {
          createRow.onFalse();
          setEditRow(null);
          reloadData();
        }}
        onCallback={onUpdateSuccess}
      />
    </>
  );
}

type ITableRowProps = {
  userId?: string;
  row: ITransaction;
  onDetail?: (row: ITransaction) => void;
  reloadData?: () => void;
};

function TableRowItem({ userId, row, onDetail, reloadData }: ITableRowProps) {
  const { currentUser } = useAuthContext();
  const { id, type, amount, balanceType, status, user, createdAt } = row;
  const { t } = useTranslate();
  const popover = usePopover();
  const confirmApprove = useBoolean();
  const confirmReject = useBoolean();
  const [isApproving, setApproving] = useState(false);
  const [isRejecting, setRejecting] = useState(false);

  const canEdit =
    row.status === EStatusProcess.PENDING ||
    row.status === EStatusProcess.PROCESSING;
  const isAdmin = hasPermission(currentUser, [permissions.TRANSACTION_UPDATE]);

  const handleApprove = async () => {
    try {
      setApproving(true);
      const res = await apiServices.transaction.approveTransaction(id);
      if (res) {
        enqueueSnackbar(t('payments.approveSuccess'), {
          variant: 'success',
        });
      } else {
        enqueueSnackbar(t('payments.approveFailed'), {
          variant: 'error',
        });
      }
    } catch (error) {
      enqueueSnackbar(t(handleErrorResponse(error, 'payments.approveFailed')), {
        variant: 'error',
      });
    } finally {
      setApproving(false);
      confirmApprove.onFalse();
      reloadData?.();
    }
  };

  const handleReject = async () => {
    try {
      setRejecting(true);
      const res = await apiServices.transaction.rejectTransaction(id);
      if (res) {
        enqueueSnackbar(t('payments.rejectSuccess'), {
          variant: 'success',
        });
      } else {
        enqueueSnackbar(t('payments.rejectFailed'), {
          variant: 'error',
        });
      }
    } catch (error) {
      enqueueSnackbar(t(handleErrorResponse(error, 'payments.rejectFailed')), {
        variant: 'error',
      });
    } finally {
      setRejecting(false);
      confirmReject.onFalse();
      reloadData?.();
    }
  };

  // TODO: generate description
  const description = '';

  return (
    <>
      <TableRow hover>
        {!userId && (
          <TableCell>
            <UserDisplayName user={user} />
          </TableCell>
        )}
        <TableCell>
          <Typography variant="body2">
            {t(`transactions.types.${type}`)}
          </Typography>
        </TableCell>
        <TableCell>
          <Tooltip title={amount} placement="top">
            <Typography variant="body2" sx={{ color: 'success.main' }}>
              {displayBalance(amount || 0, balanceType)}
            </Typography>
          </Tooltip>
        </TableCell>
        <TableCell>
          <Typography variant="body2" sx={{ color: 'primary.main' }}>
            {displayBalance(row.newBalance || 0, balanceType)}
          </Typography>
        </TableCell>
        <TableCell>
          <Label color={getStatusProcessColor(status)}>
            {t(`statusProcess.${status}`)}
          </Label>
        </TableCell>
        <TableCell>
          <Label color={getBalanceColor(balanceType as EBalanceType)}>
            {t(`balance.types.${balanceType}`)}
          </Label>
        </TableCell>
        <TableCell>
          <Tooltip title={description} placement="top">
            <span>{truncateWords(description || '', 8)}</span>
          </Tooltip>
        </TableCell>
        <TableCell>
          <Typography
            variant="body2"
            sx={{
              whiteSpace: 'nowrap',
              color: 'text.secondary',
            }}
          >
            {fDate(createdAt)}
          </Typography>
        </TableCell>
        {isAdmin && (
          <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
            <Stack
              direction="row"
              spacing={1}
              sx={{
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}
            >
              {(status === EStatusProcess.PENDING ||
                status === EStatusProcess.PROCESSING) && (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {isAdmin && (
                    <>
                      <Button
                        onClick={() => {
                          confirmApprove.onTrue();
                        }}
                        variant="contained"
                        color="success"
                        size="small"
                      >
                        {t(`payments.approve`)}
                      </Button>
                      <ConfirmDialog
                        open={confirmApprove.value}
                        onClose={() => {
                          confirmApprove.onFalse();
                        }}
                        title={t('payments.approveConfirm')}
                        content={t('payments.approveConfirmMessage')}
                        action={
                          <Button
                            variant="contained"
                            loading={isApproving}
                            color="success"
                            onClick={() => {
                              handleApprove();
                            }}
                          >
                            {t('payments.approve')}
                          </Button>
                        }
                      />
                      <Button
                        onClick={() => {
                          confirmReject.onTrue();
                        }}
                        variant="contained"
                        color="error"
                        size="small"
                      >
                        {t(`payments.reject`)}
                      </Button>
                      <ConfirmDialog
                        open={confirmReject.value}
                        onClose={() => {
                          confirmReject.onFalse();
                        }}
                        title={t('payments.rejectConfirm')}
                        content={t('payments.rejectConfirmMessage')}
                        action={
                          <Button
                            variant="contained"
                            loading={isRejecting}
                            color="error"
                            onClick={() => {
                              handleReject();
                            }}
                          >
                            {t('payments.reject')}
                          </Button>
                        }
                      />
                    </>
                  )}
                </Box>
              )}
              {canEdit && (
                <IconButton
                  color={popover.open ? 'inherit' : 'default'}
                  onClick={popover.onOpen}
                >
                  <Iconify icon={ICONS_NAME.more} />
                </IconButton>
              )}
            </Stack>
          </TableCell>
        )}
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        {canEdit && (
          <MenuItem
            onClick={() => {
              popover.onClose();
              onDetail?.(row);
            }}
          >
            <Iconify icon={ICONS_NAME.edit} />
            {t('basic.edit')}
          </MenuItem>
        )}
      </CustomPopover>
    </>
  );
}
