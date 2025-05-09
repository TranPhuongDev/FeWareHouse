import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { ImportDetail } from 'src/types/importdetail';
import { IProduct } from 'src/types/product';
import { ImportItem } from 'src/types/importware';
import { InputAdornment } from '@mui/material';

// ----------------------------------------------------------------------

export type NewImportDetailSchemaType = zod.infer<typeof NewImportSchema>;

export const NewImportSchema = zod.object({
  quantity: zod.number({ coerce: true }).nullable(),
  importPrice: zod.number({ coerce: true }).nullable(),
  productID: zod.string().nullable(),
  importID: zod.string().nullable(),
});

// ----------------------------------------------------------------------

type Props = {
  currentImportDetail?: ImportDetail;
};

export function ImportDetailNewEditForm({ currentImportDetail }: Props) {
  const [dataPro, setDataPro] = useState<IProduct[]>([]);
  const [dataImport, setDataImport] = useState<ImportItem[]>([]);
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

  const defaultValues: NewImportDetailSchemaType = {
    quantity: currentImportDetail?.quantity || null,
    importPrice: currentImportDetail?.importPrice || null,
    productID: currentImportDetail?.productID?.productID.toString() || '',
    importID: currentImportDetail?.importID?.importID.toString() || '',
  };

  const transformedValues: NewImportDetailSchemaType | undefined = currentImportDetail
    ? {
        quantity: currentImportDetail.quantity,
        importPrice: currentImportDetail.importPrice,
        productID: currentImportDetail.productID?.productID.toString() || '',
        importID: currentImportDetail.importID?.importID.toString() || '',
      }
    : undefined;

  const methods = useForm<NewImportDetailSchemaType>({
    mode: 'onSubmit',
    resolver: zodResolver(NewImportSchema),
    defaultValues,
    values: transformedValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    console.log('Data Update', data);
    const fixedData = currentImportDetail
      ? {
          ...data,
        }
      : {
          ...data,
          productID: data.productID || dataPro[0]?.productID || '',
          importID: data.importID || dataImport[0]?.importID || '',
        };

    const apiUrl = currentImportDetail
      ? `http://localhost:8080/api/importdetailwarehosue/${currentImportDetail.importDetailID}` // API cho cập nhật (patch)
      : 'http://localhost:8080/api/Importdetailwarehosue'; // API cho tạo mới (POST)

    const method = currentImportDetail ? 'patch' : 'post';
    try {
      const response = await axios({
        method,
        url: apiUrl,
        data: fixedData,
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
