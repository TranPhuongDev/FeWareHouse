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
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ISupplierItem } from 'src/types/supplier';
import { useCallback, useEffect, useState } from 'react';
import { InputAdornment } from '@mui/material';
import { ImportItemAdd } from 'src/types/importware';
import dayjs from 'dayjs';

// ----------------------------------------------------------------------

export type NewImportSchemaType = zod.infer<typeof NewImportSchema>;

export const NewImportSchema = zod.object({
  totalAmount: zod.number({ coerce: true }).nullable(),
  importDate: zod.date({ coerce: true }).nullable(),
  supplierID: zod.string(),
});

// ----------------------------------------------------------------------

type Props = {
  currentImport?: ImportItemAdd;
};

export function ImportNewEditForm({ currentImport }: Props) {
  const [dataSup, setDataSup] = useState<ISupplierItem[]>([]);
  const router = useRouter();

  // ----------------------------------------------------------------------
  useEffect(() => {
    async function fetchSupllierData() {
      const url = 'http://localhost:8080/api/suppliers';
      try {
        const dataSupplier = await axios.get(url);
        console.log('Supplier Data:', dataSupplier.data.suppliers);
        setDataSup(dataSupplier.data.suppliers);
      } catch (error) {
        console.error('Error fetching supplier data:', error);
      }
    }

    fetchSupllierData();
  }, []);

  const defaultValues: NewImportSchemaType = {
    totalAmount: null,
    importDate: null,
    supplierID: '',
  };

  const methods = useForm<NewImportSchemaType>({
    mode: 'onSubmit',
    resolver: zodResolver(NewImportSchema),
    defaultValues,
    values: currentImport,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    console.log('Data Update', data);

    const apiUrl = currentImport
      ? `http://localhost:8080/api/importwarehouse/${currentImport.importID}` // API cho cập nhật (patch)
      : 'http://localhost:8080/api/importwarehouse'; // API cho tạo mới (POST)

    const method = currentImport ? 'patch' : 'post';
    try {
      const response = await axios({
        method,
        url: apiUrl,
        data: data,
      });

      console.log('Response from API:', response.data);
      reset();
      toast.success(currentImport ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.importware.root);
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
              <Field.Text
                name="totalAmount"
                label="Total price"
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
            <Box sx={{ p: 3 }}>
              <Field.Select
                name="supplierID"
                label="Supplier"
                slotProps={{
                  select: { native: true },
                  inputLabel: { shrink: true },
                }}
              >
                {dataSup.map((supplier) => (
                  <option key={supplier.supplierID} value={supplier.supplierID}>
                    {supplier.supplierName}
                  </option>
                ))}
              </Field.Select>
            </Box>

            <Box
              sx={{
                p: 3,
                gap: 1,
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: { xs: 'flex-end', md: 'center' },
                justifyContent: 'space-between',
              }}
            >
              <Controller
                name="importDate"
                control={methods.control}
                render={({ field }) => (
                  <DatePicker
                    label="Start date"
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(date) => field.onChange(date?.toDate() || null)}
                    slotProps={{ textField: { fullWidth: true } }}
                    sx={{ maxWidth: { md: 200 } }}
                  />
                )}
              />
            </Box>

            <Stack sx={{ mt: 3, alignItems: 'center' }}>
              <Button type="submit" variant="contained" loading={isSubmitting}>
                {!currentImport ? 'Create category' : 'Save changes'}
              </Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
