import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';
import axios from 'axios';
import { ImportDetailItem } from 'src/types/importware';
import { AccountantEditView } from 'src/sections/goodreceipt/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Chỉnh sửa | Dashboard - ${CONFIG.appName}` };

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  let currentImport: ImportDetailItem | undefined;

  try {
    const response = await axios.get<ImportDetailItem>(
      `http://localhost:8080/api/importwarehouse/detail/${id}`
    );
    currentImport = response.data;
  } catch (e: any) {
    console.error('Error fetching import:', e);
  }

  if (!currentImport) {
    return <div>Import not found.</div>; // Hoặc một component hiển thị thông báo không tìm thấy
  }

  return <AccountantEditView currentImport={currentImport} />;
}
