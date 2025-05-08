import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { InputAdornment } from '@mui/material';
import { ImportItemAdd } from 'src/types/importware';
import dayjs from 'dayjs';
import { ImportDetailAdd } from 'src/types/importdetail';
import { IProduct, IProductItem } from 'src/types/product';
import { ExportDetailAdd } from 'src/types/exportdetail';
import { ExportItemAdd } from 'src/types/exportware';

// ----------------------------------------------------------------------

export type NewExportSchemaType = zod.infer<typeof NewExportSchema>;

export const NewExportSchema = zod.object({
  quantity: zod.number({ coerce: true }).nullable(),
  salePrice: zod.number({ coerce: true }).nullable(),
  productID: zod.number({ coerce: true }).nullable(),
  exportID: zod.number({ coerce: true }).nullable(),
});

// ----------------------------------------------------------------------

type Props = {
  currentExportDetail?: ExportDetailAdd;
};

export function ExportDetailNewEditForm({ currentExportDetail }: Props) {
  const [dataPro, setDataPro] = useState<IProduct[]>([]);
  const [dataExport, setDataExport] = useState<ExportItemAdd[]>([]);
  const router = useRouter();

  // ----------------------------------------------------------------------
  useEffect(() => {
    async function fetchProductData() {
      const url = 'http://localhost:8080/api/products';
      try {
        const dataPro = await axios.get(url);
        console.log('Product Data:', dataPro.data.products);
        setDataPro(dataPro.data.products);
      } catch (error) {
        console.error('Error fetching supplier data:', error);
      }
    }
    async function fetchDataExport() {
      const url = 'http://localhost:8080/api/exportwarehouse';
      try {
        const dataExportDetail = await axios.get(url);
        console.log('setDataExport Data:', dataExportDetail.data.exports);
        setDataExport(dataExportDetail.data.exports);
      } catch (error) {
        console.error('Error fetching setDataExport data:', error);
      }
    }

    fetchDataExport();
    fetchProductData();
  }, []);

  const defaultValues: NewExportSchemaType = {
    quantity: null,
    salePrice: null,
    productID: null,
    exportID: null,
  };

  const methods = useForm<NewExportSchemaType>({
    mode: 'onSubmit',
    resolver: zodResolver(NewExportSchema),
    defaultValues,
    values: currentExportDetail,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    console.log('Data Update', data);

    const apiUrl = currentExportDetail
      ? `http://localhost:8080/api/exportdetailwarehouse/${currentExportDetail.exportDetailID}` // API cho cập nhật (patch)
      : 'http://localhost:8080/api/exportdetailwarehouse'; // API cho tạo mới (POST)

    const method = currentExportDetail ? 'patch' : 'post';
    try {
      const response = await axios({
        method,
        url: apiUrl,
        data: data,
      });

      console.log('Response from API:', response.data);
      reset();
      toast.success(currentExportDetail ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.exportdetail.root);
    } catch (error) {
      toast.error('CategoryName đã tồn tại');
      console.error(error);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container justifyContent="center">
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 3 }}>
            <Box sx={{ p: 3 }}>
              <Field.Text name="quantity" label="Quantity" type="number" />
            </Box>
            <Box sx={{ p: 3 }}>
              <Field.Text
                name="salePrice"
                label="Sale Price"
                placeholder="0.00"
                type="number"
                slotProps={{
                  inputLabel: { shrink: true },
                  input: {
                    startAdornment: (
                      <InputAdornment position="start" sx={{ mr: 0.75 }}>
                        <Box component="span" sx={{ color: 'text.disabled' }}>
                          $
                        </Box>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>
            <Stack spacing={3} sx={{ p: 3 }}>
              <Box
                sx={{
                  rowGap: 3,
                  columnGap: 2,
                  display: 'grid',
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' },
                }}
              >
                <Field.Select
                  name="productID"
                  label="Product"
                  slotProps={{
                    select: { native: true },
                    inputLabel: { shrink: true },
                  }}
                >
                  {dataPro.map((p) => (
                    <option key={p.productID} value={p.productID}>
                      {p.productName}
                    </option>
                  ))}
                </Field.Select>
                <Field.Select
                  name="exportID"
                  label="Export"
                  slotProps={{
                    select: { native: true },
                    inputLabel: { shrink: true },
                  }}
                >
                  {dataExport.map((i) => (
                    <option key={i.exportID} value={i.exportID}>
                      {i.exportID}
                    </option>
                  ))}
                </Field.Select>
              </Box>
            </Stack>

            <Stack sx={{ mt: 3, alignItems: 'center' }}>
              <Button type="submit" variant="contained" loading={isSubmitting}>
                {!currentExportDetail ? 'Create category' : 'Save changes'}
              </Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
