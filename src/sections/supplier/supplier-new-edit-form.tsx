

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
import { IAddSupplierItem } from 'src/types/supplier';
import axios from 'axios';

// ----------------------------------------------------------------------

export type NewSupplierSchemaType = zod.infer<typeof NewSupplierSchema>;

export const NewSupplierSchema = zod.object({
  supplierName: zod.string().min(1, { message: 'Name is required!' }),
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
  phone: schemaHelper.phoneNumber({ isValid: isValidPhoneNumber }),
  // Not required
  address: zod.string(),
  website: zod.string(),
});

// ----------------------------------------------------------------------

type Props = {
  currentSupplier?: IAddSupplierItem;
};

export function SupplierNewEditForm({ currentSupplier }: Props) {
  const router = useRouter();

  const defaultValues: NewSupplierSchemaType = {
    supplierName: '',
    address: '',
    phone: '',
    email: '',
    website: '',
  };

  const methods = useForm<NewSupplierSchemaType>({
    mode: 'onSubmit',
    resolver: zodResolver(NewSupplierSchema),
    defaultValues,
    values: currentSupplier,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    console.log('Data Update', data);
    const apiUrl = currentSupplier
      ? `http://localhost:8080/api/suppliers/${currentSupplier.supplierID}` // API cho cập nhật (patch)
      : 'http://localhost:8080/api/suppliers'; // API cho tạo mới (POST)

    const method = currentSupplier ? 'patch' : 'post';
    try {
      const response = await axios({
        method,
        url: apiUrl,
        data: data,
      });

      console.log('Response from API:', response.data);
      reset();
      toast.success(currentSupplier ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.supplier.root);
    } catch (error) {
      console.error(error);
    }
  });

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
              <Field.Text name="supplierName" label="Full name" />
              <Field.Text name="email" label="Email address" />
              <Field.Phone
                name="phone"
                label="Phone number"
                country={!currentSupplier ? 'VN' : undefined}
              />
              <Field.Text name="address" label="Address" />
              <Field.Text name="website" label="website" />
            </Box>

            <Stack sx={{ mt: 3, alignItems: 'flex-end' }}>
              <Button type="submit" variant="contained" loading={isSubmitting}>
                {!currentSupplier ? 'Create supplier' : 'Save changes'}
              </Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
