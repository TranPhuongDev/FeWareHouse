import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';
import { ExportDetailAccountantListView } from 'src/sections/goodissue/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Tạo phiếu xuất kho| Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <ExportDetailAccountantListView />;
}
