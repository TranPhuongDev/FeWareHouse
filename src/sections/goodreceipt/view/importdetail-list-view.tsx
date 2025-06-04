'use client';

import {
  Button,
  Card,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Iconify } from 'src/components/iconify';
import { DashboardContent } from 'src/layouts/dashboard';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { ImportDetailItem } from 'src/types/importware';

import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import dayjs from 'dayjs';
import { GridActionsLinkItem } from 'src/sections/category/view';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { toast } from 'sonner';

dayjs.extend(utc);
dayjs.extend(timezone);

export function ImportDetailAccountantListView() {
  const [tableData, setTableData] = useState<ImportDetailItem[]>([]);

  // pagani
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData = tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  async function fetchImportDetailData() {
    const url = 'http://localhost:8080/api/importwarehouse';
    try {
      const dataRep = await axios.get(url);
      console.log(' Data:', dataRep.data.imports);

      setTableData(dataRep.data.imports);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  useEffect(() => {
    fetchImportDetailData();
  }, []);

  // Delete
  const handleDeleteRow = useCallback(
    async (id: number) => {
      const apiUrl = `http://localhost:8080/api/importwarehouse/delete-import-detail/${id}`;

      try {
        const response = await axios.delete(apiUrl);

        if (response.status === 204) {
          toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
            loading: 'Loading...',
            success: 'Delete success!',
            error: 'Update error!',
          });
          fetchImportDetailData();
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
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Danh sách phiếu nhập kho"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Phiếu nhập kho', href: '' },
            { name: 'Danh sách' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.goodreceipt.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Tạo phiếu nhập kho
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <Card>
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell>Import ID</TableCell>
                    <TableCell>Supplier Name</TableCell>
                    <TableCell>Import Date</TableCell>
                    <TableCell>Product Name</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Import Price</TableCell>
                    <TableCell>Total Amount</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedData.map((imp) => {
                    const details = imp.importDetailWarehosueID;
                    const rowspan = details.length || 1;

                    return details.length > 0 ? (
                      details.map((detail, idx) => (
                        <TableRow key={`${imp.importID}-${detail.importDetailID}`}>
                          {idx === 0 && (
                            <>
                              <TableCell rowSpan={rowspan}>{imp.importID}</TableCell>
                              <TableCell rowSpan={rowspan}>{imp.supplierID.supplierName}</TableCell>
                              <TableCell rowSpan={rowspan}>
                                {new Date(imp.importDate).toLocaleDateString()}
                              </TableCell>
                            </>
                          )}
                          <TableCell>{detail.productID.productName}</TableCell>
                          <TableCell>{detail.quantity}</TableCell>
                          <TableCell>{detail.importPrice.toLocaleString()}</TableCell>
                          {idx === 0 && (
                            <>
                              <TableCell rowSpan={rowspan}>
                                {imp.totalAmount.toLocaleString()}
                              </TableCell>
                              <TableCell rowSpan={rowspan}>
                                <GridActionsLinkItem
                                  showInMenu
                                  icon={<Iconify icon="solar:pen-bold" />}
                                  label="Edit"
                                  href={paths.dashboard.goodreceipt.edit(imp.importID.toString())}
                                />
                                <Button
                                  variant="outlined"
                                  startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                                  onClick={() => handleDeleteRow(imp.importID)}
                                >
                                  Delete
                                </Button>
                              </TableCell>
                            </>
                          )}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow key={imp.importID}>
                        <TableCell>{imp.importID}</TableCell>
                        <TableCell>{imp.supplierID.supplierName}</TableCell>
                        <TableCell>{new Date(imp.importDate).toLocaleDateString()}</TableCell>
                        <TableCell colSpan={3} align="center">
                          Không có sản phẩm nào
                        </TableCell>
                        <TableCell>{imp.totalAmount.toLocaleString()}</TableCell>
                        <TableCell>
                          <GridActionsLinkItem
                            showInMenu
                            icon={<Iconify icon="solar:pen-bold" />}
                            label="Edit"
                            href={paths.dashboard.goodreceipt.edit(imp.importID.toString())}
                          />
                          <Button
                            variant="outlined"
                            startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                            onClick={() => handleDeleteRow(imp.importID)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            {/* Table Pagination */}
            <TablePagination
              component="div"
              count={tableData.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
              labelRowsPerPage="Số dòng mỗi trang"
            />
          </Paper>
        </Card>
      </DashboardContent>
    </>
  );
}
