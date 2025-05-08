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
import { ExportItemAdd } from 'src/types/exportware';
import { ICustomerItem } from 'src/types/customer';

// ----------------------------------------------------------------------

export type NewImportSchemaType = zod.infer<typeof NewImportSchema>;

export const NewImportSchema = zod.object({
  totalAmount: zod.number({ coerce: true }).nullable(),
  exportDate: zod.date({ coerce: true }).nullable(),
  customerID: zod.string(),
});

// ----------------------------------------------------------------------

type Props = {
  currentExport?: ExportItemAdd;
};

export function ExportNewEditForm({ currentExport }: Props) {
  const [dataCus, setDataCus] = useState<ICustomerItem[]>([]);
  const router = useRouter();

  // ----------------------------------------------------------------------
  useEffect(() => {
    async function fetchSupllierData() {
      const url = 'http://localhost:8080/api/customers';
      try {
        const dataCustomer = await axios.get(url);
        console.log('customers Data:', dataCustomer.data.customers);
        setDataCus(dataCustomer.data.customers);
      } catch (error) {
        console.error('Error fetching dataCustomer data:', error);
      }
    }

    fetchSupllierData();
  }, []);

  const defaultValues: NewImportSchemaType = {
    totalAmount: null,
    exportDate: null,
    customerID: '',
  };

  const methods = useForm<NewImportSchemaType>({
    mode: 'onSubmit',
    resolver: zodResolver(NewImportSchema),
    defaultValues,
    values: currentExport,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    console.log('Data Update', data);

    const apiUrl = currentExport
      ? `http://localhost:8080/api/exportwarehouse/${currentExport.exportID}` // API cho cập nhật (patch)
      : 'http://localhost:8080/api/exportwarehouse'; // API cho tạo mới (POST)

    const method = currentExport ? 'patch' : 'post';
    try {
      const response = await axios({
        method,
        url: apiUrl,
        data: data,
      });

      console.log('Response from API:', response.data);
      reset();
      toast.success(currentExport ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.exportware.root);
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
                label="Total Amount"
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
                name="customerID"
                label="customerID"
                slotProps={{
                  select: { native: true },
                  inputLabel: { shrink: true },
                }}
              >
                {dataCus.map((c) => (
                  <option key={c.customerID} value={c.customerID}>
                    {c.customerName}
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
                name="exportDate"
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
                {!currentExport ? 'Create export' : 'Save changes'}
              </Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
