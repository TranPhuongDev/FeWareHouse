import type { IProduct, IProductItem } from 'src/types/product';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field, schemaHelper } from 'src/components/hook-form';
import axios from 'axios';
import { ICategoryItem } from 'src/types/category';
import { ISupplierItem } from 'src/types/supplier';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export type NewProductSchemaType = zod.infer<typeof NewProductSchema>;

export const NewProductSchema = zod.object({
  productName: zod.string().min(1, { message: 'Name is required!' }),
  description: schemaHelper
    .editor({ message: 'Description is required!' })
    .min(5, { message: 'Description must be at least 5 characters' })
    .max(500, { message: 'Description must be less than 500 characters' }),
  // Not required
  unit: zod.string().min(1, { message: 'Name is required!' }),
  importPrice: zod.number({ coerce: true }).nullable(),
  salePrice: zod.number({ coerce: true }).nullable(),
  categoryID: zod.string().optional(),
  supplierID: zod.string().optional(),
});

// ----------------------------------------------------------------------

type Props = {
  currentProduct?: IProduct;
};

export function ProductNewEditForm({ currentProduct }: Props) {
  const router = useRouter();
  const [dateCate, setDataCate] = useState<ICategoryItem[]>([]);
  const [dataSup, setDataSup] = useState<ISupplierItem[]>([]);
  const openDetails = useBoolean(true);

  // ----------------------------------------------------------------------
  useEffect(() => {
    async function fetchCategoryData() {
      const url = 'http://localhost:8080/api/categories';
      try {
        const dataCategory = await axios.get(url);
        console.log('Category Data:', dataCategory.data.categories);
        setDataCate(dataCategory.data.categories);
      } catch (error) {
        console.error('Error fetching category data:', error);
      }
    }
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
    fetchCategoryData();
  }, []);

  // ----------------------------------------------------------------------
  const defaultValues: NewProductSchemaType = {
    productName: currentProduct?.productName || '',
    description: currentProduct?.description || '',
    unit: currentProduct?.unit || '',
    importPrice: currentProduct?.importPrice ?? null,
    salePrice: currentProduct?.salePrice ?? null,
    categoryID: currentProduct?.categoryID?.categoryID?.toString() || '',
    supplierID: currentProduct?.supplierID?.supplierID?.toString() || '',
  };

  const transformedValues: NewProductSchemaType | undefined = currentProduct
    ? {
        productName: currentProduct.productName,
        description: currentProduct.description,
        unit: currentProduct.unit,
        importPrice: currentProduct.importPrice,
        salePrice: currentProduct.salePrice,
        categoryID: currentProduct.categoryID?.categoryID.toString() || '',
        supplierID: currentProduct.supplierID?.supplierID.toString() || '',
      }
    : undefined;

  const methods = useForm<NewProductSchemaType>({
    resolver: zodResolver(NewProductSchema),
    defaultValues,
    values: transformedValues || defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    console.log('Data Update', data);

    // Nếu đang tạo mới sản phẩm
    const fixedData = currentProduct
      ? {
          ...data,
        }
      : {
          ...data,
          categoryID: data.categoryID || dateCate[0]?.categoryID || '',
          supplierID: data.supplierID || dataSup[0]?.supplierID || '',
        };

    // console.log('Response from fixedData:', fixedData);
    const apiUrl = currentProduct
      ? `http://localhost:8080/api/products/${currentProduct.productID}` // API cho cập nhật (patch)
      : 'http://localhost:8080/api/products'; // API cho tạo mới (POST)

    const method = currentProduct ? 'patch' : 'post';
    try {
      const response = await axios({
        method,
        url: apiUrl,
        data: fixedData,
      });

      reset();
      toast.success(currentProduct ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.product.root);
    } catch (error) {
      console.error(error);
    }
  });

  const renderCollapseButton = (value: boolean, onToggle: () => void) => (
    <IconButton onClick={onToggle}>
      <Iconify icon={value ? 'eva:arrow-ios-downward-fill' : 'eva:arrow-ios-forward-fill'} />
    </IconButton>
  );

  const renderDetails = () => (
    <Card>
      <CardHeader
        title="Details"
        subheader="Title, description..."
        action={renderCollapseButton(openDetails.value, openDetails.onToggle)}
        sx={{ mb: 3 }}
      />

      <Collapse in={openDetails.value}>
        <Divider />

        <Stack spacing={3} sx={{ p: 3 }}>
          <Field.Text name="productName" label="Product name" />

          <Field.Text name="description" label="Description" multiline rows={2} />
        </Stack>

        <Stack spacing={3} sx={{ p: 3 }}>
          <Box
            sx={{
              rowGap: 3,
              columnGap: 2,
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' },
            }}
          >
            <Field.Text
              name="importPrice"
              label="Import price"
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

            <Field.Text
              name="salePrice"
              label="Sale price"
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
            <Field.Text name="unit" label="Unit" />
          </Box>
        </Stack>
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
              name="categoryID"
              label="Category"
              slotProps={{
                select: { native: true },
                inputLabel: { shrink: true },
              }}
            >
              {dateCate.map((category) => (
                <option key={category.categoryID} value={category.categoryID}>
                  {category.categoryName}
                </option>
              ))}
            </Field.Select>
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
        </Stack>
      </Collapse>
    </Card>
  );

  const renderActions = () => (
    <Box>
      <Button type="submit" variant="contained" size="large" loading={isSubmitting}>
        {!currentProduct ? 'Create product' : 'Save changes'}
      </Button>
    </Box>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 } }}>
        {renderDetails()}
        {renderActions()}
      </Stack>
    </Form>
  );
}
