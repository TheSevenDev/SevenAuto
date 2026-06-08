import {
  alpha,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  ListItemText,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  tablePaginationClasses,
  TableRow,
  Tabs,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  EStatusProcess,
  handleErrorResponse,
  hasPermission,
  IPayment,
  IPaymentFindMany,
  IPaymentSummary,
  paths,
  permissions,
} from '@seven-auto/libs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import CreditIcon from 'modules/atoms/credit-icon';
import UserDisplayName from 'modules/atoms/user-display-name';
import { useAuthContext } from 'modules/auth/hooks';
import ConfirmDialog from 'modules/components/custom-dialog/confirm-dialog';
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
import { useTab } from 'modules/hooks/use-tab';
import { useTranslate } from 'modules/locales';
import apiServices from 'modules/services/apiService';
import { fCurrency, fNumber } from 'modules/utils/format-number';
import { fDate } from 'modules/utils/format-time';
import { getStatusProcessColor } from 'modules/utils/general';
import { getMediaUrl } from 'modules/utils/get-media-url';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import PaymentTableFilters from './dashboard-payment-table-filters';

const PER_PAGE = 10;

interface IProps {
  userId?: string;
}

export default function DashboardPaymentTable({ userId }: IProps) {
  const { currentUser } = useAuthContext();

  const [currentTab, setCurrentTab] = useTab('status', 'all');

  const router = useRouter();
  const { t } = useTranslate();
  const table = useTable({
    defaultOrder: 'desc',
    defaultOrderBy: 'createdAt',
  });

  const canEdit = hasPermission(currentUser, [permissions.PAYMENT_UPDATE]);

  const [filters, setFilters] = useState<IPaymentFindMany>({
    filter: '',
    status: EStatusProcess.PENDING,
    userId: userId || undefined,
    take: PER_PAGE,
    skip: 0,
  });

  const { data: summary } = useQuery({
    queryKey: [queryName.GET_PAYMENT_SUMMARY, filters],
    queryFn: () => apiServices.payment.getSummary(filters),
  });

  const { data: { items: payments, total } = {} } = useQuery({
    queryKey: [queryName.GET_PAYMENTS, filters],
    queryFn: () => apiServices.payment.getPayments(filters),
  });

  const TABLE_HEAD = [
    ...(canEdit ? [{ id: '', label: '', width: 88 }] : []),
    {
      id: 'uniqueId',
      label: t('payments.orderId'),
      sx: { whiteSpace: 'nowrap' },
    },
    { id: 'type', label: t('basic.type') },
    { id: 'amount', label: t('basic.amount'), sx: { whiteSpace: 'nowrap' } },
    { id: 'price', label: t('basic.price') },
    { id: 'status', label: t('basic.status') },
    {
      id: 'bankCode',
      label: t('payments.bankCode'),
      sx: { whiteSpace: 'nowrap' },
    },
    ...(userId ? [] : [{ id: 'user', label: t('basic.user') }]),
    { id: 'createdAt', label: t('basic.createdAt') },
    { id: 'doneAt', label: t('basic.doneAt') },
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

  const notFound = (!payments?.length && canReset) || !payments?.length;

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

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      skip: 0,
      status: currentTab === 'all' ? undefined : (currentTab as EStatusProcess),
    }));
  }, [currentTab]);

  const page = filters?.skip ? filters.skip / (filters?.take || 10) : 0;

  useEffect(() => {
    setFilters({
      orderBy: { [orderBy]: order },
    });
  }, [order, orderBy]);

  return (
    <Card>
      <CardHeader
        title={t('payments.label')}
        action={
          canEdit && (
            <Button
              variant="contained"
              onClick={() => {
                router.push(paths.dashboard.payment.new);
              }}
            >
              {t('payments.createPayment')}
            </Button>
          )
        }
      />
      <CardContent>
        <Tabs
          value={currentTab}
          onChange={(e, newValue) => {
            setCurrentTab(newValue);
          }}
          sx={{
            px: 1,
            boxShadow: (theme) =>
              `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
          }}
        >
          <Tab
            value="all"
            iconPosition="end"
            sx={{ mr: '16px !important' }}
            label={t('basic.all')}
            icon={
              <Label variant="filled" color="primary">
                {total}
              </Label>
            }
          />
          {Object.values(EStatusProcess).map((status) => (
            <Tab
              key={status}
              iconPosition="end"
              value={status}
              sx={{ mr: '16px !important' }}
              label={t(`statusProcess.${status}`)}
              icon={
                <Label
                  variant={filters.status === status ? 'filled' : 'soft'}
                  color={getStatusProcessColor(status)}
                >
                  {summary?.[status.toLowerCase() as keyof IPaymentSummary]}
                </Label>
              }
            />
          ))}
        </Tabs>
        <Box sx={{ mt: 2 }}>
          <PaymentTableFilters
            filters={filters}
            onFilters={setFilters}
            userId={userId}
          />
        </Box>
        <TableContainer sx={{ mt: 2, position: 'relative', overflow: 'unset' }}>
          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'}>
              <TableHeadCustom
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={payments?.length || 0}
                numSelected={table.selected.length}
                onSort={onSort}
              />

              <TableBody>
                {payments?.map((row) => (
                  <TableRowItem
                    key={row.id}
                    row={row}
                    onDetail={(_row) => {
                      router.push(paths.dashboard.payment.details(_row.id));
                    }}
                    userId={userId}
                    canEdit={canEdit}
                  />
                ))}
                <TableEmptyRows
                  height={52}
                  emptyRows={emptyRows(
                    table.page,
                    table.rowsPerPage,
                    payments?.length || 0,
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
  );
}

type ITableRowProps = {
  userId?: string;
  row: IPayment;
  onDetail?: (row: IPayment) => void;
  canEdit?: boolean;
};

function TableRowItem({ userId, row, onDetail, canEdit }: ITableRowProps) {
  const { uniqueId, type, bankCode, amount, price, user, status, createdAt } =
    row;
  const { t } = useTranslate();
  const confirmCancel = useBoolean();
  const queryClient = useQueryClient();

  const mutationCancel = useMutation({
    mutationFn: () => apiServices.payment.cancelPayment(row.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryName.GET_PAYMENTS] });
      queryClient.invalidateQueries({
        queryKey: [queryName.GET_PAYMENT_SUMMARY],
      });
      queryClient.refetchQueries({ queryKey: [queryName.GET_PAYMENT, row.id] });
      enqueueSnackbar(t('basic.cancelSuccess'), {
        variant: 'success',
      });
    },
    onError: (error) => {
      enqueueSnackbar(t(handleErrorResponse(error, 'basic.cancelFailed')), {
        variant: 'error',
      });
    },
  });

  return (
    <>
      <TableRow hover>
        {canEdit && (
          <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onDetail?.(row);
              }}
            >
              <Iconify icon={ICONS_NAME.edit} />
            </IconButton>
          </TableCell>
        )}
        <TableCell>
          <Typography
            variant="body2"
            sx={{ color: 'primary.main', fontWeight: 'bold' }}
          >
            {uniqueId?.toUpperCase()}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography
            variant="body2"
            sx={{
              whiteSpace: 'nowrap',
              color: 'text.secondary',
            }}
          >
            {t(`payments.methods.${type}`)}
          </Typography>
        </TableCell>

        <TableCell>
          <Stack
            spacing={1}
            sx={{ flexDirection: 'row', alignItems: 'center' }}
          >
            <CreditIcon />
            {fNumber(amount || 0)}
          </Stack>
        </TableCell>
        <TableCell>{fCurrency(price || 0)}đ</TableCell>
        <TableCell>
          <Label color={getStatusProcessColor(status)}>
            {t(`statusProcess.${status}`)}
          </Label>
        </TableCell>
        <TableCell>{bankCode}</TableCell>
        {!userId && (
          <TableCell>
            <Stack
              spacing={1}
              sx={{ flexDirection: 'row', alignItems: 'center' }}
            >
              <Avatar
                src={getMediaUrl(user?.avatar)}
                alt={user?.fullname}
                sx={{ width: 32, height: 32 }}
              />
              <ListItemText
                primary={<UserDisplayName user={user} />}
                secondary={user?.email}
              />
            </Stack>
          </TableCell>
        )}
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
        <TableCell>
          <Stack
            spacing={1}
            sx={{ flexDirection: 'row', alignItems: 'center' }}
          >
            {status === EStatusProcess.COMPLETED ? (
              <Typography
                variant="body2"
                sx={{
                  whiteSpace: 'nowrap',
                  color: 'text.secondary',
                }}
              >
                {fDate(row.doneAt)}
              </Typography>
            ) : (
              <Tooltip title={t('basic.viewDetails')} arrow>
                <Link
                  href={paths.checkout(row.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Iconify
                    sx={{ cursor: 'pointer', color: 'primary.main' }}
                    icon={ICONS_NAME.linkExternal}
                  />
                </Link>
              </Tooltip>
            )}
            {status === EStatusProcess.PENDING && (
              <Button
                variant="contained"
                color="warning"
                onClick={() => {
                  confirmCancel.onTrue();
                }}
                size="small"
              >
                {t('basic.cancel')}
              </Button>
            )}
          </Stack>
        </TableCell>
      </TableRow>
      <ConfirmDialog
        open={confirmCancel.value}
        onClose={confirmCancel.onFalse}
        title={t('basic.cancel')}
        content={t('common.areYouSureWantToCancel')}
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              mutationCancel.mutate();
              confirmCancel.onFalse();
            }}
          >
            {t('basic.confirm')}
          </Button>
        }
      />
    </>
  );
}
