'use client';

import type { UseSetStateReturn } from 'minimal-shared/hooks';
import type {
  GridColDef,
  GridSlotProps,
  GridRowSelectionModel,
  GridColumnVisibilityModel,
} from '@mui/x-data-grid';

import { useState, useEffect, useCallback } from 'react';
import { useBoolean, useSetState } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import {
  DataGrid,
  gridClasses,
  GridToolbarExport,
  GridActionsCellItem,
  GridToolbarContainer,
  GridToolbarQuickFilter,
  GridToolbarFilterButton,
  GridToolbarColumnsButton,
} from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { ISupplierItem, ISupplierTableFilters } from 'src/types/supplier';
import { SupplierTableFiltersResult } from '../supplier-table-filters-result';
import axios from 'axios';
import { GridActionsLinkItem } from 'src/sections/product/view';
import { toast } from 'sonner';

// ----------------------------------------------------------------------

const HIDE_COLUMNS = { category: false };

const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];

export function SupplierListView() {
  const [tableData, setTableData] = useState<ISupplierItem[]>([]);
  const filters = useSetState<ISupplierTableFilters>({ supplierName: [], address: [] });
  const { state: currentFilters } = filters;

  const dataFiltered = applyFilter({
    inputData: tableData,
    filters: currentFilters,
  });
  const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>([]);
  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>(HIDE_COLUMNS);

  const canReset = currentFilters.supplierName.length > 0 || currentFilters.address.length > 0;
  const [filterButtonEl, setFilterButtonEl] = useState<HTMLButtonElement | null>(null);

  const confirmDialog = useBoolean();

  // list supplier
  useEffect(() => {
    async function fetchData() {
      const url = 'http://localhost:8080/api/suppliers';
      try {
        const dataSupplier = await axios.get(url);
        console.log('Supplier Data:', dataSupplier.data.suppliers);
        setTableData(dataSupplier.data.suppliers);
      } catch (error) {
        console.error('Error fetching supplier data:', error);
      }
    }

    fetchData();
  }, []);

  const CustomToolbarCallback = useCallback(
    () => (
      <CustomToolbar
        filters={filters}
        canReset={canReset}
        selectedRowIds={selectedRowIds}
        setFilterButtonEl={setFilterButtonEl}
        filteredResults={dataFiltered.length}
        onOpenConfirmDeleteRows={confirmDialog.onTrue}
      />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentFilters, selectedRowIds]
  );

  const handleDeleteRow = useCallback(
    async (id: string) => {
      const apiUrl = `http://localhost:8080/api/suppliers/${id}`;

      try {
        const response = await axios.delete(apiUrl);

        if (response.status === 204) {
          const updatedTableData = tableData.filter((row) => row.supplierID !== id);
          setTableData(updatedTableData);
          toast.success('Delete success!');
        } else {
          toast.error(`Delete failed with status: ${response.status}`);
        }
      } catch (error) {
        toast.error('Delete failed!');
      }
    },
    [setTableData, tableData]
  );

  // ----------------------------------------------------------------------

  const columns: GridColDef[] = [
    { field: 'supplierName', headerName: 'SupplierName', filterable: false },
    {
      field: 'address',
      headerName: 'Address',
      flex: 1,
      minWidth: 360,
      hideable: false,
    },
    {
      field: 'phone',
      headerName: 'Phone',
      width: 160,
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 160,
      type: 'singleSelect',
    },
    {
      field: 'website',
      headerName: 'Website',
      width: 140,
      editable: true,
    },
    {
      type: 'actions',
      field: 'actions',
      headerName: ' ',
      align: 'right',
      headerAlign: 'right',
      width: 80,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      getActions: (params) => [
        // <GridActionsLinkItem
        //   showInMenu
        //   icon={<Iconify icon="solar:eye-bold" />}
        //   label="View"
        //   href=""
        // />,
        <GridActionsLinkItem
          showInMenu
          icon={<Iconify icon="solar:pen-bold" />}
          label="Edit"
          href={paths.dashboard.supplier.edit(params.row.supplierID)}
        />,
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:trash-bin-trash-bold" />}
          label="Delete"
          onClick={() => {
            handleDeleteRow(params.row.supplierID);
          }}
          sx={{ color: 'error.main' }}
        />,
      ],
    },
  ];
  const getTogglableColumns = () =>
    columns
      .filter((column) => !HIDE_COLUMNS_TOGGLABLE.includes(column.field))
      .map((column) => column.field);

  return (
    <>
      <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <CustomBreadcrumbs
          heading="List"
          links={[
            { name: 'Dashboard', href: '' },
            { name: 'Supplier', href: '' },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.supplier.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Supplier
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
            getRowId={(row) => row.supplierID}
            checkboxSelection
            disableRowSelectionOnClick
            rows={dataFiltered}
            columns={columns}
            getRowHeight={() => 'auto'}
            pageSizeOptions={[5, 10, 20, { value: -1, label: 'All' }]}
            initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
            onRowSelectionModelChange={(newSelectionModel) => setSelectedRowIds(newSelectionModel)}
            columnVisibilityModel={columnVisibilityModel}
            onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
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

type ApplyFilterProps = {
  inputData: ISupplierItem[];
  filters: ISupplierTableFilters;
};

function applyFilter({ inputData, filters }: ApplyFilterProps) {
  const { supplierName, address } = filters;

  if (supplierName.length) {
    inputData = inputData.filter((supplier) => supplierName.includes(supplier.supplierName));
  }

  if (address.length) {
    inputData = inputData.filter((supplier) => address.includes(supplier.address));
  }

  return inputData;
}
// export const SUPPLIER_STOCK_OPTIONS = [
//   { value: 'in stock', label: 'In stock' },
//   { value: 'low stock', label: 'Low stock' },
//   { value: 'out of stock', label: 'Out of stock' },
// ];

// const ADDRESS_OPTIONS = [
//   { value: 'published', label: 'Published' },
//   { value: 'draft', label: 'Draft' },
// ];

type CustomToolbarProps = GridSlotProps['toolbar'] & {
  canReset: boolean;
  filteredResults: number;
  selectedRowIds: GridRowSelectionModel;
  filters: UseSetStateReturn<ISupplierTableFilters>;

  onOpenConfirmDeleteRows: () => void;
};

function CustomToolbar({
  filters,
  canReset,
  selectedRowIds,
  filteredResults,
  setFilterButtonEl,
  onOpenConfirmDeleteRows,
}: CustomToolbarProps) {
  return (
    <>
      <GridToolbarContainer>
        {/* <SupplierTableToolbar
          filters={filters}
          options={{ supplierName: PRODUCT_STOCK_OPTIONS, address: ADDRESS_OPTIONS }}
        /> */}

        <GridToolbarQuickFilter
          sx={{
            gap: 1,
            flexGrow: 1,
            display: 'flex',
            alignItems: 'left',
            justifyContent: 'flex-end',
          }}
        />

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
              onClick={onOpenConfirmDeleteRows}
            >
              Delete ({selectedRowIds.length})
            </Button>
          )}

          <GridToolbarColumnsButton />
          <GridToolbarFilterButton ref={setFilterButtonEl} />
          <GridToolbarExport />
        </Box>
      </GridToolbarContainer>

      {canReset && (
        <SupplierTableFiltersResult
          filters={filters}
          totalResults={filteredResults}
          sx={{ p: 2.5, pt: 0 }}
        />
      )}
    </>
  );
}
