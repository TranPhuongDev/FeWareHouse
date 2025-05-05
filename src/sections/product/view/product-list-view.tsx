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
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { EmptyContent } from 'src/components/empty-content';
import { Iconify } from 'src/components/iconify';
import { DashboardContent } from 'src/layouts/dashboard';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import { GridActionsLinkItem } from 'src/sections/category/view';
import { IProduct } from 'src/types/product';

// ----------------------------------------------------------------------

export function ProductListView() {
  const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>([]);
  const [filterButtonEl, setFilterButtonEl] = useState<HTMLButtonElement | null>(null);
  const [tableData, setTableData] = useState<IProduct[]>([]);

  useEffect(() => {
    async function fetchProductData() {
      const url = 'http://localhost:8080/api/products';
      try {
        const dataCategory = await axios.get(url);
        console.log('Product Data:', dataCategory.data.products);
        setTableData(dataCategory.data.products);
      } catch (error) {
        console.error('Error fetching category data:', error);
      }
    }
    fetchProductData();
  }, []);

  const HIDE_COLUMNS_TOGGLABLE = ['actions'];

  const getTogglableColumns = () =>
    columns
      .filter((column) => !HIDE_COLUMNS_TOGGLABLE.includes(column.field))
      .map((column) => column.field);

  const CustomToolbarCallback = useCallback(
    () => <CustomToolbar selectedRowIds={selectedRowIds} setFilterButtonEl={setFilterButtonEl} />,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedRowIds]
  );

  const columns: GridColDef[] = [
    {
      field: 'productID',
      headerName: 'ID',
      minWidth: 80,
      // hideable: false, // trường này không được ẩn đi
      filterable: false,
    },
    {
      field: 'productName',
      headerName: 'Product Name',
      hideable: false,
      flex: 1,
      filterable: false,
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 1,
      filterable: false,
    },
    {
      field: 'unit',
      headerName: 'Unit',
      minWidth: 80,
      filterable: false,
    },
    {
      field: 'importPrice',
      headerName: 'Import Price',
      flex: 1,
      filterable: false,
    },
    {
      field: 'salePrice',
      headerName: 'Sale Price',
      flex: 1,
      filterable: false,
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
          href={paths.dashboard.product.edit(params.row.productID)}
        />,
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:trash-bin-trash-bold" />}
          label="Delete"
          onClick={() => {
            handleDeleteRow(params.row.productID);
          }}
          sx={{ color: 'error.main' }}
        />,
      ],
    },
  ];
  const handleDeleteRow = useCallback(
    async (id: string) => {
      const apiUrl = `http://localhost:8080/api/products/${id}`;

      try {
        const response = await axios.delete(apiUrl);

        if (response.status === 204) {
          const updatedTableData = tableData.filter((row) => row.productID !== id);
          setTableData(updatedTableData);
          toast.success('Delete success!');
        } else {
          toast.error(`Delete failed with status: ${response.status}`);
        }
      } catch (error) {
        toast.error('Delete failed!');
      }
    },
    [tableData]
  );
  return (
    <>
      <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <CustomBreadcrumbs
          heading="List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Product', href: paths.dashboard.product.root },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.product.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New product
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
            getRowId={(row) => row.productID}
            checkboxSelection
            disableRowSelectionOnClick
            getRowHeight={() => 'auto'}
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
// ----------------------------------------------------------------------

type CustomToolbarProps = GridSlotProps['toolbar'] & {
  selectedRowIds: GridRowSelectionModel;
  // onOpenConfirmDeleteRows: () => void;
};

function CustomToolbar({ selectedRowIds, setFilterButtonEl }: CustomToolbarProps) {
  return (
    <>
      <GridToolbarContainer>
        <GridToolbarQuickFilter
          sx={{
            gap: 1,
            flexGrow: 1,
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
              // onClick={onOpenConfirmDeleteRows}
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
