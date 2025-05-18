import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';
import axios from 'axios';
import { ImportDetailItem } from 'src/types/importware';
import { GoodIssueEditView } from 'src/sections/goodissue/view/exportdetail-edit-view';
import { ExportDetailItem } from 'src/types/exportware';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Chỉnh sửa | Dashboard - ${CONFIG.appName}` };

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

  return <GoodIssueEditView currentExport={currentExport} />;
}
