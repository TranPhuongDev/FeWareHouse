import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
import { ICustomerItem } from 'src/types/customer';
import { MenuItem } from '@mui/material';

// ----------------------------------------------------------------------

export type NewSupplierSchemaType = zod.infer<typeof NewCustomerSchema>;

export const NewCustomerSchema = zod.object({
  customerName: zod.string().min(1, { message: 'Name is required!' }),
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
  phone: schemaHelper.phoneNumber({ isValid: isValidPhoneNumber }),
  // Not required
  status: zod.string(),
  address: zod.string(),
});

// ----------------------------------------------------------------------

type Props = {
  currentCustomer?: ICustomerItem;
};

export function CustomerNewEditForm({ currentCustomer }: Props) {
  const router = useRouter();

  const defaultValues: NewSupplierSchemaType = {
    customerName: '',
    address: '',
    phone: '',
    email: '',
    status: '',
  };

  const methods = useForm<NewSupplierSchemaType>({
    mode: 'onSubmit',
    resolver: zodResolver(NewCustomerSchema),
    defaultValues,
    values: currentCustomer,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    console.log('Data Update', data);
    const apiUrl = currentCustomer
      ? `http://localhost:8080/api/customers/${currentCustomer.customerID}` // API cho cập nhật (patch)
      : 'http://localhost:8080/api/customers'; // API cho tạo mới (POST)

    const method = currentCustomer ? 'patch' : 'post';
    try {
      const response = await axios({
        method,
        url: apiUrl,
        data: data,
      });

      console.log('Response from API:', response.data);
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      toast.success(currentCustomer ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.customer.list);
    } catch (error) {
      console.error(error);
    }
  });

  const CUSTOMER_STATUS_OPTIONS = [
    { value: 'silver', label: 'Silver' },
    { value: 'gold', label: 'Gold' },
    { value: 'platinum', label: 'Platinum' },
    { value: 'diamond', label: 'Diamond' },
  ];

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 12 }}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                rowGap: 3,
                columnGap: 2,
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <Field.Text name="customerName" label="Full name" />
              <Field.Text name="email" label="Email" />
              <Field.Phone
                name="phone"
                label="Phone number"
                country={!currentCustomer ? 'VN' : undefined}
              />
              <Field.Text name="address" label="Address" />
              <Field.Select name="status" label="Status">
                {CUSTOMER_STATUS_OPTIONS.map((status) => (
                  <MenuItem key={status.value} value={status.value}>
                    {status.label}
                  </MenuItem>
                ))}
              </Field.Select>
            </Box>

            <Stack sx={{ mt: 3, alignItems: 'flex-end' }}>
              <Button type="submit" variant="contained" loading={isSubmitting}>
                {!currentCustomer ? 'Create customer' : 'Save changes'}
              </Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
