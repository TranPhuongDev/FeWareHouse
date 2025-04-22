import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';
import { SupplierListView } from 'src/sections/supplier/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Supplier list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <SupplierListView />;
}
