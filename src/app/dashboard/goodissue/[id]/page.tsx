import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';
import { _invoices } from 'src/_mock/_invoice';
import { InvoiceDetailsView } from 'src/sections/goodissue/view';
import { ExportDetailItem } from 'src/types/exportware';
import axios from 'axios';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Invoice details | Dashboard - ${CONFIG.appName}` };

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;
  let currentExport: ExportDetailItem | undefined;

  try {
    const response = await axios.get<ExportDetailItem>(
      `http://localhost:8080/api/exportwarehouse/detail/${id}`
    );
    currentExport = response.data;
  } catch (e: any) {
    console.error('Error fetching import:', e);
  }

  if (!currentExport) {
    return <div>Import not found.</div>; // Hoặc một component hiển thị thông báo không tìm thấy
  }

  return <InvoiceDetailsView currentExport={currentExport} />;
}

// ----------------------------------------------------------------------
