import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';
import axios from 'axios';
import { ImportDetailAdd } from 'src/types/importdetail';
import { ImportDetailEditView } from 'src/sections/importdetail/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Import edit | Dashboard - ${CONFIG.appName}` };

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  let currentImportDetail: ImportDetailAdd | undefined;

  try {
    const response = await axios.get<ImportDetailAdd>(
      `http://localhost:8080/api/importdetailwarehosue/${id}`
    );
    currentImportDetail = response.data;
  } catch (e: any) {
    console.error('Error fetching import:', e);
  }

  if (!currentImportDetail) {
    return <div>Import not found.</div>; // Hoặc một component hiển thị thông báo không tìm thấy
  }

  return <ImportDetailEditView currentImportDetail={currentImportDetail} />;
}
