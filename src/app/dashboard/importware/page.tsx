import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';
import { ImportListView } from 'src/sections/importware/view/import-list-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Create a new import | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <ImportListView />;
}
