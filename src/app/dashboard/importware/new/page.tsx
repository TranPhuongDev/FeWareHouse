import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';
import { ImportCreateView } from 'src/sections/importware/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Create a new user | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <ImportCreateView />;
}
