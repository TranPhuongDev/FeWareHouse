import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';
import { ExportListView } from 'src/sections/exportware/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Create a new export | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <ExportListView />;
}
