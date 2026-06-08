'use client';

import { tablePaginationClasses } from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import { alpha } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import Tabs from '@mui/material/Tabs';
import Tooltip from '@mui/material/Tooltip';
import {
  EUserStatus,
  handleErrorResponse,
  hasPermission,
  IUser,
  IUserFindMany,
  paths,
  permissions,
} from '@seven-auto/libs';
import _ from 'lodash';
import { setSessionByAdmin } from 'modules/auth/context/utils';
import { useAuthContext } from 'modules/auth/hooks';
import CustomBreadcrumbs from 'modules/components/custom-breadcrumbs';
import { ConfirmDialog } from 'modules/components/custom-dialog';
import Iconify from 'modules/components/iconify';
import Label from 'modules/components/label';
import Scrollbar from 'modules/components/scrollbar';
import { useSettingsContext } from 'modules/components/settings';
import { useSnackbar } from 'modules/components/snackbar';
import {
  emptyRows,
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSelectedAction,
  useTable,
} from 'modules/components/table';
import { ICONS_NAME } from 'modules/const/icons';
import { useBoolean } from 'modules/hooks/use-boolean';
import { useTranslate } from 'modules/locales';
import { RouterLink } from 'modules/routes/components';
import { useRouter } from 'modules/routes/hooks';
import apiServices from 'modules/services/apiService';
import { useUserStore } from 'modules/store/user';
import { getUserStatusColor } from 'modules/store/user/user.utils';
import { useCallback, useEffect, useMemo } from 'react';

import UserTableFilters from '../user-table-filters';
import UserTableRow from '../user-table-row';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  ...(Object.keys(EUserStatus) as EUserStatus[]).map((status) => ({
    value: status,
    label: _.startCase(status.toLowerCase()),
  })),
];

// ----------------------------------------------------------------------

export default function UserListView() {
  const { currentUser } = useAuthContext();
  const table = useTable({
    defaultOrderBy: 'fullname',
  });
  const { t } = useTranslate();
  const { enqueueSnackbar } = useSnackbar();
  const settings = useSettingsContext();

  const TABLE_HEAD = [
    { id: 'fullname', label: t('users.name'), sx: { whiteSpace: 'nowrap' } },
    { id: 'status', label: t('users.status'), sx: { whiteSpace: 'nowrap' } },
    { id: 'level', label: t('users.level'), sx: { whiteSpace: 'nowrap' } },
    { id: 'role', label: t('users.role'), sx: { whiteSpace: 'nowrap' } },
    {
      id: 'referrer',
      label: t('users.referrer'),
      sx: { whiteSpace: 'nowrap' },
    },
    {
      id: 'createdAt',
      label: t('users.createdAt'),
      sx: { whiteSpace: 'nowrap' },
    },
    { id: '', label: '', width: 88 },
  ];

  const router = useRouter();

  const confirm = useBoolean();

  const {
    total,
    setFilters,
    selectUser,
    selectAllUser,
    selected,
    filters,
    users,
    deleteUser,
    deleteManyUser,
    clearSelectedUser,
    setUsers,
  } = useUserStore();

  const denseHeight = table.dense ? 52 : 72;

  const {
    dense,
    order,
    orderBy,
    //
    onSort,
    onChangeDense,
  } = table;

  const canReset =
    !!filters.filter ||
    !!filters.status?.length ||
    !!filters.levels?.length ||
    !!filters.referrerId ||
    !!filters.status ||
    (!!filters.startDate && !!filters.endDate);

  const notFound = (!users?.length && canReset) || !users?.length;

  const handleFilters = useCallback(
    (newFilters: IUserFindMany) => {
      setFilters(newFilters);
    },
    [setFilters],
  );

  const handleEditRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.user.edit(id));
    },
    [router],
  );

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: EUserStatus) => {
      if (newValue === 'all') {
        setFilters({ status: undefined });
        return;
      }
      setFilters({ status: [newValue] });
    },
    [setFilters],
  );

  const handleDeleteRow = useCallback(
    async (id: string) => {
      try {
        await deleteUser(id);
        enqueueSnackbar(t('basic.deleted'), { variant: 'success' });
      } catch (error) {
        enqueueSnackbar(t(handleErrorResponse(error)), {
          variant: 'error',
        });
      }
    },
    [deleteUser, enqueueSnackbar, t],
  );

  const handleLoginByAdmin = useCallback(
    async (email: string) => {
      if (!email) {
        enqueueSnackbar('Email is required', { variant: 'error' });
        return;
      }
      try {
        const res = await apiServices.auth.loginByAdmin({ email });
        if (res) {
          enqueueSnackbar('Login successfully', { variant: 'success' });
          setSessionByAdmin({
            accessToken: res.accessToken,
            refreshToken: res.refreshToken,
          });
          window.location.href = paths.dashboard.root;
        }
      } catch (error) {
        enqueueSnackbar(t(handleErrorResponse(error)), { variant: 'error' });
      }
    },
    [enqueueSnackbar, t],
  );

  const handleDeleteItems = useCallback(async () => {
    try {
      await deleteManyUser(selected.map((item) => item.id));
      enqueueSnackbar(t('basic.deleted'), { variant: 'success' });
      clearSelectedUser();
    } catch (error) {
      enqueueSnackbar(t(handleErrorResponse(error)), { variant: 'error' });
    }
  }, [deleteManyUser, selected, clearSelectedUser, enqueueSnackbar, t]);

  // Page
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

  //
  const handleUpdateSuccess = useCallback(
    (user: IUser) => {
      const index = users.findIndex((item) => item.id === user.id);
      if (index !== -1) {
        users[index] = {
          ...users[index],
          ...user,
        };
      }
      setUsers([...users]);
    },
    [setUsers, users],
  );

  const onSelectRow = (id: string) => {
    const media = users.find((row) => row.id === id);
    if (!media) return;
    selectUser(media);
  };

  useEffect(() => {
    setFilters({
      orderBy: { [orderBy]: order },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order, orderBy]);

  const isAdmin = useMemo(
    () => hasPermission(currentUser, [permissions.USER_MANAGE]),
    [currentUser],
  );

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading={t('users.list')}
          links={[
            { name: t('dashboard'), href: paths.dashboard.root },
            { name: t('user'), href: paths.dashboard.user.root },
            { name: t('users.list') },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.user.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              {t('users.newUser')}
            </Button>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Card>
          <Tabs
            value={filters.status?.[0] || 'all'}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: (theme) =>
                `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
            }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab
                key={tab.value}
                iconPosition="end"
                value={tab.value || 'all'}
                label={t(`users.statuses.${tab.value}`)}
                icon={
                  <Label
                    variant={
                      ((tab.value === 'all' ||
                        filters.status?.includes(tab.value)) &&
                        'filled') ||
                      'soft'
                    }
                    color={getUserStatusColor(tab.value)}
                  >
                    {tab.value === 'all' && total}
                    {tab.value === EUserStatus.ACTIVE && `-`}
                    {tab.value === EUserStatus.PENDING && `-`}
                    {tab.value === EUserStatus.HOLD && `-`}
                    {tab.value === EUserStatus.BAN && `-`}
                    {tab.value === EUserStatus.DELETE && `-`}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <UserTableFilters filters={filters} onFilters={handleFilters} />
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={dense}
              totalSelected={selected.length}
              numSelected={
                selected.filter((item) =>
                  users.map((m) => m.id).includes(item.id),
                ).length
              }
              rowCount={users.length}
              onSelectAllRows={(checked) => selectAllUser(checked)}
              action={
                <>
                  <Tooltip title={_.upperFirst(t('basic.select'))}>
                    <IconButton
                      color="primary"
                      onClick={() => {
                        clearSelectedUser();
                      }}
                    >
                      <Iconify icon="lets-icons:check-fill" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={_.upperFirst(t('basic.delete'))}>
                    <IconButton color="primary" onClick={confirm.onTrue}>
                      <Iconify icon={ICONS_NAME.delete} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={_.upperFirst(t('basic.clear'))}>
                    <IconButton color="primary" onClick={clearSelectedUser}>
                      <Iconify icon={ICONS_NAME.close} />
                    </IconButton>
                  </Tooltip>
                </>
              }
            />

            <Scrollbar>
              <Table
                size={table.dense ? 'small' : 'medium'}
                sx={{ minWidth: 960 }}
              >
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={users.length}
                  numSelected={table.selected.length}
                  onSort={onSort}
                  onSelectAllRows={(checked) => selectAllUser(checked)}
                />

                <TableBody>
                  {users.map((row) => (
                    <UserTableRow
                      key={row.id}
                      row={row}
                      selected={selected
                        .map((item) => item.id)
                        .includes(row.id)}
                      onSelectRow={() => onSelectRow(row.id)}
                      onDeleteRow={() => handleDeleteRow(row.id)}
                      onEditRow={() => handleEditRow(row.id)}
                      onUpdateSuccess={handleUpdateSuccess}
                      onLoginByAdmin={
                        isAdmin
                          ? () => handleLoginByAdmin(row.email || '')
                          : undefined
                      }
                    />
                  ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(
                      table.page,
                      table.rowsPerPage,
                      users.length,
                    )}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

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
        </Card>
      </Container>

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
