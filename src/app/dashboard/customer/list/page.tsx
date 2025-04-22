import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';
import { CustomerListView } from 'src/sections/customer/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Customer list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <CustomerListView />;
}
