import type { IInvoice } from 'src/types/invoice';

import { useState, useCallback, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { Label } from 'src/components/label';
import { Scrollbar } from 'src/components/scrollbar';
import { ExportDetailItem } from 'src/types/exportware';
import { InvoiceTotalSummary } from '../invoice/invoice-total-summary';
import { Image } from 'src/components/image';
import axios from 'axios';
// import { InvoiceToolbar } from './invoice-toolbar';
// import { InvoiceTotalSummary } from './invoice-total-summary';

export const INVOICE_STATUS_OPTIONS = [
  { value: 'paid', label: 'Paid' },
  { value: 'pending', label: 'Pending' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'draft', label: 'Draft' },
];
// ----------------------------------------------------------------------

type Props = {
  currentExport?: ExportDetailItem;
};

export function InvoiceDetails({ currentExport }: Props) {
  // const [currentStatus, setCurrentStatus] = useState(currentExport?.status);
  const [imgQR, setImgQR] = useState('');

  useEffect(() => {
    async function fetchDataQR() {
      const url = 'http://localhost:8080/api/qr/vietqr/';
      try {
        const response = await axios.get(url, {
          params: {
            amount: currentExport?.totalAmount,
            code: currentExport?.code,
          },
        });
        setImgQR(response.data.qrImageUrl);
        console.log(response.data.qrImageUrl);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchDataQR();
  }, [currentExport?.status]);

  const renderFooter = () => (
    <Box
      sx={{
        py: 3,
        gap: 2,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
      }}
    >
      <div>
        <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
          NOTES
        </Typography>
        <Typography variant="body2">
          We appreciate your business. Should you need us to add VAT or extra notes let us know!
        </Typography>
      </div>

      <Box sx={{ flexGrow: { md: 1 }, textAlign: { md: 'right' } }}>
        <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
          Have a question?
        </Typography>
        <Typography variant="body2">support@minimals.cc</Typography>
      </Box>
    </Box>
  );

  const renderList = () => (
    <Scrollbar sx={{ mt: 5 }}>
      <Table sx={{ minWidth: 960 }}>
        <TableHead>
          <TableRow>
            <TableCell width={40}>#</TableCell>
            <TableCell sx={{ typography: 'subtitle2' }}>productName</TableCell>
            <TableCell>Qty</TableCell>
            <TableCell align="right">Sale price</TableCell>
            <TableCell align="right">Total Amount</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {currentExport?.exportDetailID.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>

              <TableCell>
                <Box sx={{ maxWidth: 560 }}>
                  <Typography variant="subtitle2">{row.productID.productName}</Typography>

                  <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                    {row.productID.description}
                  </Typography>
                </Box>
              </TableCell>

              <TableCell>{row.quantity}</TableCell>
              <TableCell align="right">{fCurrency(row.salePrice)}</TableCell>
              <TableCell align="right">{fCurrency(row.salePrice * row.quantity)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Scrollbar>
  );

  return (
    <>
      <Card sx={{ pt: 5, px: 5 }}>
        <Box
          sx={{
            rowGap: 5,
            display: 'grid',
            alignItems: 'center',
            gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
          }}
        >
          <Box
            component="img"
            alt="Invoice logo"
            src="/logo/logo-single.svg"
            sx={{ width: 48, height: 48 }}
          />

          <Stack spacing={1} sx={{ alignItems: { xs: 'flex-start', md: 'flex-end' } }}>
            <Label
              variant="soft"
              sx={{ width: 80, height: 38 }}
              color={
                (currentExport?.status === 'Paid' && 'success') ||
                (currentExport?.status === 'Pending' && 'warning') ||
                'default'
              }
            >
              {currentExport?.status}
            </Label>

            <Typography variant="h6">Invoice {currentExport?.exportID.toString()}</Typography>
          </Stack>

          <Stack sx={{ typography: 'body2' }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Invoice from
            </Typography>
            {currentExport?.customerID.customerName}
            <br />
            {currentExport?.customerID.address}
            <br />
            Phone: {currentExport?.customerID.phone}
            <br />
          </Stack>

          <Stack sx={{ typography: 'body2' }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Date create
            </Typography>
            {fDate(currentExport?.exportDate)}
          </Stack>
        </Box>

        {renderList()}

        <Divider sx={{ borderStyle: 'dashed' }} />
        <Box
          gap={2}
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          sx={{ pt: 5 }}
        >
          <Stack
            sx={{
              visibility: currentExport?.status === 'Pending' ? 'visible' : 'hidden',
            }}
          >
            <Image
              alt="QR Code"
              src={imgQR}
              ratio="1/1"
              sx={{ borderRadius: 1, width: 400, height: 500, ml: 30 }}
            />
          </Stack>

          <Stack>
            <InvoiceTotalSummary
              // taxes={invoice?.taxes}
              subtotal={currentExport?.totalAmount}
              // discount={invoice?.discount}
              // shipping={invoice?.shipping}
              totalAmount={currentExport?.totalAmount}
            />
          </Stack>
        </Box>

        <Divider sx={{ mt: 5, borderStyle: 'dashed' }} />

        {renderFooter()}
      </Card>
    </>
  );
}
