import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';
import { ExportDetailCreateView } from 'src/sections/exportdetail/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Create a new user | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <ExportDetailCreateView />;
}
