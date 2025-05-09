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
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import axios from 'axios';
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { EmptyContent } from 'src/components/empty-content';
import { Iconify } from 'src/components/iconify';
import { DashboardContent } from 'src/layouts/dashboard';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import { GridActionsLinkItem } from 'src/sections/category/view';
import { ImportDetail } from 'src/types/importdetail';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export function ImportDetailListView() {
  const [tableData, setTableData] = useState<ImportDetail[]>([]);
  const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>([]);
  const [filterButtonEl, setFilterButtonEl] = useState<HTMLButtonElement | null>(null);

  useEffect(() => {
    async function fetchImportDetailData() {
      const url = 'http://localhost:8080/api/importdetailwarehosue';
      try {
        const response = await axios.get(url);
        console.log('response.data.importdeatils', response.data.importdeatils);
        setTableData(response.data.importdeatils);
      } catch (error) {
        console.error('Error fetching import data:', error);
      }
    }

    fetchImportDetailData();
  }, []);

  // Delete
  const handleDeleteRow = useCallback(
    async (id: number) => {
      const apiUrl = `http://localhost:8080/api/importdetailwarehosue/${id}`;

      try {
        const response = await axios.delete(apiUrl);

        if (response.status === 204) {
          const updatedTableData = tableData.filter((row) => row.importDetailID !== id);
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
      field: 'importDetailID',
      headerName: 'ID',
      minWidth: 80,
      hideable: false, // trường này không được ẩn đi
      filterable: false,
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      flex: 1,
      hideable: false, // trường này không được ẩn đi
      filterable: false,
    },
    {
      field: 'importPrice',
      headerName: 'Import Price',
      flex: 1,
    },
    {
      field: 'importDate',
      headerName: 'Import Date',
      flex: 1,
      renderCell: (data) => {
        return data.row.importID.importDate
          ? dayjs(data.row.importID.importDate).tz('Asia/Ho_Chi_Minh').format('MM/DD/YYYY HH:mm:ss')
          : '';
      },
    },
    {
      field: 'productName',
      headerName: 'Product Name',
      flex: 1,
      renderCell: (data) => {
        return data.row.productID.productName;
      },
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
          href={paths.dashboard.importdetail.edit(params.row.importDetailID)}
        />,
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:trash-bin-trash-bold" />}
          label="Delete"
          onClick={() => {
            handleDeleteRow(params.row.importDetailID);
          }}
          sx={{ color: 'error.main' }}
        />,
      ],
    },
  ];
  // ----------------------------------------------------------------------
  const HIDE_COLUMNS_TOGGLABLE = ['actions'];

  const getTogglableColumns = () =>
    columns
      .filter((column) => !HIDE_COLUMNS_TOGGLABLE.includes(column.field))
      .map((column) => column.field);

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="List Import Detail"
          links={[
            { name: 'Dashboard', href: paths.dashboard.importdetail.root },
            { name: 'Import Detail', href: paths.dashboard.importdetail.root },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.importdetail.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New import detail
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
            getRowId={(row) => row.importDetailID}
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
