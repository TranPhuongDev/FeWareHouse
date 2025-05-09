import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';
import axios from 'axios';

import { ExportEditView } from 'src/sections/exportware/view';
import { ExportItem } from 'src/types/exportware';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Export edit | Dashboard - ${CONFIG.appName}` };

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  let currentExport: ExportItem | undefined;

  try {
    const response = await axios.get<ExportItem>(`http://localhost:8080/api/exportwarehouse/${id}`);
    currentExport = response.data;
  } catch (e: any) {
    console.error('Error fetching export:', e);
  }

  if (!currentExport) {
    return <div>Export not found.</div>; // Hoặc một component hiển thị thông báo không tìm thấy
  }

  return <ExportEditView currentExport={currentExport} />;
}
