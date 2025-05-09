import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';
import axios from 'axios';
import { ExportDetail } from 'src/types/exportdetail';
import { ExportDetailEditView } from 'src/sections/exportdetail/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Export Detail edit | Dashboard - ${CONFIG.appName}` };

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  let currentExportDetail: ExportDetail | undefined;

  try {
    const response = await axios.get<ExportDetail>(
      `http://localhost:8080/api/exportdetailwarehouse/${id}`
    );
    currentExportDetail = response.data;
  } catch (e: any) {
    console.error('Error fetching import:', e);
  }

  if (!currentExportDetail) {
    return <div>Export Detail not found.</div>; // Hoặc một component hiển thị thông báo không tìm thấy
  }

  return <ExportDetailEditView currentExportDetail={currentExportDetail} />;
}
