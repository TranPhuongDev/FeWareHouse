import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';
import axios from 'axios';
import { ICategoryItem } from 'src/types/category';
import { CategoryEditView } from 'src/sections/category/view';
import { ImportNewEditForm } from 'src/sections/importware/import-new-edit-form';
import { ImportItemAdd } from 'src/types/importware';
import { ImportEditView } from 'src/sections/importware/view';
import { ExportItemAdd } from 'src/types/exportware';
import { ExportEditView } from 'src/sections/exportware/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Import edit | Dashboard - ${CONFIG.appName}` };

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  let currentExport: ExportItemAdd | undefined;

  try {
    const response = await axios.get<ExportItemAdd>(
      `http://localhost:8080/api/exportwarehouse/${id}`
    );
    currentExport = response.data;
  } catch (e: any) {
    console.error('Error fetching import:', e);
  }

  if (!currentExport) {
    return <div>Import not found.</div>; // Hoặc một component hiển thị thông báo không tìm thấy
  }

  return <ExportEditView currentExport={currentExport} />;
}
