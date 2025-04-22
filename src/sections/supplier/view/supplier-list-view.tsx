'use client';

import type { Theme, SxProps } from '@mui/material/styles';
import type { UseSetStateReturn } from 'minimal-shared/hooks';
import type { IProductItem, IProductTableFilters } from 'src/types/product';
import type {
  GridColDef,
  GridSlotProps,
  GridRowSelectionModel,
  GridActionsCellItemProps,
  GridColumnVisibilityModel,
} from '@mui/x-data-grid';

import { useState, useEffect, useCallback } from 'react';
import { useBoolean, useSetState } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
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

import { PRODUCT_STOCK_OPTIONS } from 'src/_mock';
import { useGetProducts } from 'src/actions/product';
import { DashboardContent } from 'src/layouts/dashboard';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

// import { ProductTableToolbar } from '../product-table-toolbar';
// import { ProductTableFiltersResult } from '../product-table-filters-result';
// import {
//   RenderCellStock,
//   RenderCellPrice,
//   RenderCellPublish,
//   RenderCellProduct,
//   RenderCellCreatedAt,
// } from '../product-table-row';

// ----------------------------------------------------------------------

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
    field: 'publish',
    headerName: 'Publish',
    width: 110,
    type: 'singleSelect',
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
  },
];

export const SUPPLIER_STOCK_OPTIONS = [
  { value: 'in stock', label: 'In stock' },
  { value: 'low stock', label: 'Low stock' },
  { value: 'out of stock', label: 'Out of stock' },
];
const PUBLISH_OPTIONS = [
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
];
export function SupplierListView() {
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
              href=""
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
            checkboxSelection
            disableRowSelectionOnClick
            // rows={dataFiltered}
            columns={columns}
            // loading={productsLoading}
            getRowHeight={() => 'auto'}
            pageSizeOptions={[5, 10, 20, { value: -1, label: 'All' }]}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            // onRowSelectionModelChange={(newSelectionModel) => setSelectedRowIds(newSelectionModel)}
            // columnVisibilityModel={columnVisibilityModel}
            // onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
            // slots={{
            //   toolbar: CustomToolbarCallback,
            //   noRowsOverlay: () => <EmptyContent />,
            //   noResultsOverlay: () => <EmptyContent title="No results found" />,
            // }}
            // slotProps={{
            //   toolbar: { setFilterButtonEl },
            //   panel: { anchorEl: filterButtonEl },
            //   columnsManagement: { getTogglableColumns },
            // }}
            sx={{ [`& .${gridClasses.cell}`]: { alignItems: 'center', display: 'inline-flex' } }}
          />
        </Card>
      </DashboardContent>
    </>
  );
}
