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
import { ICategoryItem } from 'src/types/category';

// ----------------------------------------------------------------------

export type NewCategorySchemaType = zod.infer<typeof NewCategorySchema>;

export const NewCategorySchema = zod.object({
  categoryName: zod.string().min(1, 'Category name is required'),
});

// ----------------------------------------------------------------------

type Props = {
  currentCategory?: ICategoryItem;
};

export function CategoryNewEditForm({ currentCategory }: Props) {
  const router = useRouter();

  const defaultValues: NewCategorySchemaType = {
    categoryName: '',
  };

  const methods = useForm<NewCategorySchemaType>({
    mode: 'onSubmit',
    resolver: zodResolver(NewCategorySchema),
    defaultValues,
    values: currentCategory,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    console.log('Data Update', data);
    const apiUrl = currentCategory
      ? `http://localhost:8080/api/categories/${currentCategory.categoryID}` // API cho cập nhật (patch)
      : 'http://localhost:8080/api/categories'; // API cho tạo mới (POST)

    const method = currentCategory ? 'patch' : 'post';
    try {
      const response = await axios({
        method,
        url: apiUrl,
        data: data,
      });

      console.log('Response from API:', response.data);
      reset();
      toast.success(currentCategory ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.category.root);
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
            <Box>
              <Field.Text name="categoryName" label="Full name" fullWidth />
            </Box>
            <Stack sx={{ mt: 3, justifyContent: 'center', alignItems: 'center' }}>
              <Button type="submit" variant="contained" loading={isSubmitting}>
                {!currentCategory ? 'Create category' : 'Save changes'}
              </Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
