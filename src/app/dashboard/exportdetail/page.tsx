import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';
import { ExportDetailListView } from 'src/sections/exportdetail/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: `Create a new export detail | Dashboard - ${CONFIG.appName}`,
};

export default function Page() {
  return <ExportDetailListView />;
}
