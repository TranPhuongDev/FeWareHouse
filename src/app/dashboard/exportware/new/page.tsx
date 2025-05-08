import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';
import { ExportCreateView } from 'src/sections/exportware/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Create a new user | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <ExportCreateView />;
}
