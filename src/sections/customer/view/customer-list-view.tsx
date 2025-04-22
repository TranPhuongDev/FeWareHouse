'use client';

import type { TableHeadCellProps } from 'src/components/table';
// import type { IUserItem, IUserTableFilters } from 'src/types/user';
import type { IUserTableFilters } from 'src/types/user';

import { useState, useCallback } from 'react';
import { varAlpha } from 'minimal-shared/utils';
import { useBoolean, useSetState } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/dashboard';
// import { _roles, _userList, USER_STATUS_OPTIONS } from 'src/_mock';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  rowInPage,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';
import { label } from 'yet-another-react-lightbox';
import { add } from '@dnd-kit/utilities';
import { CustomerTableToolbar } from '../customer-table-toolbar';
import { CustomerTableFiltersResult } from '../customer-table-filter-result';
import { CustomerTableRow } from '../customer-table-row';

// import { UserTableToolbar } from '../user-table-toolbar';

// ----------------------------------------------------------------------

// const STATUS_OPTIONS = [{ value: 'all', label: 'All' }, ...USER_STATUS_OPTIONS];

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'silver', label: 'Silver' },
  { value: 'gold', label: 'Gold' },
  { value: 'platinum', label: 'Platinum' },
  { value: 'diamond', label: 'Diamond' },
];

const TABLE_HEAD: TableHeadCellProps[] = [
  { id: 'name', label: 'Name' },
  { id: 'address', label: 'Address', width: 360 },
  { id: 'phone', label: 'Phone', width: 220 },
  { id: 'status', label: 'Status', width: 100 },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

interface ICustomerItem {
  id: string;
  customerName: string;
  address: string;
  phone: string;
  status: string; // Ví dụ về các trạng thái
}

const _customerList: ICustomerItem[] = [
  {
    id: '1',
    customerName: 'Nguyễn Văn A',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    phone: '0901234567',
    status: 'silver',
  },
  {
    id: '2',
    customerName: 'Trần Thị B',
    address: '456 Đường XYZ, Quận 3, TP.HCM',
    phone: '0987654321',
    status: 'gold',
  },
  {
    id: '3',
    customerName: 'Lê Văn C',
    address: '789 Đường UVW, Quận 5, TP.HCM',
    phone: '0911223344',
    status: 'gold',
  },
  {
    id: '4',
    customerName: 'Phạm Thị D',
    address: '101 Đường RST, Quận 7, TP.HCM',
    phone: '0933445566',
    status: 'platinum',
  },
  {
    id: '5',
    customerName: 'Phạm Thị F',
    address: '101 Đường RST, Quận 7, TP.HCM',
    phone: '0933445566',
    status: 'diamond',
  },
  // Thêm các đối tượng IUserItem khác nếu cần
];

interface ICustomerTableFilters {
  customerName: string;
  address: string;
  phone: string;
  status: string;
}

export function CustomerListView() {
  const table = useTable();

  const confirmDialog = useBoolean();

  const [tableData, setTableData] = useState<ICustomerItem[]>(_customerList);

  const filters = useSetState<ICustomerTableFilters>({
    customerName: '',
    address: '',
    phone: '',
    status: 'all',
  });
  const { state: currentFilters, setState: updateFilters } = filters;

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: currentFilters,
  });

  // const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset = !!currentFilters.customerName || currentFilters.status !== 'all';

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  // const handleDeleteRow = useCallback(
  //   (id: string) => {
  //     const deleteRow = tableData.filter((row) => row.id !== id);

  //     toast.success('Delete success!');

  //     setTableData(deleteRow);

  //     table.onUpdatePageDeleteRow(dataInPage.length);
  //   },
  //   [dataInPage.length, table, tableData]
  // );

  // const handleDeleteRows = useCallback(() => {
  //   const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));

  //   toast.success('Delete success!');

  //   setTableData(deleteRows);

  //   table.onUpdatePageDeleteRows(dataInPage.length, dataFiltered.length);
  // }, [dataFiltered.length, dataInPage.length, table, tableData]);

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      table.onResetPage();
      updateFilters({ status: newValue });
    },
    [updateFilters, table]
  );

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Delete"
      content={
        <>
          Are you sure want to delete <strong> {table.selected.length} </strong> items?
        </>
      }
      action={
        <Button
          variant="contained"
          color="error"
          // onClick={() => {
          //   handleDeleteRows();
          //   confirmDialog.onFalse();
          // }}
        >
          Delete
        </Button>
      }
    />
  );

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="List Customer"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Customer', href: '' },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              href=""
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New user
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <Tabs
            value={currentFilters.status}
            onChange={handleFilterStatus}
            sx={[
              (theme) => ({
                px: 2.5,
                boxShadow: `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
              }),
            ]}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab
                key={tab.value}
                iconPosition="end"
                value={tab.value}
                label={tab.label}
                icon={
                  <Label
                    variant={
                      ((tab.value === 'all' || tab.value === currentFilters.status) && 'filled') ||
                      'soft'
                    }
                    color={
                      (tab.value === 'silver' && 'success') ||
                      (tab.value === 'gold' && 'warning') ||
                      (tab.value === 'platinum' && 'error') ||
                      'default'
                    }
                  >
                    {['silver', 'gold', 'platinum', 'diamond'].includes(tab.value)
                      ? tableData.filter((cus) => cus.status === tab.value).length
                      : tableData.length}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <CustomerTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
            // options="{{ roles: _roles }}"
          />

          {canReset && (
            <CustomerTableFiltersResult
              filters={filters}
              totalResults={dataFiltered.length}
              onResetPage={table.onResetPage}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <Box sx={{ position: 'relative' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row.id)
                )
              }
              // onSelectAllRows={() => console.log('HI')}
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirmDialog.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headCells={TABLE_HEAD}
                  rowCount={dataFiltered.length}
                  numSelected={table.selected.length}
                  // onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      dataFiltered.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <CustomerTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onDeleteRow={() => console.log(row.id)}
                        editHref={'paths.dashboard.user.edit(row.id)'}
                      />
                    ))}

                  <TableEmptyRows
                    height={table.dense ? 56 : 56 + 20}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </Box>

          <TablePaginationCustom
            page={table.page}
            dense={table.dense}
            count={dataFiltered.length}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onChangeDense={table.onChangeDense}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </Card>
      </DashboardContent>

      {renderConfirmDialog()}
    </>
  );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  inputData: ICustomerItem[];
  filters: ICustomerTableFilters;
  comparator: (a: any, b: any) => number;
};

function applyFilter({ inputData, comparator, filters }: ApplyFilterProps) {
  const { customerName, status } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (customerName) {
    inputData = inputData.filter((cus) =>
      cus.customerName.toLowerCase().includes(customerName.toLowerCase())
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((cus) => cus.status === status);
  }

  // if (address.length) {
  //   inputData = inputData.filter((cus) => cus.includes(cus.address));
  // }

  return inputData;
}
