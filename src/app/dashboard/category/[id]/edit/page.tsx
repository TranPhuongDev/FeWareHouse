import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';
import axios from 'axios';
import { ICategoryItem } from 'src/types/category';
import { CategoryEditView } from 'src/sections/category/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Category edit | Dashboard - ${CONFIG.appName}` };

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  let currentCategory: ICategoryItem | undefined;

  try {
    const response = await axios.get<ICategoryItem>(`http://localhost:8080/api/categories/${id}`);
    currentCategory = response.data;
  } catch (e: any) {
    console.error('Error fetching category:', e);
  }

  if (!currentCategory) {
    return <div>Supplier not found.</div>; // Hoặc một component hiển thị thông báo không tìm thấy
  }

  return <CategoryEditView currentCategory={currentCategory} />;
}
