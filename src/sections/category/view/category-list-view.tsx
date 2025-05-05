'use client';

import { Theme } from '@emotion/react';
import { Box, Button, Card, ListItemIcon, MenuItem, SxProps } from '@mui/material';
import {
  DataGrid,
  GridActionsCellItem,
  GridActionsCellItemProps,
  gridClasses,
  GridColDef,
  GridRowSelectionModel,
  GridSlotProps,
  GridToolbar,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';
import Link from '@mui/material/Link';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Iconify } from 'src/components/iconify';
import { DashboardContent } from 'src/layouts/dashboard';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import { EmptyContent } from 'src/components/empty-content';
import { useCallback, useEffect, useState } from 'react';
import { useBoolean } from 'minimal-shared/hooks';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { toast } from 'sonner';
import { ICategoryItem } from 'src/types/category';
import axios from 'axios';

// const rows = [
//   { id: 1, categoryName: 'Snow' },
//   { id: 2, categoryName: 'Lannister' },
//   { id: 3, categoryName: 'Lannister' },
//   { id: 4, categoryName: 'Stark' },
//   { id: 5, categoryName: 'Targaryen' },
//   { id: 6, categoryName: 'Melisandre' },
//   { id: 7, categoryName: 'Clifford' },
//   { id: 8, categoryName: 'Frances' },
//   { id: 9, categoryName: 'Roxie' },
// ];

export function CategoryListView() {
  const [filterButtonEl, setFilterButtonEl] = useState<HTMLButtonElement | null>(null);
  const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>([]);
  const [tableData, setTableData] = useState<ICategoryItem[]>([]);

  // Delete
  const confirmDialog = useBoolean();

  const CustomToolbarCallback = useCallback(
    () => (
      <CustomToolbar
        selectedRowIds={selectedRowIds}
        setFilterButtonEl={setFilterButtonEl}
        onOpenConfirmDeleteRows={confirmDialog.onTrue}
      />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedRowIds]
  );

  const columns: GridColDef[] = [
    {
      field: 'categoryID',
      headerName: 'ID',
      minWidth: 80,
      hideable: false, // trường này không được ẩn đi
      filterable: false,
    },
    {
      field: 'categoryName',
      headerName: 'Category Name',
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
          href={paths.dashboard.category.edit(params.row.categoryID)}
        />,
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:trash-bin-trash-bold" />}
          label="Delete"
          onClick={() => {
            handleDeleteRow(params.row.categoryID);
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

  useEffect(() => {
    async function fetchCategoryData() {
      const url = 'http://localhost:8080/api/categories';
      try {
        const dataCategory = await axios.get(url);
        console.log('Category Data:', dataCategory.data.categories);
        setTableData(dataCategory.data.categories);
      } catch (error) {
        console.error('Error fetching category data:', error);
      }
    }
    fetchCategoryData();
  }, []);

  const handleDeleteRow = useCallback(
    async (id: string) => {
      const apiUrl = `http://localhost:8080/api/categories/${id}`;

      try {
        const response = await axios.delete(apiUrl);

        if (response.status === 204) {
          const updatedTableData = tableData.filter((row) => row.categoryID !== id);
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

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !selectedRowIds.includes(row.categoryID));

    toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
      loading: 'Loading...',
      success: 'Delete success!',
      error: 'Delete error!',
    });

    setTableData(deleteRows);
  }, [selectedRowIds, tableData]);

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Delete"
      content={
        <>
          Are you sure want to delete <strong> {selectedRowIds.length} </strong> items?
        </>
      }
      action={
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            handleDeleteRows();
            confirmDialog.onFalse();
          }}
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
          heading="List Category"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Category', href: '' },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.category.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New category
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
            getRowId={(row) => row.categoryID}
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

      {renderConfirmDialog()}
    </>
  );
}

// ----------------------------------------------------------------------
declare module '@mui/x-data-grid' {
  interface ToolbarPropsOverrides {
    setFilterButtonEl: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>;
  }
}

// ----------------------------------------------------------------------

type GridActionsLinkItemProps = Pick<GridActionsCellItemProps, 'icon' | 'label' | 'showInMenu'> & {
  href: string;
  sx?: SxProps<Theme>;
  ref?: React.RefObject<HTMLLIElement | null>;
};

export function GridActionsLinkItem({ ref, href, label, icon, sx }: GridActionsLinkItemProps) {
  return (
    <MenuItem ref={ref} sx={sx}>
      <Link
        component={RouterLink}
        href={href}
        underline="none"
        color="inherit"
        sx={{ width: 1, display: 'flex', alignItems: 'center' }}
      >
        {icon && <ListItemIcon>{icon}</ListItemIcon>}
        {label}
      </Link>
    </MenuItem>
  );
}
// ----------------------------------------------------------------------

type CustomToolbarProps = GridSlotProps['toolbar'] & {
  selectedRowIds: GridRowSelectionModel;
  onOpenConfirmDeleteRows: () => void;
};

function CustomToolbar({
  selectedRowIds,
  setFilterButtonEl,
  onOpenConfirmDeleteRows,
}: CustomToolbarProps) {
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
              onClick={onOpenConfirmDeleteRows}
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
