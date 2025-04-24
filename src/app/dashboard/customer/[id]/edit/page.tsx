import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';
import axios from 'axios';
import { IAddSupplierItem } from 'src/types/supplier';
import { CustomerEditView } from 'src/sections/customer/view';
import { ICustomerItem } from 'src/types/customer';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Supplier edit | Dashboard - ${CONFIG.appName}` };

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  let currentCustomer: ICustomerItem | undefined;

  try {
    const response = await axios.get<ICustomerItem>(`http://localhost:8080/api/customers/${id}`);
    currentCustomer = response.data;
  } catch (e: any) {
    console.error('Error fetching customer:', e);
  }

  if (!currentCustomer) {
    return <div>Supplier not found.</div>; // Hoặc một component hiển thị thông báo không tìm thấy
  }

  return <CustomerEditView customer={currentCustomer} />;
}
