'use client';

import { Box, Button, Card } from '@mui/material';
import {
  DataGrid,
  GridActionsCellItem,
  gridClasses,
  GridColDef,
  GridRowSelectionModel,
  GridSlotProps,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarExport,
} from '@mui/x-data-grid';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Iconify } from 'src/components/iconify';
import { DashboardContent } from 'src/layouts/dashboard';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import { EmptyContent } from 'src/components/empty-content';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import { GridActionsLinkItem } from 'src/sections/category/view';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { ExportItem } from 'src/types/exportware';

dayjs.extend(utc);
dayjs.extend(timezone);

export function ExportListView() {
  const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>([]);
  const [filterButtonEl, setFilterButtonEl] = useState<HTMLButtonElement | null>(null);
  const [tableData, setTableData] = useState<ExportItem[]>([]);

  useEffect(() => {
    async function fetchExportData() {
      const url = 'http://localhost:8080/api/exportwarehouse';
      try {
        const response = await axios.get(url);
        const rawImports = response.data.exports;

        // Flatten nested supplierID object
        const formattedData = rawImports.map((item: any) => ({
          exportID: item.exportID,
          totalAmount: item.totalAmount,
          exportDate: item.exportDate ? dayjs(item.exportDate).format('MM/DD/YYYY HH:mm:ss') : '',

          customerID: item.customerID?.customerID ?? null,
          customerName: item.customerID?.customerName ?? null,
          address: item.customerID?.address ?? null,
          phone: item.customerID?.phone ?? null,
          email: item.customerID?.email ?? null,
        }));

        console.log('formattedData', formattedData);
        setTableData(formattedData);
      } catch (error) {
        console.error('Error fetching import data:', error);
      }
    }

    fetchExportData();
  }, []);

  // Delete
  const handleDeleteRow = useCallback(
    async (id: number) => {
      const apiUrl = `http://localhost:8080/api/exportwarehouse/${id}`;

      try {
        const response = await axios.delete(apiUrl);

        if (response.status === 204) {
          const updatedTableData = tableData.filter((row) => row.exportID !== id);
          setTableData(updatedTableData);
          toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
            loading: 'Loading...',
            success: 'Delete success!',
            error: 'Update error!',
          });
        } else {
          toast.error(`Delete failed with status: ${response.status}`);
        }
      } catch (error) {
        toast.error('Delete failed!');
      }
    },
    [tableData]
  );

  const CustomToolbarCallback = useCallback(
    () => (
      <CustomToolbar
        selectedRowIds={selectedRowIds}
        setFilterButtonEl={setFilterButtonEl}
        // onOpenConfirmDeleteRows={confirmDialog.onTrue}
      />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedRowIds]
  );
  const columns: GridColDef[] = [
    {
      field: 'exportID',
      headerName: 'ID',
      minWidth: 80,
      hideable: false, // trường này không được ẩn đi
      filterable: false,
    },
    {
      field: 'customerName',
      headerName: 'customerName',
      flex: 1,
      hideable: false, // trường này không được ẩn đi
      filterable: false,
    },
    {
      field: 'exportDate',
      headerName: 'Export Date',
      flex: 1,

      renderCell: (data) => {
        return data.row.exportDate
          ? dayjs(data.row.exportDate).tz('Asia/Ho_Chi_Minh').format('MM/DD/YYYY HH:mm:ss')
          : '';
      },
    },
    {
      field: 'totalAmount',
      headerName: 'Total Amount',
      flex: 1,
    },
    {
      type: 'actions',
      field: 'actions',
      headerName: ' ',
      align: 'right',
      headerAlign: 'right',
      width: 100,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      getActions: (params) => [
        <GridActionsLinkItem
          showInMenu
          icon={<Iconify icon="solar:pen-bold" />}
          label="Edit"
          href={paths.dashboard.exportware.edit(params.row.exportID)}
        />,
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:trash-bin-trash-bold" />}
          label="Delete"
          onClick={() => {
            handleDeleteRow(params.row.exportID);
          }}
          sx={{ color: 'error.main' }}
        />,
      ],
    },
  ];
  const HIDE_COLUMNS_TOGGLABLE = ['actions'];

  const getTogglableColumns = () =>
    columns
      .filter((column) => !HIDE_COLUMNS_TOGGLABLE.includes(column.field))
      .map((column) => column.field);

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="List Export"
          links={[
            { name: 'Dashboard', href: paths.dashboard.exportware.root },
            { name: 'Export', href: '' },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.exportware.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New export
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <Card
          sx={{
            minHeight: 640,
            flexGrow: { md: 1 },
            display: { md: 'flex' },
            height: { xs: 800, md: '1px' },
            flexDirection: { md: 'column' },
          }}
        >
          <DataGrid
            getRowId={(row) => row.exportID}
            checkboxSelection
            disableRowSelectionOnClick
            rows={tableData}
            columns={columns}
            pageSizeOptions={[5, 10, 20, { value: -1, label: 'All' }]}
            initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
            onRowSelectionModelChange={(newSelectionModel) => setSelectedRowIds(newSelectionModel)}
            slots={{
              toolbar: CustomToolbarCallback,
              noRowsOverlay: () => <EmptyContent />,
              noResultsOverlay: () => <EmptyContent title="No results found" />,
            }}
            slotProps={{
              toolbar: { setFilterButtonEl },
              panel: { anchorEl: filterButtonEl },
              columnsManagement: { getTogglableColumns },
            }}
            sx={{ [`& .${gridClasses.cell}`]: { alignItems: 'center', display: 'inline-flex' } }}
          />
        </Card>
      </DashboardContent>
    </>
  );
}

// ----------------------------------------------------------------------
type CustomToolbarProps = GridSlotProps['toolbar'] & {
  selectedRowIds: GridRowSelectionModel;
  //   onOpenConfirmDeleteRows: () => void;
};

function CustomToolbar({
  selectedRowIds,
  setFilterButtonEl,
  //   onOpenConfirmDeleteRows,
}: CustomToolbarProps) {
  return (
    <>
      <GridToolbarContainer>
        <Box
          sx={{
            gap: 1,
            display: 'flex',
            pr: { xs: 2.5, md: 1 },
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'flex-end', md: 'center' },
          }}
        >
          <DatePicker
            label="Start date"
            // value={currentFilters.startDate}
            // onChange={handleFilterStartDate}
            slotProps={{ textField: { fullWidth: true } }}
            sx={{ maxWidth: { md: 200 } }}
          />

          <DatePicker
            label="End date"
            // value={currentFilters.endDate}
            // onChange={handleFilterEndDate}
            slotProps={{
              textField: {
                fullWidth: true,
                // error: dateError,
                // helperText: dateError ? 'End date must be later than start date' : null,
              },
            }}
            sx={{
              maxWidth: { md: 200 },
              //   [`& .${formHelperTextClasses.root}`]: {
              //     position: { md: 'absolute' },
              //     bottom: { md: -40 },
              //   },
            }}
          />
        </Box>

        <Box
          sx={{
            gap: 1,
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          {!!selectedRowIds.length && (
            <Button
              size="small"
              color="error"
              startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
              //   onClick={onOpenConfirmDeleteRows}
            >
              Delete ({selectedRowIds.length})
            </Button>
          )}

          <GridToolbarColumnsButton ref={setFilterButtonEl} />
          <GridToolbarExport />
        </Box>
      </GridToolbarContainer>
    </>
  );
}
// ----------------------------------------------------------------------
