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

// ----------------------------------------------------------------------

export type NewImportSchemaType = zod.infer<typeof NewImportSchema>;

export const NewImportSchema = zod.object({
  quantity: zod.number({ coerce: true }).nullable(),
  importPrice: zod.number({ coerce: true }).nullable(),
  productID: zod.number({ coerce: true }).nullable(),
  importID: zod.number({ coerce: true }).nullable(),
});

// ----------------------------------------------------------------------

type Props = {
  currentImportDetail?: ImportDetailAdd;
};

export function ImportDetailNewEditForm({ currentImportDetail }: Props) {
  const [dataPro, setDataPro] = useState<IProduct[]>([]);
  const [dataImport, setDataImport] = useState<ImportItemAdd[]>([]);
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
    async function fetchImportData() {
      const url = 'http://localhost:8080/api/importwarehouse';
      try {
        const dataImport = await axios.get(url);
        console.log('Import Data:', dataImport.data.imports);
        setDataImport(dataImport.data.imports);
      } catch (error) {
        console.error('Error fetching supplier data:', error);
      }
    }

    fetchImportData();
    fetchProductData();
  }, []);

  const defaultValues: NewImportSchemaType = {
    quantity: null,
    importPrice: null,
    productID: null,
    importID: null,
  };

  const methods = useForm<NewImportSchemaType>({
    mode: 'onSubmit',
    resolver: zodResolver(NewImportSchema),
    defaultValues,
    values: currentImportDetail,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    console.log('Data Update', data);

    const apiUrl = currentImportDetail
      ? `http://localhost:8080/api/importdetailwarehosue/${currentImportDetail.importDetailID}` // API cho cập nhật (patch)
      : 'http://localhost:8080/api/Importdetailwarehosue'; // API cho tạo mới (POST)

    const method = currentImportDetail ? 'patch' : 'post';
    try {
      const response = await axios({
        method,
        url: apiUrl,
        data: data,
      });

      console.log('Response from API:', response.data);
      reset();
      toast.success(currentImportDetail ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.importdetail.root);
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
                name="importPrice"
                label="Import Price"
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
                  name="importID"
                  label="Import"
                  slotProps={{
                    select: { native: true },
                    inputLabel: { shrink: true },
                  }}
                >
                  {dataImport.map((i) => (
                    <option key={i.importID} value={i.importID}>
                      {i.importID}
                    </option>
                  ))}
                </Field.Select>
              </Box>
            </Stack>

            <Stack sx={{ mt: 3, alignItems: 'center' }}>
              <Button type="submit" variant="contained" loading={isSubmitting}>
                {!currentImportDetail ? 'Create category' : 'Save changes'}
              </Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
