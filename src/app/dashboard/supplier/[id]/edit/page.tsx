import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';
import { SupplierEditView } from 'src/sections/supplier/view';
import axios from 'axios';
import { IAddSupplierItem } from 'src/types/supplier';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Supplier edit | Dashboard - ${CONFIG.appName}` };

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  let currentSupplier: IAddSupplierItem | undefined;

  try {
    const response = await axios.get<IAddSupplierItem>(`http://localhost:8080/api/suppliers/${id}`);
    currentSupplier = response.data;
  } catch (e: any) {
    console.error('Error fetching supplier:', e);
  }

  if (!currentSupplier) {
    return <div>Supplier not found.</div>; // Hoặc một component hiển thị thông báo không tìm thấy
  }

  return <SupplierEditView supplier={currentSupplier} />;
}
