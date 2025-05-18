import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useFieldArray, useForm, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import { useRouter } from 'src/routes/hooks';

import { Form, Field } from 'src/components/hook-form';
import axios from 'axios';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ISupplierItem } from 'src/types/supplier';
import { useEffect, useState } from 'react';
import { InputAdornment } from '@mui/material';
import dayjs from 'dayjs';
import { Iconify } from 'src/components/iconify';
import { IProduct } from 'src/types/product';
import { paths } from 'src/routes/paths';
import { ExportDetailItem } from 'src/types/exportware';
import { ICustomerItem } from 'src/types/customer';

// ----------------------------------------------------------------------

export type NewImportSchemaType = zod.infer<typeof NewImportSchema>;

//
export const NewImportSchema = zod.object({
  totalAmount: zod.number({ coerce: true, message: 'giá trị lớn hơn 0' }).nullable(),
  exportDate: zod.date({
    coerce: true,
  }),
  customerID: zod.string({ message: 'Vui lòng chọn nhà cung cấp' }),
  products: zod
    .array(
      zod.object({
        productID: zod.string().min(1, { message: 'Vui lòng chọn sản phẩm' }),
        quantity: zod.number({ coerce: true }),
        salePrice: zod.number({ coerce: true }).min(1, { message: 'giá lớn hơn 0' }),
      })
    )
    .min(1, 'Cần nhập ít nhất 1 sản phẩm'),
});

// ----------------------------------------------------------------------
type Props = {
  currentExport?: ExportDetailItem;
};
export function ExportDetailNewEditForm({ currentExport }: Props) {
  const [dataCus, setDataCus] = useState<ICustomerItem[]>([]);
  const [dataPro, setDataPro] = useState<IProduct[]>([]);
  const router = useRouter();

  // ----------------------------------------------------------------------
  useEffect(() => {
    if (currentExport) {
      reset({
        customerID: String(currentExport.customerID?.customerID ?? ''),
        totalAmount: currentExport.totalAmount ?? null,
        exportDate: new Date(currentExport.exportDate),
        products: currentExport.exportDetailID.map((item) => ({
          productID: String(item.productID.productID),
          quantity: item.quantity,
        })),
      });
    }
    async function fetchCustomerData() {
      const url = 'http://localhost:8080/api/customers';
      try {
        const dataCustomer = await axios.get(url);
        console.log('dataCustomer Data:', dataCustomer.data.customers);
        setDataCus(dataCustomer.data.customers);
      } catch (error) {
        console.error('Error fetching dataCustomer data:', error);
      }
    }
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
    fetchProductData();
    fetchCustomerData();
  }, []);

  const defaultProductValues = currentExport?.exportDetailID?.map((item) => ({
    productID: String(item.productID.productID),
    quantity: item.quantity,
    salePrice: item.salePrice,
  })) || [
    {
      productID: '',
      quantity: 1,
      salePrice: 0,
    },
  ];

  const methods = useForm<NewImportSchemaType>({
    mode: 'onSubmit',
    resolver: zodResolver(NewImportSchema),
    defaultValues: {
      products: defaultProductValues,
    },
  });

  const {
    control,
    reset,
    handleSubmit,
    formState: { isSubmitting },
    watch,
    setValue,
    getValues,
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'products',
  });
  // Theo dõi toàn bộ mảng products
  const recalcTotal = () => {
    // Lấy mảng sản phẩm hiện tại
    const products = getValues('products');
    const total = products.reduce((sum, p) => {
      const q = Number(p.quantity) || 0;
      const price = Number(p.salePrice) || 0;
      return sum + q * price;
    }, 0);
    setValue('totalAmount', total);
  };

  const selectedProductIds = watch('products').map((p) => p.productID);

  // Định nghĩa interface cho dữ liệu nhập kho và chi tiết
  interface ImportData {
    customerID: number;
    totalAmount: number;
    exportDate: string;
  }

  interface ImportDetail {
    productID: number;
    quantity: number;
    salePrice: number;
  }

  interface ImportWithDetails {
    exportData: ImportData;
    exportDetails: ImportDetail[];
  }

  const onSubmit = handleSubmit(async (data) => {
    console.log('Data Update', data);

    const payload: ImportWithDetails = {
      exportData: {
        customerID: Number(data.customerID), // Chuyển string => number
        totalAmount: data.totalAmount ?? 0,
        exportDate: data.exportDate ? dayjs(data.exportDate).format('YYYY-MM-DD') : '',
      },
      exportDetails: data.products.map((product) => ({
        productID: Number(product.productID),
        quantity: Number(product.quantity),
        salePrice: Number(product.salePrice),
      })),
    };

    try {
      let response;
      if (currentExport) {
        const updatePayload = {
          customerID: Number(data.customerID),
          totalAmount: data.totalAmount ?? 0,
          exportDate: data.exportDate ? dayjs(data.exportDate).toISOString() : '',
          products: data.products.map((product) => ({
            productID: Number(product.productID),
            quantity: Number(product.quantity),
            salePrice: Number(product.salePrice),
          })),
        };
        // Gửi PUT request cập nhật
        response = await axios.patch(
          `http://localhost:8080/api/exportwarehouse/update-export-detail/${currentExport.exportID}`,
          updatePayload
        );
      } else {
        // Gửi POST request tạo mới
        response = await axios.post(
          'http://localhost:8080/api/exportwarehouse/create-export-detail',
          payload
        );
      }

      console.log('Response:', response.data);

      // Optional: redirect hoặc reset form
      router.push(paths.dashboard.goodissue.root);
      reset(); // reset form nếu muốn tạo phiếu mới
    } catch (error) {
      console.error('Error creating import warehouse:', error);
      alert('Đã xảy ra lỗi khi tạo phiếu nhập kho');
    }
  });

  return (
    <>
      <Form methods={methods} onSubmit={onSubmit}>
        <Grid container justifyContent="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ p: 3 }}>
              <Box sx={{ p: 3 }}>
                <Field.Select
                  name="customerID"
                  label="Khách hàng"
                  slotProps={{
                    select: { native: true },
                    inputLabel: { shrink: true },
                  }}
                >
                  <option value="">-- Chọn khách hàng --</option>
                  {dataCus.map((cus) => (
                    <option key={cus.customerID} value={cus.customerID}>
                      {cus.customerName}
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
                <Field.Text
                  name="totalAmount"
                  label="Tổng số tiền"
                  placeholder="0.00"
                  type="number"
                  // disabled
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
                <Controller
                  name="exportDate"
                  control={methods.control}
                  render={({ field, fieldState }) => (
                    <DatePicker
                      label="Ngày xuất hàng"
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(date) => field.onChange(date?.toDate() || null)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!fieldState.error,
                          helperText: fieldState.error?.message,
                        },
                      }}
                      sx={{ maxWidth: { md: 200 } }}
                    />
                  )}
                />
              </Box>
              {fields.map((item, index) => (
                <Box
                  key={item.id}
                  sx={{
                    p: 3,
                    gap: 1,
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: { xs: 'flex-end', md: 'center' },
                    justifyContent: 'space-between',
                  }}
                >
                  <Field.Select
                    name={`products.${index}.productID`}
                    label="Sản phẩm"
                    slotProps={{
                      select: { native: true },
                      inputLabel: { shrink: true },
                    }}
                  >
                    <option value="">-- Chọn sản phẩm --</option>
                    {dataPro.map((p) => {
                      const isSelected = selectedProductIds.includes(String(p.productID));
                      const currentValue = watch(`products.${index}.productID`);
                      // Chỉ render nếu chưa được chọn hoặc là dòng hiện tại
                      if (isSelected && String(p.productID) !== currentValue) return null;
                      return (
                        <option key={p.productID} value={p.productID}>
                          {p.productName}
                        </option>
                      );
                    })}
                  </Field.Select>

                  <Field.Text name={`products.${index}.quantity`} label="Số lượng" type="number" />

                  <Field.Text
                    name={`products.${index}.salePrice`}
                    label="Giá bán hàng"
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
                        onBlur: recalcTotal,
                      },
                    }}
                  />

                  <Button
                    size="small"
                    color="error"
                    startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                    onClick={() => remove(index)}
                  />
                </Box>
              ))}

              <Box
                sx={{
                  p: 3,
                  gap: 3,
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  alignItems: { xs: 'flex-end', md: 'center' },
                }}
              >
                <Button
                  size="small"
                  color="primary"
                  startIcon={<Iconify icon="mingcute:add-line" />}
                  onClick={() =>
                    append({
                      productID: '',
                      quantity: 1,
                      salePrice: 0,
                    })
                  }
                  sx={{ flexShrink: 0 }}
                >
                  Thêm sản phẩm
                </Button>
              </Box>

              <Stack sx={{ mt: 3, alignItems: 'center' }}>
                <Button type="submit" variant="contained" loading={isSubmitting}>
                  {currentExport ? 'Cập nhật phiếu xuất kho' : 'Tạo phiếu xuất kho'}
                </Button>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Form>
    </>
  );
}
// ----------------------------------------------------------------------
