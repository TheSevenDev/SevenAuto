import {
  Table,
  TableBody,
  TableContainer,
  tablePaginationClasses,
} from '@mui/material';
import { IEmailTemplate, IFindMany } from '@seven-auto/libs';
import { useAuthContext } from 'modules/auth/hooks';
import Scrollbar from 'modules/components/scrollbar';
import {
  emptyRows,
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  useTable,
} from 'modules/components/table';
import { useTranslate } from 'modules/locales';
import apiServices from 'modules/services/apiService';
import React, { useCallback, useEffect, useState } from 'react';

import EmailTemplateTableFilters from './email-template-table-filters';
import EmailTemplateTableRow from './email-template-table-row';

const EmailTemplateTable = () => {
  const { t } = useTranslate();
  const { currentUser } = useAuthContext();

  const table = useTable();
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [emailTemplates, setEmailTemplates] = useState<IEmailTemplate[]>([]);

  const fetchData = useCallback(
    async (query: IFindMany) => {
      if (!currentUser?.id) return [];
      const resData = await apiServices.emailTemplate.getEmailTemplates({
        ...query,
        orderBy: { createdAt: 'asc' },
      });
      if (resData) {
        setTotal(resData.total);
        return resData.items;
      }
      return [];
    },
    [currentUser?.id],
  );

  const TABLE_HEAD = [
    { id: 'key', label: 'Key' },
    { id: 'name', label: 'Name' },
    { id: 'title', label: t('basic.title') },
    { id: '', label: '', width: 88 },
  ];

  const [filters, setFilters] = useState({
    filter: '',
    take: 10,
    skip: 0,
  });

  const {
    dense,
    order,
    orderBy,
    //
    onSort,
    onChangeDense,
  } = table;

  const denseHeight = table.dense ? 52 : 72;

  const canReset = !!filters.filter;

  const notFound =
    (!emailTemplates.length && canReset) || !emailTemplates.length;

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setFilters({ ...filters, skip: newPage * filters.take });
    setPage(newPage);
  };

  useEffect(() => {
    fetchData(filters).then((data) => {
      setEmailTemplates(data);
    });
  }, [filters, fetchData]);

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const take = parseInt(event.target.value, 10);
    setFilters({ ...filters, take, skip: 0 });
    setPage(0);
  };

  const handleFilters = (newFilters: IFindMany) => {
    setFilters({ ...filters, ...newFilters, skip: 0 });
    setPage(0);
  };

  return (
    <>
      <EmailTemplateTableFilters filters={filters} onFilters={handleFilters} />

      <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
        <Scrollbar>
          <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
            <TableHeadCustom
              order={order}
              orderBy={orderBy}
              headLabel={TABLE_HEAD}
              rowCount={emailTemplates.length}
              numSelected={table.selected.length}
              onSort={onSort}
            />

            <TableBody>
              {emailTemplates.map((row) => (
                <EmailTemplateTableRow key={row.id} row={row} />
              ))}

              <TableEmptyRows
                height={denseHeight}
                emptyRows={emptyRows(
                  table.page,
                  table.rowsPerPage,
                  emailTemplates.length,
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
    </>
  );
};

export default EmailTemplateTable;
