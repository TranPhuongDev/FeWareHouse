import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';
import axios from 'axios';
import { ImportItem } from 'src/types/importware';
import { ImportEditView } from 'src/sections/importware/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Import edit | Dashboard - ${CONFIG.appName}` };

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  let currentImport: ImportItem | undefined;

  try {
    const response = await axios.get<ImportItem>(`http://localhost:8080/api/importwarehouse/${id}`);
    currentImport = response.data;
  } catch (e: any) {
    console.error('Error fetching import:', e);
  }

  if (!currentImport) {
    return <div>Import not found.</div>; // Hoặc một component hiển thị thông báo không tìm thấy
  }

  return <ImportEditView currentImport={currentImport} />;
}
