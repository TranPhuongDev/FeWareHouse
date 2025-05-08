import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';
import { ImportDetailListView } from 'src/sections/importdetail/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: `Create a new import detail | Dashboard - ${CONFIG.appName}`,
};

export default function Page() {
  return <ImportDetailListView />;
}
