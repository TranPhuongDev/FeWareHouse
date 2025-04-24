import type { IUserItem } from 'src/types/user';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';
import { ICustomerItem } from 'src/types/customer';
import axios from 'axios';

// ----------------------------------------------------------------------

export type CustomerQuickEditSchemaType = zod.infer<typeof CustomerQuickEditSchema>;
const CUSTOMER_STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'silver', label: 'Silver' },
  { value: 'gold', label: 'Gold' },
  { value: 'platinum', label: 'Platinum' },
  { value: 'diamond', label: 'Diamond' },
];

export const CustomerQuickEditSchema = zod.object({
  customerName: zod.string().min(1, { message: 'customerName is required!' }),
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
  // Not required
  address: zod.string(),
  phone: zod.string(),
  status: zod.string(),
});

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: () => void;
  currentCustomer?: ICustomerItem;
};

export function CustomerQuickEditForm({ currentCustomer, open, onClose }: Props) {
  const defaultValues: CustomerQuickEditSchemaType = {
    customerName: '',
    address: '',
    email: '',
    phone: '',
    status: '',
  };

  const methods = useForm<CustomerQuickEditSchemaType>({
    mode: 'all',
    resolver: zodResolver(CustomerQuickEditSchema),
    defaultValues,
    values: currentCustomer,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const apiUrl = `http://localhost:8080/api/customers/${currentCustomer?.customerID}`;
    try {
      const response = await axios({
        method: 'patch',
        url: apiUrl,
        data: data,
      });

      console.log('Response from API:', response.data);
      reset();
      onClose();

      toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
        loading: 'Loading...',
        success: 'Update success!',
        error: 'Update error!',
      });

      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: { maxWidth: 720 },
        },
      }}
    >
      <DialogTitle>Quick update</DialogTitle>

      <Form methods={methods} onSubmit={onSubmit}>
        <DialogContent>
          <Alert variant="outlined" severity="info" sx={{ mb: 3 }}>
            Account is waiting for confirmation
          </Alert>

          <Box
            sx={{
              rowGap: 3,
              columnGap: 2,
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
            }}
          >
            <Field.Select name="status" label="Status">
              {CUSTOMER_STATUS_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }} />
            <Field.Text name="customerName" label="Full name" />
            <Field.Text name="email" label="Email" />
            <Field.Text name="address" label="Address" />
            <Field.Phone
              name="phone"
              label="Phone number"
              country={!currentCustomer ? 'VN' : undefined}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <Button type="submit" variant="contained" loading={isSubmitting}>
            Update
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
